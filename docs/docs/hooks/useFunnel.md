# useFunnel

단계별(멀티스텝) UI 흐름을 간단히 관리하고, 옵션에 따라 **브라우저 히스토리**(뒤로가기/앞으로가기)와 동기화할 수 있는 커스텀 React Hook입니다.

- `<Funnel>` / `<Funnel.Step>` 컴포넌트 wrapper로 **스텝별 조건 렌더링**을 간결하게 구현
- `next()` / `prev()`로 단계 이동
- `history: true` 시 `pushState`/`popstate` 기반으로 **브라우저 뒤/앞 이동과 상태 동기화**

---

## 🔗 사용법

```tsx
const { Funnel, step, next, prev, setStep } = useFunnel(steps, options?);
```

---

## 📥 매개변수

| 이름      | 타입                | 설명                                     |
| --------- | ------------------- | ---------------------------------------- |
| `steps`   | `readonly string[]` | 단계 목록 / 리터럴 배열(`as const`) 권장 |
| `options` | `UseFunnelOptions?` | 선택값 / 히스토리 연동 여부 설정         |

### 🔧 `options` 구조

| 필드      | 타입       | 설명                                               |
| --------- | ---------- | -------------------------------------------------- |
| `history` | `boolean?` | `true`면 브라우저 히스토리와 동기화 (기본: `true`) |

---

## 🔁 반환값

| 키        | 타입                            | 설명                                                                                     |
| --------- | ------------------------------- | ---------------------------------------------------------------------------------------- |
| `Funnel`  | 컴포넌트 & 정적 `Step` 컴포넌트 | 현재 `step`을 컨텍스트로 내려줌. `Funnel.Step`은 `name`이 현재 스텝일 때만 children 렌더 |
| `step`    | `S[number]`                     | 현재 스텝 값                                                                             |
| `next`    | `() => void`                    | 다음 스텝으로 이동. 마지막 스텝에서는 유지(히스토리도 push 없음)                         |
| `prev`    | `() => void`                    | 이전 스텝으로 이동. 첫 스텝에서는 유지. `history: true`면 `window.history.back()` 실행   |
| `setStep` | `(step: S[number]) => void`     | 특정 스텝으로 직접 이동                                                                  |

---

## ✅ 예시

### 1) 기본 예시 (히스토리 연동: 기본 활성)

- 별도의 옵션을 주지 않아도, 브라우저 **뒤로가기/앞으로가기** 버튼과 동기화됩니다.

```tsx
import { useFunnel } from 'hookdle';

const steps = ['Intro', 'Calendar', 'Basic', 'Confirm'] as const;

export default function CreateEvent() {
  const { Funnel, step, next, prev } = useFunnel(steps);

  return (
    <div>
      <h3>Step: {step}</h3>

      <Funnel step={step}>
        <Funnel.Step name="Intro">인트로</Funnel.Step>
        <Funnel.Step name="Calendar">달력</Funnel.Step>
        <Funnel.Step name="Basic">기본 정보</Funnel.Step>
        <Funnel.Step name="Confirm">확인</Funnel.Step>
      </Funnel>

      <button onClick={prev}>이전(뒤로가기)</button>
      <button onClick={next}>다음(push)</button>
    </div>
  );
}
```

### 2) 히스토리 비활성 (내부 상태만)

- 필요 시 `history: false`로 지정하면, 브라우저 히스토리와는 연동하지 않고 내부 상태만으로 동작합니다.

```tsx
const steps = ['Intro', 'Calendar', 'Basic', 'Confirm'] as const;

function CreateEventWithoutHistory() {
  const { Funnel, step, next, prev } = useFunnel(steps, { history: false });

  return (
    <>
      <Funnel step={step}>
        <Funnel.Step name="Intro">인트로</Funnel.Step>
        <Funnel.Step name="Calendar">달력</Funnel.Step>
        <Funnel.Step name="Basic">기본</Funnel.Step>
        <Funnel.Step name="Confirm">확인</Funnel.Step>
      </Funnel>

      <button onClick={prev}>이전</button>
      <button onClick={next}>다음</button>
    </>
  );
}
```

### 3) 특정 스텝으로 점프

```tsx
const steps = ['Intro', 'Form', 'Confirm'] as const;

function JumpExample() {
  const { Funnel, step, setStep } = useFunnel(steps);

  return (
    <>
      <Funnel step={step}>
        <Funnel.Step name="Intro">Intro</Funnel.Step>
        <Funnel.Step name="Form">Form</Funnel.Step>
        <Funnel.Step name="Confirm">Confirm</Funnel.Step>
      </Funnel>

      <button onClick={() => setStep('Confirm')}>바로 Confirm으로</button>
    </>
  );
}
```

---

## 🧩 팁

- **리터럴 배열**: `const steps = ['A','B','C'] as const` → `step`/`setStep`/`Funnel.Step name`에 자동완성/타입 안전

---

## 💡 만약 이 훅이 없다면?

- 각 스텝에서 조건 렌더링을 매번 구현해야 하고,
- 상태/히스토리/뒤로가기 동작을 직접 동기화해야 하며,
- 경계/중복 로직 관리가 번거롭습니다.

```tsx
import React, { useCallback, useMemo, useState, createContext, useContext } from 'react';

type Step = 'Intro' | 'Calendar' | 'Basic' | 'Confirm';
const steps = ['Intro', 'Calendar', 'Basic', 'Confirm'] as const;

const StepContext = createContext<Step | null>(null);

function Funnel({ step, children }: { step: Step; children: React.ReactNode }) {
  return <StepContext.Provider value={step}>{children}</StepContext.Provider>;
}

Funnel.Step = function FunnelStep({ name, children }: { name: Step; children: React.ReactNode }) {
  const step = useContext(StepContext);
  if (step == null) throw new Error('Funnel.Step는 <Funnel> 내부에서 사용해야 합니다.');
  return step === name ? <>{children}</> : null;
};

export default function ManualFunnelBasic() {
  const [step, setStep] = useState<Step>(steps[0]);

  const indexMap = useMemo(() => {
    const m = new Map<Step, number>();
    steps.forEach((s, i) => m.set(s, i));
    return m;
  }, []);

  const next = useCallback(() => {
    setStep((prev) => {
      const i = indexMap.get(prev) ?? -1;
      return i >= 0 && i < steps.length - 1 ? steps[i + 1] : prev;
    });
  }, [indexMap]);

  const prev = useCallback(() => {
    setStep((prev) => {
      const i = indexMap.get(prev) ?? -1;
      return i > 0 ? steps[i - 1] : prev;
    });
  }, [indexMap]);

  return (
    <div>
      <h3>Step: {step}</h3>
      <Funnel step={step}>
        <Funnel.Step name="Intro">인트로</Funnel.Step>
        <Funnel.Step name="Calendar">달력</Funnel.Step>
        <Funnel.Step name="Basic">기본</Funnel.Step>
        <Funnel.Step name="Confirm">확인</Funnel.Step>
      </Funnel>

      <div style={{ marginTop: 8 }}>
        <button onClick={prev}>이전</button>
        <button onClick={next} style={{ marginLeft: 8 }}>
          다음
        </button>
        <button onClick={() => setStep('Confirm')} style={{ marginLeft: 8 }}>
          점프: Confirm
        </button>
      </div>
    </div>
  );
}
```
