import { act, renderHook } from '@testing-library/react';
import { useFileDrop } from './useFileDrop'; // 경로 맞게 수정

function mkEvent() {
  return {
    preventDefault: jest.fn(),
  } as unknown as React.DragEvent<HTMLDivElement>;
}

function mkFile(name: string, type = 'text/plain', content = 'hello') {
  const blob = new Blob([content], { type });
  return new File([blob], name, { type, lastModified: Date.now() });
}

// React.DragEvent 모킹: Array.from이 먹도록 files를 배열로 둔다
function mkDropEvent(files: File[]) {
  return {
    preventDefault: jest.fn(),
    dataTransfer: { files },
  } as unknown as React.DragEvent<HTMLDivElement>;
}

describe('useFileDrop - 초기 상태', () => {
  test('초기값들이 올바르게 설정된다', () => {
    const { result } = renderHook(() => useFileDrop());

    expect(result.current.ref.current).toBeNull();
    expect(result.current.isOver).toBe(false);
    expect(result.current.files).toEqual([]);
    expect(result.current.error ?? null).toBeNull();

    const props = result.current.getDropZoneProps();
    expect(typeof props.onDragOver).toBe('function');
    expect(typeof props.onDrop).toBe('function');
    expect(typeof props.onDragEnter).toBe('function');
    expect(typeof props.onDragLeave).toBe('function');
  });
});

describe('useFileDrop - 드래그 상태', () => {
  test('onDragEnter 호출 시 isOver=true 가 된다', () => {
    const { result } = renderHook(() => useFileDrop());
    const { onDragEnter } = result.current.getDropZoneProps();

    const evt = mkEvent();
    act(() => {
      onDragEnter(evt);
    });

    expect(result.current.isOver).toBe(true);
    expect(evt.preventDefault).toHaveBeenCalledTimes(1);
  });

  test('onDragLeave 호출 시 isOver=false 로 돌아간다', () => {
    const { result } = renderHook(() => useFileDrop());
    const { onDragEnter, onDragLeave } = result.current.getDropZoneProps();

    const enterEvt = mkEvent();
    const leaveEvt = mkEvent();

    act(() => {
      onDragEnter(enterEvt);
    });
    expect(result.current.isOver).toBe(true);

    act(() => {
      onDragLeave(leaveEvt);
    });
    expect(result.current.isOver).toBe(false);
    expect(leaveEvt.preventDefault).toHaveBeenCalledTimes(1);
  });

  test('onDragOver 는 기본 동작을 취소한다', () => {
    const { result } = renderHook(() => useFileDrop());
    const { onDragOver } = result.current.getDropZoneProps();

    const evt = mkEvent();
    act(() => {
      onDragOver(evt);
    });

    expect(evt.preventDefault).toHaveBeenCalledTimes(1);
    expect(result.current.isOver).toBe(false);
  });
});

describe('useFileDrop - 파일 드롭', () => {
  test('onDrop 시 files 상태에 추가되고, onDrop 콜백이 호출된다', () => {
    const f1 = mkFile('a.txt');
    const f2 = mkFile('b.txt');

    const onDropSpy = jest.fn();
    const { result } = renderHook(() =>
      useFileDrop({
        onDrop: onDropSpy,
      })
    );

    const { onDrop } = result.current.getDropZoneProps();

    const evt = mkDropEvent([f1, f2]);

    act(() => {
      onDrop(evt);
    });

    // 상태에 누적되었는지
    expect(result.current.files).toHaveLength(2);
    expect(result.current.files.map((f) => f.name)).toEqual(['a.txt', 'b.txt']);

    // preventDefault 호출
    expect(evt.preventDefault).toHaveBeenCalledTimes(1);

    // onDrop 콜백이 유효 파일 배열로 호출되었는지
    expect(onDropSpy).toHaveBeenCalledTimes(1);
    const [cbEvt, cbFiles] = onDropSpy.mock.calls[0];
    expect(cbEvt).toBe(evt);
    expect(cbFiles.map((f: File) => f.name)).toEqual(['a.txt', 'b.txt']);

    // 드롭 이후 드래그 상태 초기화
    expect(result.current.isOver).toBe(false);
  });

  test('여러 번 드롭하면 files가 누적된다', () => {
    const f1 = mkFile('first.txt');
    const f2 = mkFile('second.txt');
    const f3 = mkFile('third.txt');

    const { result } = renderHook(() => useFileDrop());
    const { onDrop } = result.current.getDropZoneProps();

    act(() => {
      onDrop(mkDropEvent([f1]));
    });
    expect(result.current.files.map((f) => f.name)).toEqual(['first.txt']);

    act(() => {
      onDrop(mkDropEvent([f2, f3]));
    });
    expect(result.current.files.map((f) => f.name)).toEqual(['first.txt', 'second.txt', 'third.txt']);
  });

  test('disabled=true이면 drop이 무시된다', () => {
    const f = mkFile('ignored.txt');

    const { result } = renderHook(() => useFileDrop({ disabled: true }));
    const { onDrop } = result.current.getDropZoneProps();

    act(() => {
      onDrop(mkDropEvent([f]));
    });

    expect(result.current.files).toHaveLength(0);
  });
});

describe('useFileDrop - 확장자 필터링, 에러', () => {
  test('extensions가 설정되면 허용 확장자만 files에 추가하고, 나머지는 에러를 남긴다', () => {
    const f1 = mkFile('a.png', 'image/png');
    const f2 = mkFile('b.jpg', 'image/jpeg');
    const f3 = mkFile('c.txt', 'third.txt'); // 거절 대상

    const { result } = renderHook(() => useFileDrop({ extensions: ['png', 'jpg'] }));
    const { onDrop } = result.current.getDropZoneProps();

    act(() => {
      onDrop(mkDropEvent([f1, f2, f3]));
    });

    // 허용 파일만 쌓임
    expect(result.current.files.map((f) => f.name)).toEqual(['a.png', 'b.jpg']);

    // 에러 메시지 설정
    expect(result.current.error).not.toBeNull();
    expect(result.current.error!.message).toContain('허용되지 않은 파일 형식');
    expect(result.current.error!.message).toContain('허용 확장자: png, jpg');
  });

  test('이후 유효한 파일만 드롭하면 에러가 해제된다', () => {
    const bad = mkFile('bad.exe');
    const good = mkFile('ok.jpg', 'image/jpeg');

    const { result } = renderHook(() => useFileDrop({ extensions: ['png', 'jpg'] }));
    const { onDrop } = result.current.getDropZoneProps();

    // 잘못된 파일로 에러 발생
    act(() => {
      onDrop(mkDropEvent([bad]));
    });
    expect(result.current.error).not.toBeNull();

    // 올바른 파일만 드롭 -> 에러 클리어
    act(() => {
      onDrop(mkDropEvent([good]));
    });
    expect(result.current.error).toBeNull();
    expect(result.current.files.map((f) => f.name)).toContain('ok.jpg');
  });

  test('extensions가 없으면 어떤 확장자도 거절하지 않는다(에러 없음)', () => {
    const exe = mkFile('tool.exe');
    const txt = mkFile('readme.txt', 'text/plain');

    const { result } = renderHook(() => useFileDrop());
    const { onDrop } = result.current.getDropZoneProps();

    act(() => {
      onDrop(mkDropEvent([exe, txt]));
    });

    expect(result.current.files.map((f) => f.name)).toEqual(['tool.exe', 'readme.txt']);
    expect(result.current.error).toBeNull();
  });
});
