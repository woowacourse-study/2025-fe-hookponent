import { renderHook, act } from '@testing-library/react';
import { useCheckList, CheckableItem } from './useCheckList';

describe('useCheckList', () => {
  interface TestItem extends CheckableItem {
    id: number;
    name: string;
    checked?: boolean;
  }

  const mockItems: TestItem[] = [
    { id: 1, name: 'Item 1', checked: false },
    { id: 2, name: 'Item 2', checked: true },
    { id: 3, name: 'Item 3', checked: false },
  ];

  describe('초기화', () => {
    it('초기 아이템으로 리스트를 초기화해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      expect(result.current.list).toHaveLength(3);
      expect(result.current.list[0].checked).toBe(false);
      expect(result.current.list[1].checked).toBe(true);
    });

    it('id가 없는 아이템에 자동으로 id를 할당해야 한다', () => {
      const itemsWithoutId = [{ name: 'Item 1' }, { name: 'Item 2' }] as TestItem[];

      const { result } = renderHook(() => useCheckList(itemsWithoutId));

      expect(result.current.list[0].id).toBe('item-0');
      expect(result.current.list[1].id).toBe('item-1');
    });

    it('checked가 없는 아이템에 false를 할당해야 한다', () => {
      const itemsWithoutChecked = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ] as TestItem[];

      const { result } = renderHook(() => useCheckList(itemsWithoutChecked));

      expect(result.current.list[0].checked).toBe(false);
      expect(result.current.list[1].checked).toBe(false);
    });
  });

  describe('set', () => {
    it('새로운 아이템 리스트로 교체해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));
      const newItems: TestItem[] = [
        { id: 4, name: 'New Item 1', checked: false },
        { id: 5, name: 'New Item 2', checked: true },
      ];

      act(() => {
        result.current.set(newItems);
      });

      expect(result.current.list).toHaveLength(2);
      expect(result.current.list[0].id).toBe(4);
      expect(result.current.list[1].id).toBe(5);
    });
  });

  describe('isChecked', () => {
    it('체크된 아이템의 경우 true를 반환해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      expect(result.current.isChecked(2)).toBe(true);
    });

    it('체크되지 않은 아이템의 경우 false를 반환해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      expect(result.current.isChecked(1)).toBe(false);
    });

    it('존재하지 않는 id의 경우 undefined를 반환해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      expect(result.current.isChecked(999)).toBeUndefined();
    });
  });

  describe('isAllChecked', () => {
    it('모든 아이템이 체크된 경우 true를 반환해야 한다', () => {
      const allCheckedItems: TestItem[] = [
        { id: 1, name: 'Item 1', checked: true },
        { id: 2, name: 'Item 2', checked: true },
      ];
      const { result } = renderHook(() => useCheckList(allCheckedItems));

      expect(result.current.isAllChecked()).toBe(true);
    });

    it('일부만 체크된 경우 false를 반환해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      expect(result.current.isAllChecked()).toBe(false);
    });

    it('빈 리스트의 경우 false를 반환해야 한다', () => {
      const { result } = renderHook(() => useCheckList([]));

      expect(result.current.isAllChecked()).toBe(false);
    });
  });

  describe('checkItem', () => {
    it('특정 아이템을 체크해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      act(() => {
        result.current.checkItem(1);
      });

      expect(result.current.isChecked(1)).toBe(true);
      expect(result.current.isChecked(2)).toBe(true); // 기존 체크 상태 유지
    });
  });

  describe('unCheckItem', () => {
    it('특정 아이템의 체크를 해제해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      act(() => {
        result.current.unCheckItem(2);
      });

      expect(result.current.isChecked(2)).toBe(false);
      expect(result.current.isChecked(1)).toBe(false); // 기존 체크 상태 유지
    });
  });

  describe('toggleItem', () => {
    it('체크되지 않은 아이템을 체크해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      act(() => {
        result.current.toggleItem(1);
      });

      expect(result.current.isChecked(1)).toBe(true);
    });

    it('체크된 아이템의 체크를 해제해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      act(() => {
        result.current.toggleItem(2);
      });

      expect(result.current.isChecked(2)).toBe(false);
    });
  });

  describe('updateItem', () => {
    it('특정 아이템의 체크 상태를 업데이트해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      act(() => {
        result.current.updateItem(1, true);
      });

      expect(result.current.isChecked(1)).toBe(true);

      act(() => {
        result.current.updateItem(1, false);
      });

      expect(result.current.isChecked(1)).toBe(false);
    });
  });

  describe('toggleAll', () => {
    it('모든 아이템이 체크되지 않았을 때 모두 체크해야 한다', () => {
      const allUncheckedItems: TestItem[] = [
        { id: 1, name: 'Item 1', checked: false },
        { id: 2, name: 'Item 2', checked: false },
      ];
      const { result } = renderHook(() => useCheckList(allUncheckedItems));

      act(() => {
        result.current.toggleAll();
      });

      expect(result.current.isAllChecked()).toBe(true);
    });

    it('모든 아이템이 체크되었을 때 모두 체크 해제해야 한다', () => {
      const allCheckedItems: TestItem[] = [
        { id: 1, name: 'Item 1', checked: true },
        { id: 2, name: 'Item 2', checked: true },
      ];
      const { result } = renderHook(() => useCheckList(allCheckedItems));

      act(() => {
        result.current.toggleAll();
      });

      expect(result.current.isAllChecked()).toBe(false);
    });

    it('일부만 체크되었을 때 모두 체크해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      act(() => {
        result.current.toggleAll();
      });

      expect(result.current.isAllChecked()).toBe(true);
    });
  });

  describe('checkAll', () => {
    it('모든 아이템을 체크해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      act(() => {
        result.current.checkAll();
      });

      expect(result.current.isAllChecked()).toBe(true);
      expect(result.current.selectedCount).toBe(3);
    });
  });

  describe('unCheckAll', () => {
    it('모든 아이템의 체크를 해제해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      act(() => {
        result.current.unCheckAll();
      });

      expect(result.current.isAllChecked()).toBe(false);
      expect(result.current.selectedCount).toBe(0);
    });
  });

  describe('updateAll', () => {
    it('모든 아이템의 체크 상태를 업데이트해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      act(() => {
        result.current.updateAll(true);
      });

      expect(result.current.isAllChecked()).toBe(true);

      act(() => {
        result.current.updateAll(false);
      });

      expect(result.current.isAllChecked()).toBe(false);
    });
  });

  describe('getCheckedList', () => {
    it('체크된 아이템 리스트만 반환해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      const checkedList = result.current.getCheckedList();

      expect(checkedList).toHaveLength(1);
      expect(checkedList[0].id).toBe(2);
    });

    it('체크된 아이템이 없으면 빈 배열을 반환해야 한다', () => {
      const allUncheckedItems: TestItem[] = [
        { id: 1, name: 'Item 1', checked: false },
        { id: 2, name: 'Item 2', checked: false },
      ];
      const { result } = renderHook(() => useCheckList(allUncheckedItems));

      const checkedList = result.current.getCheckedList();

      expect(checkedList).toHaveLength(0);
    });
  });

  describe('getCheckedIds', () => {
    it('체크된 아이템의 ID 리스트만 반환해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      const checkedIds = result.current.getCheckedIds();

      expect(checkedIds).toHaveLength(1);
      expect(checkedIds[0]).toBe(2);
    });

    it('여러 개가 체크된 경우 모든 ID를 반환해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      act(() => {
        result.current.checkAll();
      });

      const checkedIds = result.current.getCheckedIds();

      expect(checkedIds).toHaveLength(3);
      expect(checkedIds).toEqual([1, 2, 3]);
    });
  });

  describe('selectedCount', () => {
    it('선택된 아이템의 개수를 반환해야 한다', () => {
      const { result } = renderHook(() => useCheckList(mockItems));

      expect(result.current.selectedCount).toBe(1);

      act(() => {
        result.current.checkItem(1);
      });

      expect(result.current.selectedCount).toBe(2);

      act(() => {
        result.current.checkAll();
      });

      expect(result.current.selectedCount).toBe(3);
    });
  });

  describe('엣지 케이스', () => {
    it('빈 배열로 초기화되어도 정상 동작해야 한다', () => {
      const { result } = renderHook(() => useCheckList([]));

      expect(result.current.list).toHaveLength(0);
      expect(result.current.selectedCount).toBe(0);
      expect(result.current.isAllChecked()).toBe(false);
    });

    it('단순 배열도 처리할 수 있어야 한다', () => {
      const simpleItems = [{ name: 'Item 1' }, { name: 'Item 2' }] as TestItem[];

      const { result } = renderHook(() => useCheckList(simpleItems));

      expect(result.current.list).toHaveLength(2);
      expect(result.current.list[0].id).toBeDefined();
      expect(result.current.list[0].checked).toBe(false);
    });
  });
});
