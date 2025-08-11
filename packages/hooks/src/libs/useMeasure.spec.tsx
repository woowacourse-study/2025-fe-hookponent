// useMeasure.test.tsx
import { renderHook } from '@testing-library/react';
import { render } from '@testing-library/react';
import useMeasure from './useMeasure';

describe('useMeasure 훅', () => {
  it('ref를 사용하지 않을 경우 window 크기를 반환해야 한다.', () => {
    const { result } = renderHook(() => useMeasure());

    const { size } = result.current;

    expect(size.width).toBe(window.innerWidth);
    expect(size.height).toBe(window.innerHeight);
  });

  it('ref를 div에 연결했을 때 ref가 잘 잡히고, size도 잘 나와야한다.', () => {
    const { result } = renderHook(() => useMeasure<HTMLDivElement>());

    const { ref } = result.current;

    render(
      <div ref={ref} style={{ width: '500px' }}>
        크기 측정
      </div>
    );
    expect((ref.current as HTMLDivElement).textContent).toBe('크기 측정');
  });
});
