import { useState, useCallback } from 'react';

/**
 * 체크 가능한 아이템의 최소 형태를 정의합니다.
 *
 * @property {string | number} [id] - 아이템을 구분하는 고유 식별자
 * @property {boolean} [checked] - 현재 선택 여부
 */
export interface CheckableItem {
  id?: string | number;
  checked?: boolean;
}

/**
 * 제네릭 타입 T에서 id 필드의 타입만 추출합니다.
 * id가 string | number 이외의 타입이면 기본적으로 string | number로 처리됩니다.
 *
 * @template T - CheckableItem을 확장하는 타입
 */
export type IdType<T extends CheckableItem> = T['id'] extends string | number ? T['id'] : string | number;

/**
 * useCheckList 훅이 반환하는 객체의 타입을 정의합니다.
 *
 * @template T - CheckableItem을 확장하는 타입
 * @property {T[]} list - 현재 관리 중인 아이템 리스트
 * @property {(items: T[]) => void} set - 리스트 전체를 새로운 배열로 교체
 * @property {(id: IdType<T>) => boolean | undefined} isChecked - 특정 아이템이 체크되었는지 여부 반환
 * @property {() => boolean} isAllChecked - 모든 아이템이 체크되었는지 여부 반환
 * @property {(id: IdType<T>) => void} checkItem - 특정 아이템을 체크 처리
 * @property {(id: IdType<T>) => void} unCheckItem - 특정 아이템을 체크 해제
 * @property {(id: IdType<T>) => void} toggleItem - 특정 아이템의 체크 상태를 토글
 * @property {(id: IdType<T>, checked: boolean) => void} updateItem - 특정 아이템의 체크 상태를 명시적으로 설정
 * @property {() => void} toggleAll - 모든 아이템의 체크 상태를 반전
 * @property {() => void} checkAll - 모든 아이템을 체크 상태로 설정
 * @property {() => void} unCheckAll - 모든 아이템을 체크 해제 상태로 설정
 * @property {(checked: boolean) => void} updateAll - 모든 아이템의 체크 상태를 일괄 변경
 * @property {() => T[]} getCheckedList - 체크된 아이템 리스트 반환
 * @property {() => IdType<T>[]} getCheckedIds - 체크된 아이템들의 ID 배열 반환
 * @property {number} [selectedCount] - 체크된 아이템의 개수 (선택적)
 */
export interface UseCheckListReturns<T extends CheckableItem> {
  list: T[];
  set: (items: T[]) => void;
  isChecked: (id: IdType<T>) => boolean | undefined;
  isAllChecked: () => boolean;
  checkItem: (id: IdType<T>) => void;
  unCheckItem: (id: IdType<T>) => void;
  toggleItem: (id: IdType<T>) => void;
  updateItem: (id: IdType<T>, checked: boolean) => void;
  toggleAll: () => void;
  checkAll: () => void;
  unCheckAll: () => void;
  updateAll: (checked: boolean) => void;
  getCheckedList: () => T[];
  getCheckedIds: () => IdType<T>[];
  selectedCount?: number;
}

export type UseCheckListHook = <T extends CheckableItem>(initialItems: T[]) => UseCheckListReturns<T>;

/**
 * useCheckList 훅
 * 체크리스트 상태를 관리하는 커스텀 훅
 */
export const useCheckList: UseCheckListHook = <T extends CheckableItem>(initialItems: T[]) => {
  // 단순 배열 (ex) [1,2,3] ) 일 때 id, checked 를 붙여서 데이터 구조 통일하고자 함
  const normalizeItems = useCallback((items: T[]): T[] => {
    return items.map((item, index) => ({
      ...item,
      id: item.id ?? `item-${index}`,
      checked: item.checked ?? false,
    }));
  }, []);

  const [list, setList] = useState<T[]>(() => normalizeItems(initialItems));

  // 리스트 설정 (외부에서 전체 리스트 갱신할 때 사용)
  const set = useCallback(
    (items: T[]) => {
      setList(normalizeItems(items));
    },
    [normalizeItems]
  );

  // 특정 아이템이 체크되어 있는지 확인
  const isChecked = useCallback(
    (id: IdType<T>) => {
      const item = list.find((item) => item.id === id);
      return item?.checked;
    },
    [list]
  );

  // 모든 아이템이 체크되어 있는지 확인
  const isAllChecked = useCallback(() => {
    if (list.length === 0) return false;
    return list.every((item) => item.checked);
  }, [list]);

  // 특정 아이템 업데이트
  const updateItem = useCallback((id: IdType<T>, checked: boolean) => {
    setList((prev) => prev.map((item) => (item.id === id ? { ...item, checked } : item)));
  }, []);

  // 특정 아이템 체크
  const checkItem = useCallback((id: IdType<T>) => updateItem(id, true), [updateItem]);

  // 특정 아이템 체크해제
  const unCheckItem = useCallback((id: IdType<T>) => updateItem(id, false), [updateItem]);

  // 특정 아이템 토글
  const toggleItem = useCallback((id: IdType<T>) => {
    setList((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  }, []);

  // 전체 토글
  const toggleAll = useCallback(() => {
    const allChecked = isAllChecked();
    setList((prev) => prev.map((item) => ({ ...item, checked: !allChecked })));
  }, [isAllChecked]);

  // 전체 업데이트
  const updateAll = useCallback((checked: boolean) => {
    setList((prev) => prev.map((item) => ({ ...item, checked })));
  }, []);

  // 전체 체크
  const checkAll = useCallback(() => {
    updateAll(true);
  }, [updateAll]);

  // 전체 체크 해제
  const unCheckAll = useCallback(() => {
    updateAll(false);
  }, [updateAll]);

  // 체크된 아이템 리스트 반환
  const getCheckedList = useCallback(() => {
    return list.filter((item) => item.checked);
  }, [list]);

  // 체크된 아이템의 ID 리스트 반환
  const getCheckedIds = useCallback(() => {
    return list.filter((item) => item.checked).map((item) => item.id!);
  }, [list]);

  // 선택된 개수
  const selectedCount = list.filter((item) => item.checked).length;

  // 전체 개수의 경우 list 의 길이와 같을 것이라서 제외

  return {
    list,
    set,
    isChecked,
    isAllChecked,
    checkItem,
    unCheckItem,
    toggleItem,
    updateItem,
    toggleAll,
    checkAll,
    unCheckAll,
    updateAll,
    getCheckedList,
    getCheckedIds,
    selectedCount,
  };
};
