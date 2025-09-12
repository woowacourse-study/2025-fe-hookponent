// useLockBodyScroll.test.tsx
import { renderHook } from '@testing-library/react';
import { useLockBodyScroll } from './useLockBodyScroll';

describe('useLockBodyScroll 훅', () => {
  it('useLockBodyScroll 훅을 사용하는 컴포넌트가 마운트 시 body overflow는 hidden으로 변경된다.', () => {
    document.body.style.overflow = 'auto';

    const { unmount } = renderHook(() => useLockBodyScroll());

    expect(document.body.style.overflow).toBe('hidden');

    unmount();
  });

  it('useLockBodyScroll 훅을 사용하는 컴포넌트가 언마운트 시 body overflow는 기존으로 돌아온다.', () => {
    document.body.style.overflow = 'auto';

    const { unmount } = renderHook(() => useLockBodyScroll());

    expect(document.body.style.overflow).toBe('hidden');
    unmount();

    expect(document.body.style.overflow).toBe('auto');
  });

  test('다중 마운트 테스트: 마지막 언마운트 전까지는 body overflow는 유지된다.', async () => {
    document.body.style.overflow = 'auto';

    const testA = renderHook(() => useLockBodyScroll());
    expect(document.body.style.overflow).toBe('hidden');

    const testB = renderHook(() => useLockBodyScroll());
    expect(document.body.style.overflow).toBe('hidden');

    // testA 컴포넌트 언마운트
    testA.unmount();
    expect(document.body.style.overflow).toBe('hidden');

    // testB 컴포넌트 언마운트
    testB.unmount();
    expect(document.body.style.overflow).toBe('auto');
  });
});
