import { render } from '@testing-library/react';
import { DocumentTab } from './DocumentTab';

describe('DocumentTab', () => {
  const meta = [
    { path: '/', title: '홈', favicon: 'home.ico' },
    { path: '/about', title: '소개', favicon: 'about.ico' },
  ];

  beforeEach(() => {
    // 기본 문서 상태 초기화
    document.title = 'Default Title';

    // 기본 favicon 세팅
    let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = 'default.ico';

    // URL 초기화
    window.history.replaceState({}, '', '/');
  });

  it('현재 경로("/")에 맞는 title을 설정해야 한다', () => {
    render(<DocumentTab meta={meta} />);
    expect(document.title).toBe('홈');
  });

  it('현재 경로("/")에 맞는 favicon을 설정해야 한다', () => {
    render(<DocumentTab meta={meta} />);
    const link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
    expect(link?.getAttribute('href')).toBe('home.ico');
  });

  it('경로를 "/about"으로 바꾸면 meta에 맞게 title이 바뀌어야 한다', () => {
    window.history.pushState({}, '', '/about');
    render(<DocumentTab meta={meta} />);
    expect(document.title).toBe('소개');
  });

  it('컴포넌트 언마운트 시 title과 favicon이 원래대로 복구되어야 한다', () => {
    const { unmount } = render(<DocumentTab meta={meta} />);
    expect(document.title).toBe('홈');
    const link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
    expect(link?.getAttribute('href')).toBe('home.ico');

    unmount();
    expect(document.title).toBe('Default Title');
    expect(link?.getAttribute('href')).toBe('http://localhost/default.ico');
  });
});
