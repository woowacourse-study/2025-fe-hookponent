import { useEffect, useState } from 'react';

interface Meta {
  path: string;
  title?: string;
  favicon?: string;
}

type DocumentTabProps = Meta[];

/**
 * `<DocumentTab />` 컴포넌트는 현재 URL 경로(pathname)를 감지하여
 * 해당 경로에 맞는 **문서 제목(title)** 과 **파비콘(favicon)** 을 동적으로 설정합니다.
 *
 * - `meta` 배열에 정의된 path 패턴과 현재 `window.location.pathname`을 비교합니다.
 * - 일치하는 항목이 있을 경우 `title`, `favicon`을 적용합니다.
 * - 컴포넌트가 언마운트되면 원래 상태(제목, 파비콘)로 되돌립니다.
 *
 * @component
 * @param {Object} props
 * @param {Meta[]} props.meta - 경로별로 적용할 메타 정보 배열
 *
 */

export function DocumentTab({ meta }: { meta: DocumentTabProps }) {
  const pathname = usePathname();

  useEffect(() => {
    const current = meta.find((m) => matchRoute(m.path, pathname));
    if (!current) return;

    const { title, favicon } = current;

    // Title
    const prevTitle = document.title;
    if (title) document.title = title;

    // Favicon
    let prevFavicon: string | null = null;
    if (favicon) {
      let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      prevFavicon = link.href;
      link.href = favicon;
    }

    return () => {
      if (title) document.title = prevTitle;
      if (favicon && prevFavicon) {
        const link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
        if (link) link.href = prevFavicon;
      }
    };
  }, [pathname, meta]);

  return null;
}

// 지정 path랑 현재 pathname 맞추기
const matchRoute = (pathPattern: string, pathname: string): boolean => {
  const patternParts = pathPattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) return false;

  return patternParts.every((part, i) => {
    if (part.startsWith(':')) return true;
    return part === pathParts[i];
  });
};

const usePathname = () => {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const update = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', update);

    // 기존의 pushState, replaceState 함수 저장
    const pushState = history.pushState.bind(history);
    const replaceState = history.replaceState.bind(history);

    history.pushState = function (...args) {
      pushState(...args);
      update();
    };

    history.replaceState = function (...args) {
      replaceState(...args);
      update();
    };

    return () => {
      window.removeEventListener('popstate', update);
      history.pushState = pushState;
      history.replaceState = replaceState;
    };
  }, []);

  return pathname;
};
