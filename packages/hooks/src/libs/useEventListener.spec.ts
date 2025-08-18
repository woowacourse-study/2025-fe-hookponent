import { renderHook } from '@testing-library/react';
import { useEventListener } from './useEventListener';

describe('useEventListener', () => {
  it('window 이벤트를 등록하고 해제한다', () => {
    const mockListener = jest.fn();

    const { unmount } = renderHook(() => useEventListener(window, 'resize', mockListener));

    // 이벤트 발생
    window.dispatchEvent(new Event('resize'));
    expect(mockListener).toHaveBeenCalledTimes(1);

    // 언마운트 후 이벤트 발생
    unmount();
    window.dispatchEvent(new Event('resize'));
    expect(mockListener).toHaveBeenCalledTimes(1); // 더 이상 호출 안 됨
  });

  it('ref를 사용하여 HTMLElement 이벤트를 등록한다', () => {
    const mockListener = jest.fn();

    // 가짜 DOM 요소 생성
    const div = document.createElement('div');
    const ref = { current: div };

    renderHook(() => useEventListener(ref, 'click', mockListener));

    div.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(mockListener).toHaveBeenCalledTimes(1);
  });

  it('listener 변경 시 최신 콜백이 호출된다', () => {
    const mockListener1 = jest.fn();
    const mockListener2 = jest.fn();

    const { rerender } = renderHook(({ listener }) => useEventListener(window, 'resize', listener), {
      initialProps: { listener: mockListener1 },
    });

    // 첫 번째 리스너 호출
    window.dispatchEvent(new Event('resize'));
    expect(mockListener1).toHaveBeenCalledTimes(1);

    // 리스너 변경
    rerender({ listener: mockListener2 });
    window.dispatchEvent(new Event('resize'));

    expect(mockListener1).toHaveBeenCalledTimes(1); // 더 이상 호출 안 됨
    expect(mockListener2).toHaveBeenCalledTimes(1); // 새로운 리스너 호출됨
  });
});
