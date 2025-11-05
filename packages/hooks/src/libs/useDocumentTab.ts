import { useEffect } from 'react';

type UseDocumentTabOptions = {
  title?: string;
  favicon?: string;
};

/**
 * `useDocumentTab` 훅은 브라우저 탭의 **문서 제목(title)** 과 **파비콘(favicon)** 을
 * 동적으로 설정하고, 컴포넌트가 언마운트될 때 원래 상태로 되돌려주는 기능을 제공합니다.
 *
 *
 * @param {Object} options - 탭 설정 옵션
 * @param {string} [options.title] - 브라우저 탭에 표시할 제목
 * @param {string} [options.favicon] - 브라우저 탭에 표시할 파비콘 이미지 URL
 *
 */
export function useDocumentTab({ title, favicon }: UseDocumentTabOptions) {
  // Title
  useEffect(() => {
    if (!title) return;
    const prev = document.title;
    document.title = title;
    return () => {
      document.title = prev;
    };
  }, [title]);

  // Favicon
  useEffect(() => {
    if (!favicon) return;
    let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    const prev = link.href;
    link.href = favicon;
    return () => {
      link.href = prev;
    };
  }, [favicon]);
}
