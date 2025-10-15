import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

interface HistoryState<T> {
  funnelStep: T;
}

interface UseFunnelOptions {
  history?: boolean;
}

/**
 * 메타 정보
 */
export interface FunnelMeta {
  /**
   * 현재 단계의 인덱스
   */
  currentIndex: number;

  /**
   * 전체 step의 개수
   */
  length: number;

  /**
   * 현재 step이 첫 번째인지 여부
   */
  isFirst: boolean;

  /**
   * 현재 step이 마지막인지 여부
   */
  isLast: boolean;

  /**
   * 이전 단계로 이동할 수 있는지 여부
   */
  canPrev: boolean;

  /**
   * 다음 단계로 이동할 수 있는지 여부
   */
  canNext: boolean;
}

interface UseFunnelReturn<S extends readonly string[]> {
  Funnel: React.ComponentType<{ step: S[number]; children: React.ReactNode }> & {
    Step: React.FC<{ name: S[number]; children: React.ReactNode }>;
  };
  step: S[number];
  next: () => void;
  prev: () => void;
  setStep: (step: S[number]) => void; // 필요 시 노출
  meta: FunnelMeta;
}

/**
 * `useFunnel` 훅은 단계별 UI를 간단히 구성하고, 옵션에 따라 브라우저 히스토리와 동기화할 수 있는 훅입니다.
 *
 * - 현재 스텝을 컨텍스트로 내려주는 `<Funnel>` 컴포넌트와 `<Funnel.Step>`를 제공합니다.
 * - `next`, `prev`로 단계 이동이 가능하며, `history: true`일 때는 `pushState`/`popstate`로 브라우저의
 *   뒤로가기/앞으로가기 버튼과도 동기화됩니다.
 * - `history: false`일 때는 내부 상태로만 동작합니다.
 *
 * @template S 문자열 리터럴 배열 타입 (예: `['Intro','Form','Confirm'] as const`)
 * @param {S} steps - 순서가 있는 단계 목록 (리터럴 배열 권장: `as const`)
 * @param {UseFunnelOptions} [options] - { history?: boolean }
 *
 * @returns {UseFunnelReturn<S>}
 * - `Funnel`: 현재 스텝을 컨텍스트로 제공하는 컴포넌트
 * - `Funnel.Step`: 자신이 받은 `name`이 현재 스텝일 때만 children을 렌더
 * - `step`: 현재 스텝 값
 * - `next`: 다음 스텝으로 이동하는 함수 (마지막 스텝에서는 유지)
 * - `prev`: 이전 스텝으로 이동하는 함수 (첫 스텝에서는 유지, history 옵션이 true면 `window.history.back()` 동작)
 * - `setStep`: 특정 스텝으로 직접 이동하는 함수
 * - `meta`: 현재 스텝을 기준으로 계산된 파생 메타데이터
 *   - `currentIndex`: 현재 스텝의 0-based 인덱스
 *   - `length`: 전체 스텝 개수
 *   - `isFirst`/`isLast`: 첫/마지막 스텝 여부
 *   - `canPrev`/`canNext`: 이전/다음 스텝으로 이동 가능 여부
 */
const useFunnel = <S extends readonly string[]>(
  steps: S,
  options: UseFunnelOptions = { history: true }
): UseFunnelReturn<S> => {
  type T = S[number];
  const historyEnabled = options.history;
  const stepsMutable = useMemo(() => [...steps], [steps]);

  const { Funnel, step, setStep, stepPrev, stepNext, meta } = useInitialFunnel<T>(stepsMutable);
  const navigateToStep = useFunnelHistory(historyEnabled, step, setStep);

  const next = useCallback(() => {
    // funnel 변경
    stepNext();

    // 2) history 연동 옵션이면 push
    if (historyEnabled) {
      const nextStep = steps[meta.currentIndex + 1];
      navigateToStep(nextStep);
    }
  }, [stepNext, historyEnabled, steps, navigateToStep, meta.currentIndex]);

  const prev = useCallback(() => {
    if (historyEnabled) {
      // prev 함수를 사용할 필요가 없음.
      // 크롬의 뒤로가기 버튼에 현재 funnel의 동작을 넣어놨기 때문에, 그것에 맞는 행동을 시키면 동일하게 동작
      window.history.back();
    } else {
      // 내부 상태만 이전 스텝으로
      stepPrev();
    }
  }, [historyEnabled, stepPrev]);

  return { Funnel, step, next, prev, setStep, meta };
};

export default useFunnel;

const useInitialFunnel = <T extends string>(initialSteps: T[]) => {
  const [step, setStep] = useState<T>(initialSteps[0]);
  const length = initialSteps.length;

  const indexMap = useMemo(() => {
    const m = new Map<T, number>();
    initialSteps.forEach((s, i) => m.set(s, i));
    return m;
  }, [initialSteps]);

  const stepPrev = useCallback(() => {
    setStep((prev) => {
      const idx = indexMap.get(prev)!;
      return idx > 0 ? initialSteps[idx - 1] : prev;
    });
  }, [indexMap, initialSteps]);

  const stepNext = useCallback(() => {
    setStep((prev) => {
      const idx = indexMap.get(prev)!;
      return idx >= 0 && idx < length - 1 ? initialSteps[idx + 1] : prev;
    });
  }, [indexMap, initialSteps, length]);

  const Funnel = useMemo(() => createFunnelComponents<T>(), []);

  // 부가정보를 위한 로직
  const index = indexMap.get(step) ?? 0;
  const meta: FunnelMeta = {
    currentIndex: index,
    length,
    isFirst: index === 0,
    isLast: index === length - 1,
    canPrev: index > 0,
    canNext: index < length - 1,
  };

  return { Funnel, step, setStep, stepNext, stepPrev, meta };
};

/* ---------------- UI components ---------------- */

const createFunnelComponents = <T extends string>() => {
  const StepContext = createContext<T | null>(null);

  const Funnel = ({ step, children }: { step: T; children: React.ReactNode }) => {
    return <StepContext.Provider value={step}>{children}</StepContext.Provider>;
  };

  Funnel.Step = function Content({ name, children }: { name: T; children: React.ReactNode }) {
    const step = useContext(StepContext);
    if (step == null) throw new Error('Funnel.Step는 <Funnel> 내부에서 사용해야한다.');
    return step === name ? children : null;
  };
  return Funnel;
};

/* ---------------- history (optional) ---------------- */

const useFunnelHistory = <T extends string>(enabled: boolean, currentStep: T, updateStep: (step: T) => void) => {
  const currentStepRef = useRef(currentStep);
  const updateStepRef = useRef(updateStep);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);
  useEffect(() => {
    updateStepRef.current = updateStep;
  }, [updateStep]);

  // 초기에 현재 퍼널을 넣는다.
  useEffect(() => {
    if (!enabled) return;
    const historyState: HistoryState<T> = {
      funnelStep: currentStepRef.current,
    };
    window.history.replaceState(historyState, '', window.location.href);
  }, [enabled]);

  // 브라우저 뒤로가기/앞으로가기 처리
  useEffect(() => {
    if (!enabled) return;
    const handleBrowserNavigation = (event: PopStateEvent) => {
      const historyState = event.state as HistoryState<T>;

      if (historyState?.funnelStep) {
        updateStepRef.current(historyState.funnelStep);
      }
    };

    window.addEventListener('popstate', handleBrowserNavigation);
    return () => window.removeEventListener('popstate', handleBrowserNavigation);
  }, [enabled]);

  // 다음 스텝으로 이동 (히스토리에 새 항목 추가)
  const navigateToStep = useCallback(
    (nextStep: T) => {
      if (!enabled) return;
      const historyState: HistoryState<T> = {
        funnelStep: nextStep,
      };
      window.history.pushState(historyState, '', window.location.href);
    },
    [enabled]
  );

  return navigateToStep;
};
