import { renderHook } from '@testing-library/react';
import { useEventDelegation } from './useEventDelegation';

describe('useEventDelegation', () => {
  it('기본 data-id를 가진 자식 요소 클릭 시 콜백을 호출한다', () => {
    const items = [
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
    ];
    const mockCallback = jest.fn();

    const { result } = renderHook(() => useEventDelegation(items, mockCallback));

    const handler = result.current;

    document.body.addEventListener('click', handler as unknown as EventListener);
    const btn = document.createElement('button');
    btn.setAttribute('data-id', '2');
    document.body.appendChild(btn);
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback.mock.calls[0][1]).toEqual(items[1]);
    expect(mockCallback.mock.calls[0][2]).toBe(btn);

    btn.remove();
    document.body.removeEventListener('click', handler as unknown as EventListener);
  });

  it('커스텀 idAttribute를 지원한다', () => {
    const items = [{ id: 'a', value: 10 }];
    const mockCallback = jest.fn();

    const { result } = renderHook(() => useEventDelegation(items, mockCallback, { idAttribute: 'data-key' }));

    const handler = result.current;
    document.body.addEventListener('click', handler as unknown as EventListener);

    const btn = document.createElement('button');
    btn.setAttribute('data-key', 'a');
    document.body.appendChild(btn);

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback.mock.calls[0][1]).toEqual(items[0]);

    btn.remove();
    document.body.removeEventListener('click', handler as unknown as EventListener);
  });

  it('stopPropagation 및 preventDefault 옵션을 준수한다', () => {
    const items = [{ id: 1 }];
    const mockCallback = jest.fn();

    const { result } = renderHook(() =>
      useEventDelegation(items, mockCallback, { stopPropagation: true, preventDefault: true })
    );

    const handler = result.current;
    document.body.addEventListener('click', handler as unknown as EventListener);

    const btn = document.createElement('button');
    btn.setAttribute('data-id', '1');
    document.body.appendChild(btn);

    const stopSpy = jest.spyOn(Event.prototype, 'stopPropagation');
    const preventSpy = jest.spyOn(Event.prototype, 'preventDefault');

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(stopSpy).toHaveBeenCalled();
    expect(preventSpy).toHaveBeenCalled();

    stopSpy.mockRestore();
    preventSpy.mockRestore();

    btn.remove();
    document.body.removeEventListener('click', handler as unknown as EventListener);
  });
});
