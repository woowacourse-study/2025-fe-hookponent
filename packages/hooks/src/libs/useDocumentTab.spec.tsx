import { render } from '@testing-library/react';
import { useDocumentTab } from './useDocumentTab';

describe('useDocumentTab', () => {
  const TestComponent = ({ title, favicon }: { title?: string; favicon?: string }) => {
    useDocumentTab({ title, favicon });
    return <div>Test</div>;
  };

  beforeEach(() => {
    // 기본 문서 상태 초기화
    document.title = 'Default Title';

    // 기존 favicon 태그 세팅
    let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = 'default.ico';
  });

  it('title 옵션을 주면 document.title이 바뀌어야 한다', () => {
    render(<TestComponent title="New Title" />);
    expect(document.title).toBe('New Title');
  });

  it('favicon 옵션을 주면 link[rel="icon"]이 바뀌어야 한다', () => {
    render(<TestComponent favicon="https://example.com/new.ico" />);
    const link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    expect(link?.href).toBe('https://example.com/new.ico');
  });

  it('cleanup 시 document.title이 원래대로 복구되어야 한다', () => {
    const { unmount } = render(<TestComponent title="Temporary Title" />);
    expect(document.title).toBe('Temporary Title');
    unmount();
    expect(document.title).toBe('Default Title');
  });

  it('cleanup 시 favicon이 원래대로 복구되어야 한다', () => {
    const { unmount } = render(<TestComponent favicon="https://example.com/temp.ico" />);
    const link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    expect(link?.href).toBe('https://example.com/temp.ico');

    unmount();
    expect(link?.href).toBe('http://localhost/default.ico');
  });
});
