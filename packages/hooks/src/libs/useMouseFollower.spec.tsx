import { renderHook, render } from '@testing-library/react';
import { useRef } from 'react';
import { useMouseFollower } from './useMouseFollower';

describe('useMouseFollower 훅', () => {
  it('글로벌 커서: 마우스 이동 시 transform이 업데이트 되어야 한다.', () => {
    const { result } = renderHook(() => useMouseFollower<HTMLDivElement>());
    const { current: cursorRef } = result;

    render(<div ref={cursorRef}>마우스 테스트</div>);

    const cursorEl = cursorRef;
    expect(cursorEl.current).not.toBeNull();

    const evt = new MouseEvent('pointermove', { clientX: 100, clientY: 200, bubbles: true });
    window.dispatchEvent(evt);
    expect(cursorEl.current!.style.transform).toBe('translate3d(100px, 200px, 0)');
  });

  it('존 커서: 영역 안에서는 opacity=1, 밖에서는 0', () => {
    const Zone = () => {
      const zoneRef = useRef<HTMLDivElement>(null);
      const cursorRef = useMouseFollower<HTMLDivElement, HTMLDivElement>({ targetRef: zoneRef });
      return (
        <>
          <div ref={zoneRef} data-testid="zone" style={{ width: 200, height: 200 }} />
          <div ref={cursorRef} data-testid="cursor" />
        </>
      );
    };

    const { getByTestId } = render(<Zone />);
    const zone = getByTestId('zone') as HTMLDivElement;
    const cursor = getByTestId('cursor') as HTMLDivElement;

    // zone의 위치/크기 mock
    jest.spyOn(zone, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 200,
      bottom: 200,
      width: 200,
      height: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const zoneInnerEvent = new MouseEvent('pointermove', { clientX: 100, clientY: 100, bubbles: true });
    window.dispatchEvent(zoneInnerEvent);
    expect(cursor.style.opacity).toBe('1');

    const zoneOuterEvent = new MouseEvent('pointermove', { clientX: 300, clientY: 300, bubbles: true });
    window.dispatchEvent(zoneOuterEvent);
    expect(cursor.style.opacity).toBe('0');
  });

  it('존 커서는 안/밖에 따라 opacity가 토글된다', () => {
    const { getByTestId } = render(<App />);
    const zone = getByTestId('zone') as HTMLDivElement;
    const zoneCursor = getByTestId('cursor-zone') as HTMLDivElement;

    // zone의 위치/크기 mock
    jest.spyOn(zone, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 200,
      bottom: 200,
      width: 200,
      height: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // zone 내부 → opacity=1
    const zoneInnerEvent = new MouseEvent('pointermove', { clientX: 100, clientY: 100, bubbles: true });
    window.dispatchEvent(zoneInnerEvent);
    expect(zoneCursor.style.opacity).toBe('1');

    // zone 외부 → opacity=0
    const zoneOuterEvent = new MouseEvent('pointermove', { clientX: 300, clientY: 300, bubbles: true });
    window.dispatchEvent(zoneOuterEvent);
    expect(zoneCursor.style.opacity).toBe('0');
  });

  it('글로벌 커서는 존 안에서 숨겨지고, 존 밖에서 보인다', () => {
    const { getByTestId } = render(<App />);
    const zone = getByTestId('zone') as HTMLDivElement;
    const globalCursor = getByTestId('cursor-global') as HTMLDivElement;

    // zone mock
    jest.spyOn(zone, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 200,
      bottom: 200,
      width: 200,
      height: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // 존 내부 → 글로벌 커서 숨김
    const zoneInnerEvent = new MouseEvent('pointermove', { clientX: 100, clientY: 100, bubbles: true });
    window.dispatchEvent(zoneInnerEvent);
    expect(globalCursor.style.opacity).toBe('0');

    // 존 외부 → 글로벌 커서 다시 보임
    const zoneOuterEvent = new MouseEvent('pointermove', { clientX: 300, clientY: 300, bubbles: true });
    window.dispatchEvent(zoneOuterEvent);
    expect(globalCursor.style.opacity).toBe('1');
  });
});

// 최소 CustomCursor 컴포넌트
function CustomCursor({ text, targetRef }: { text: string; targetRef?: React.RefObject<HTMLElement | null> }) {
  const cursorRef = useMouseFollower<HTMLDivElement>({ targetRef });
  return (
    <div ref={cursorRef} data-testid={`cursor-${text}`} style={{ position: 'fixed', pointerEvents: 'none' }}>
      {text}
    </div>
  );
}

// 간단 App: 존 하나 + 글로벌 하나
function App() {
  const zoneRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div ref={zoneRef} data-testid="zone" style={{ width: 200, height: 200, background: 'red' }} />
      <CustomCursor text="zone" targetRef={zoneRef} />
      <CustomCursor text="global" />
    </div>
  );
}
