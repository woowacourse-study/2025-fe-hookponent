import { RefObject, useCallback, useMemo, useRef, useState } from 'react';

/**
 * useFileDrop 훅의 옵션입니다.
 *
 * @property {(e: React.DragEvent<HTMLDivElement>, currentFiles: File[]) => void} [onDrop]
 *  - 파일이 드롭되어 최종 반영될 때 호출됩니다. (확장자/최대 개수 필터를 통과한 파일 배열 전달)
 * @property {() => void} [onEnter]
 *  - 드래그가 드롭존 영역에 처음 진입했을 때 호출됩니다. (파일 정보는 보안 정책상 이 시점에 없을 수 있음)
 * @property {() => void} [onLeave]
 *  - 드래그가 드롭존 영역을 완전히 벗어났을 때 호출됩니다.
 * @property {boolean} [disabled]
 *  - true면 모든 드래그/드롭 이벤트가 무시됩니다.
 * @property {string[]} [extensions]
 *  - 허용할 파일 확장자 목록입니다. 예: ['png', 'jpg'] (대소문자/앞의 점(.) 여부 무시)
 * @property {number} [maxFiles]
 *  - 누적 가능 최대 파일 개수입니다. 초과분은 잘라내고 에러가 설정됩니다.
 */
type UseFileDropOptions = {
  onDrop?: (e: React.DragEvent<HTMLDivElement>, currentFiles: File[]) => void;
  onEnter?: () => void;
  onLeave?: () => void;
  disabled?: boolean;
  extensions?: string[];
  maxFiles?: number;
};

/**
 * useFileDrop 훅의 반환값입니다.
 *
 * @property {RefObject<HTMLDivElement>} ref
 *  - 드롭존으로 사용할 DOM 요소에 연결할 ref입니다.
 * @property {boolean} isOver
 *  - 현재 포인터가 드롭존 위에 드래그 중인지 여부입니다.
 * @property {File[]} files
 *  - 드롭으로 누적된 파일 목록입니다.
 * @property {() => { onDragOver: Function; onDrop: Function; onDragEnter: Function; onDragLeave: Function }} getDropZoneProps
 *  - 드롭존에 바인딩할 드래그 이벤트 핸들러 묶음을 반환합니다.
 * @property {Error | null | undefined} error
 *  - 확장자 미스매치/최대 개수 초과 등 제약 위반 시 설정되는 에러입니다.
 */
type UseFileDropReturn = {
  ref: RefObject<HTMLDivElement>;
  isOver: boolean;
  files: File[];
  getDropZoneProps: () => {
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  };
  error?: Error | null;
};

/**
 * 지정한 영역에 파일을 드래그 앤 드롭해 `File[]`을 관리할 수 있게 해주는 훅입니다.
 *
 * - **파일 전용**: 텍스트/URL 등은 처리하지 않습니다.
 * - `dragenter/dragover` 시점에는 보안 정책상 파일 정보에 접근할 수 없어도 정상입니다. (이때는 하이라이트만)
 * - `drop` 시점에만 실제 파일 목록을 얻고, 확장자/최대 개수 제한을 적용합니다.
 *
 * @example
 * const { ref, isOver, files, error, getDropZoneProps } = useFileDrop({
 *   extensions: ['png', 'jpg'],
 *   maxFiles: 5,
 *   onDrop: (_e, fs) => console.log(fs),
 * });
 *
 * return (
 *   <div ref={ref} {...getDropZoneProps()}>
 *     {isOver ? '놓으세요!' : '드래그 앤 드롭'}
 *   </div>
 * );
 *
 * @param {UseFileDropOptions} [options] 훅 동작을 제어하는 옵션
 * @returns {UseFileDropReturn} 드롭존 ref/상태/핸들러 등
 */
export const useFileDrop = (options?: UseFileDropOptions): UseFileDropReturn => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const onDropRef = useRef(options?.onDrop);
  const onEnterRef = useRef(options?.onEnter);
  const onLeaveRef = useRef(options?.onLeave);
  onDropRef.current = options?.onDrop;
  onEnterRef.current = options?.onEnter;
  onLeaveRef.current = options?.onLeave;

  /**
   * 허용 확장자 목록을 정규화합니다.
   * - 대소문자 무시
   * - 앞의 점(.) 유무 무시
   * - 예: '.PNG' → 'png'
   */
  const allowedExt = useMemo(() => {
    const list = options?.extensions ?? [];
    return list.map((s) => (s.startsWith('.') ? s.slice(1) : s).toLowerCase());
  }, [options?.extensions]);

  /**
   * 현재 드롭 이벤트에서 파일들을 추출합니다.
   * - 파일 전용: dataTransfer.files 만 사용
   */
  const extractFiles = (e: React.DragEvent<HTMLDivElement>): File[] => Array.from(e.dataTransfer?.files ?? []);

  /**
   * 허용 확장자 목록이 있을 경우에만 필터링합니다.
   */
  const filterByExt = (arr: File[]): File[] => {
    if (!allowedExt.length) return arr;
    return arr.filter((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
      return allowedExt.includes(ext);
    });
  };

  /**
   * 드롭 가능 영역임을 알리기 위해 기본 동작을 막습니다.
   * - 상태 변경은 하지 않습니다.
   */
  const onDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (options?.disabled) return;
      e.preventDefault();
    },
    [options?.disabled]
  );

  /**
   * 실제 파일이 드롭되었을 때 호출됩니다.
   * - 파일을 추출 → 확장자 필터 적용 → 최대 개수 제한 적용 → 상태 갱신
   * - 제약 위반이 있으면 `error`에 메시지를 설정합니다.
   * - `onDrop` 콜백을 유효 파일 배열과 함께 호출합니다.
   */
  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (options?.disabled) return;
      e.preventDefault();

      const all = extractFiles(e);
      const valid = filterByExt(all);
      const invalid = all.filter((f) => !valid.includes(f));

      if (valid.length) {
        setFiles((prev) => {
          const next = [...prev, ...valid];
          if (options?.maxFiles && next.length > options.maxFiles) {
            setError(new Error(`최대 ${options.maxFiles}개 파일까지만 업로드할 수 있습니다.`));
            return next.slice(0, options.maxFiles);
          }
          return next;
        });
      }
      if (invalid.length) {
        const allowed = allowedExt.join(', ');
        setError(new Error(`허용되지 않은 파일 형식입니다. (허용 확장자: ${allowed})`));
      } else {
        setError(null);
      }

      onDropRef.current?.(e, valid);
      setIsOver(false);
    },
    [options?.disabled, options?.maxFiles, allowedExt]
  );

  /**
   * 드래그가 드롭존에 진입했을 때 호출됩니다.
   * - 보안 정책상 이 시점에는 파일 정보가 없을 수 있습니다.
   * - 하이라이트 용도로 `isOver=true`만 설정합니다.
   */
  const onDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (options?.disabled) return;
      e.preventDefault();

      onEnterRef.current?.();
      setIsOver(true);
    },
    [options?.disabled]
  );

  /**
   * 드래그가 드롭존에서 완전히 벗어났을 때 호출됩니다.
   * - 하이라이트 해제: `isOver=false`
   */
  const onDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (options?.disabled) return;
      e.preventDefault();
      onLeaveRef.current?.();
      setIsOver(false);
    },
    [options?.disabled]
  );

  /**
   * 드롭존에 필요한 drag 이벤트 핸들러 묶음을 반환합니다.
   * - 반환된 객체를 드롭존 DOM에 그대로 스프레드하세요.
   *   예) <div ref={ref} {...getDropZoneProps()} />
   */
  const getDropZoneProps = useCallback(
    () => ({
      onDragOver,
      onDrop,
      onDragEnter,
      onDragLeave,
    }),
    [onDragOver, onDrop, onDragEnter, onDragLeave]
  );

  return { ref, isOver, files, getDropZoneProps, error };
};
