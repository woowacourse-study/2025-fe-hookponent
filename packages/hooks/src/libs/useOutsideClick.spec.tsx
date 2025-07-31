import { useEffect, useRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useOutsideClick } from './useOutsideClick';

describe('useOutsideClick', () => {
  let addEventListenerSpy: jest.SpyInstance;
  let removeEventListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should register and unregister the mousedown event listener', () => {
    const handleOutsideClick = jest.fn();

    function TestComponent() {
      const ref = useRef<HTMLDivElement | null>(null);
      const register = useOutsideClick(handleOutsideClick);

      useEffect(() => {
        if (ref.current) {
          const unregister = register(ref.current);
          return () => unregister?.();
        }
      }, [register]);

      return <div ref={ref}>Test Element</div>;
    }

    const { unmount } = render(<TestComponent />);

    expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
  });

  it('should call callback when clicking outside of the registered element', () => {
    const handleOutsideClick = jest.fn();

    function TestComponent() {
      const ref = useRef<HTMLDivElement | null>(null);
      const register = useOutsideClick(handleOutsideClick);

      useEffect(() => {
        if (ref.current) {
          const unregister = register(ref.current);
          return () => unregister?.();
        }
      }, [register]);

      return (
        <div>
          <div ref={ref} data-testid="inside">
            Inside
          </div>
          <div data-testid="outside">Outside</div>
        </div>
      );
    }

    const { getByTestId } = render(<TestComponent />);

    fireEvent.mouseDown(getByTestId('inside'));
    expect(handleOutsideClick).not.toHaveBeenCalled();

    fireEvent.mouseDown(getByTestId('outside'));
    expect(handleOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('should not call callback if element is not registered', () => {
    const handleOutsideClick = jest.fn();

    function TestComponent() {
      useOutsideClick(handleOutsideClick);
      return <div data-testid="outside">Outside</div>;
    }

    const { getByTestId } = render(<TestComponent />);
    fireEvent.mouseDown(getByTestId('outside'));

    expect(handleOutsideClick).not.toHaveBeenCalled();
  });

  it('should handle null element in register function', () => {
    const callback = jest.fn();

    function TestComponent() {
      const register = useOutsideClick(callback);

      useEffect(() => {
        const result = register(null);
        expect(result).toBeUndefined();
      }, [register]);

      return <div>Test</div>;
    }

    render(<TestComponent />);
  });
});
