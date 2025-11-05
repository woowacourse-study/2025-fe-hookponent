import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination 훅 테스트', () => {
  const totalItems = 50;
  const itemsPerPage = 10;

  test('초기 페이지와 총 페이지 계산', () => {
    const { result } = renderHook(() => usePagination({ totalItems, itemsPerPage, initialPage: 1 }));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(5);
  });

  test('goToPage 함수 동작', () => {
    const { result } = renderHook(() => usePagination({ totalItems, itemsPerPage }));

    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.currentPage).toBe(3);

    // 범위 밖 값 처리
    act(() => {
      result.current.goToPage(10);
    });
    expect(result.current.currentPage).toBe(5);
  });

  test('goToPrevPage / goToNextPage 동작', () => {
    const { result } = renderHook(() => usePagination({ totalItems, itemsPerPage, initialPage: 3 }));

    act(() => result.current.goToPrevPage());
    expect(result.current.currentPage).toBe(2);

    act(() => result.current.goToNextPage());
    expect(result.current.currentPage).toBe(3);

    // 경계값 테스트
    act(() => result.current.goToPrevPage());
    act(() => result.current.goToPrevPage());
    act(() => result.current.goToPrevPage());
    expect(result.current.currentPage).toBe(1);

    act(() => result.current.goToNextPage());
    act(() => result.current.goToNextPage());
    act(() => result.current.goToNextPage());
    act(() => result.current.goToNextPage());
    act(() => result.current.goToNextPage());
    expect(result.current.currentPage).toBe(5);
  });

  test('goToFirstPage / goToLastPage 동작', () => {
    const { result } = renderHook(() => usePagination({ totalItems, itemsPerPage, initialPage: 3 }));

    act(() => result.current.goToFirstPage());
    expect(result.current.currentPage).toBe(1);

    act(() => result.current.goToLastPage());
    expect(result.current.currentPage).toBe(5);
  });
});
