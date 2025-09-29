import { useCallback, useEffect, useMemo, useRef } from 'react';

type ItemWithId = { id: string | number };

interface OptionsType {
  selector?: string;
  idAttribute?: string;
  stopPropagation?: boolean;
  preventDefault?: boolean;
}

/**
 * 이벤트 위임(Event Delegation)을 사용하여 대량의 요소에 대한 이벤트 처리를 최적화하는 React 훅입니다.
 *
 * 이 훅은 다음을 제공합니다:
 * - `dataList`의 각 항목을 id로 매핑한 내부 Map을 생성하여 빠르게 조회합니다.
 * - 부모 컨테이너에 하나의 이벤트 핸들러를 등록하고, 발생한 이벤트의 타겟이 `selector` 또는
 *   `idAttribute`와 일치하는 하위 요소일 때만 콜백을 호출합니다.
 * - 최초 마운트 시에는 이벤트를 무시하고(업데이트 시에만 실행) 최신 콜백을 사용하기 위해 내부적으로
 *   `callbackRef`를 사용합니다.
 *
 * @template T - 각 항목이 `id` 프로퍼티를 가진 타입
 * @param dataList - 이벤트와 연결될 데이터 배열 (각 항목은 `id: string | number` 를 가져야 함)
 * @param callback - 이벤트가 발생했을 때 실행될 콜백 함수. 시그니처는 `(event, data, el)` 입니다.
 * @param options - 추가 옵션
 * @param options.selector - 요소를 찾을 CSS selector (지정하면 이 selector를 사용)
 * @param options.idAttribute - 요소에서 id를 읽어올 속성명. 기본값 `'data-id'`.
 *                                  (selector가 주어지지 않으면 `[${options.idAttribute}]`가 사용됩니다)
 * @param options.stopPropagation - true면 이벤트에 대해 stopPropagation()을 호출합니다.
 * @param options.preventDefault - true면 이벤트에 대해 preventDefault()를 호출합니다.
 * @returns React SyntheticEvent를 인자로 받는 핸들러 함수 (예: onClick)
 *
 * @example
 * ```tsx
 * const items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
 *
 * // 기본 사용: data-id 속성을 사용
 * const handleItemClick = useEventDelegation(items, (e, item) => {
 *   console.log(item.name);
 * });
 *
 * // 커스텀 속성 사용 예시
 * const handleItemClick2 = useEventDelegation(items, (e, item) => {
 *   console.log(item.name);
 * }, { idAttribute: 'data-key' });
 *
 * return (
 *   <div onClick={handleItemClick}>
 *     {items.map(item => (
 *       <button key={item.id} data-id={item.id}>{item.name}</button>
 *     ))}
 *   </div>
 * );
 * ```
 *
 * @remarks
 * - 이 훅은 내부적으로 `callbackRef`를 사용하여 최신 콜백을 참조하므로, 외부에서 콜백이 바뀌어도
 *   핸들러를 재생성하지 않습니다.
 */
export function useEventDelegation<T extends ItemWithId>(
  dataList: readonly T[],
  callback: (event: React.SyntheticEvent, data: T, el: HTMLElement) => void,
  options?: OptionsType
): (event: React.SyntheticEvent) => void {
  const callbackRef = useRef(callback);
  const { selector, idAttribute = 'data-id', stopPropagation = false, preventDefault = false } = options || {};

  const effectiveSelector = selector ?? `[${idAttribute}]`;

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const map = useMemo(
    () => dataList.reduce((acc, data) => acc.set(String(data.id), data), new Map<string, T>()),
    [dataList]
  );

  const handler = useCallback(
    (event: React.SyntheticEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const candidate = target.matches?.(effectiveSelector) ? target : target.closest?.(effectiveSelector);
      if (!candidate || !(candidate instanceof Element)) return;

      const matchedElement = candidate as Element;
      if (!(matchedElement instanceof HTMLElement)) return;

      const key = matchedElement.getAttribute(idAttribute);
      if (!key) return;

      const data = map.get(key);
      if (!data) return;

      if (stopPropagation) event.stopPropagation?.();
      if (preventDefault) event.preventDefault?.();

      callbackRef.current?.(event, data, matchedElement);
    },
    [effectiveSelector, idAttribute, map, stopPropagation, preventDefault]
  );

  return handler;
}
