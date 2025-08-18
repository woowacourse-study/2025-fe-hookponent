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

  // 추후 useEventListener 적용 예정
  useEffect(() => {
    const node = hoverRef.current;
    if (!node) return;

    const handleMouseEnter = (event: MouseEvent) => {
      setIsHovered(true);
      onEnter?.(event);
    };
    const handleMouseLeave = (event: MouseEvent) => {
      setIsHovered(false);
      onLeave?.(event);
    };

    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };

    // 이벤트 중복 등록 방지를 위하여 빈 배열로 처음에만 등록
  }, [onEnter, onLeave]);

  return { isHovered, hoverRef };
}
