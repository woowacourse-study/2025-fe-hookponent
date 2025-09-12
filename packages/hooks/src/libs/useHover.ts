import { useEffect, useRef, useState } from 'react';
/** 
@param {HoverHandlerOptions} options hover 이벤트 시 실행할 콜백 옵션
* @returns {{ isHovered: boolean; hoverRef: React.RefObject<T> }}
*/

interface hoverHandlerOptions {
  onEnter?: (event: MouseEvent) => void;
  onLeave?: (event: MouseEvent) => void;
}

export function useHover<T extends HTMLElement>({ onEnter, onLeave }: hoverHandlerOptions = {}) {
  const [isHovered, setIsHovered] = useState(false);
  const hoverRef = useRef<T | null>(null);

  const onEnterRef = useRef(onEnter);
  const onLeaveRef = useRef(onLeave);

  useEffect(() => {
    onEnterRef.current = onEnter;
    onLeaveRef.current = onLeave;
  }, [onEnter, onLeave]);

  // 추후 useEventListener 적용 예정
  useEffect(() => {
    const node = hoverRef.current;
    if (!node) return;

    const handleMouseEnter = (event: MouseEvent) => {
      setIsHovered(true);
      onEnterRef.current?.(event);
    };
    const handleMouseLeave = (event: MouseEvent) => {
      setIsHovered(false);
      onLeaveRef.current?.(event);
    };

    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { isHovered, hoverRef };
}
