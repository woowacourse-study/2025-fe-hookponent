import { useCallback, useMemo, useState } from 'react';

interface usePaginationParams {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

interface usePaginationReturns {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

/**
 * usePagination 훅
 *
 * 페이지네이션 상태를 관리하고, 페이지 이동 관련 함수를 제공합니다.
 * 라이브러리에서 버튼 렌더링, 목록 슬라이싱 등과 함께 사용하기 적합합니다.
 *
 * @param {UsePaginationParams} params - 페이지네이션 설정
 * @param {number} params.totalItems - 전체 아이템 수
 * @param {number} params.itemsPerPage - 한 페이지당 아이템 수
 * @param {number} [params.initialPage=1] - 초기 페이지 번호
 *
 * @returns {{
 *   currentPage: number,       // 현재 페이지 번호
 *   totalPages: number,        // 총 페이지 수
 *   goToPage: (page: number) => void,        // 특정 페이지로 이동
 *   goToPrevPage: () => void,                // 이전 페이지로 이동 (1보다 작으면 이동하지 않음)
 *   goToNextPage: () => void,                // 다음 페이지로 이동 (총 페이지보다 크면 이동하지 않음)
 *   goToFirstPage: () => void,               // 첫 페이지로 이동
 *   goToLastPage: () => void                 // 마지막 페이지로 이동
 * }}
 */

export function usePagination({
  totalItems,
  itemsPerPage,
  initialPage = 1,
}: usePaginationParams): usePaginationReturns {
  const [currentPage, setCurrentPage] = useState(initialPage ? initialPage : 1);

  const totalPages = useMemo(() => {
    if (itemsPerPage <= 0) return 1;
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(totalPages, page)));
    },
    [totalPages]
  );

  const goToPrevPage = useCallback(() => setCurrentPage((prev) => Math.max(1, prev - 1)), []);
  const goToNextPage = useCallback(() => setCurrentPage((prev) => Math.min(totalPages, prev + 1)), [totalPages]);
  const goToFirstPage = useCallback(() => setCurrentPage(1), []);
  const goToLastPage = useCallback(() => setCurrentPage(totalPages), [totalPages]);

  return { currentPage, totalPages, goToPage, goToPrevPage, goToNextPage, goToFirstPage, goToLastPage };
}
