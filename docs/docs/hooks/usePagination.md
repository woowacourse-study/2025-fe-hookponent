# usePagination

`usePagination`은 페이지네이션 상태를 관리하고 페이지 이동 관련 함수를 제공하는 커스텀 React Hook입니다.  
총 아이템 수와 페이지당 아이템 수를 기반으로 페이지 상태를 자동으로 계산하며, 다양한 페이지 이동 기능을 제공합니다.

이 훅은 테이블, 리스트, 갤러리 등의 페이지네이션 UI와 함께 사용하기 적합하며, 페이지 버튼 렌더링이나 목록 슬라이싱과 조합하여 사용할 수 있습니다.

## 🔗 사용법

```tsx
const { currentPage, totalPages, goToPage, goToPrevPage, goToNextPage } = usePagination({
  totalItems: 100,
  itemsPerPage: 10,
  initialPage: 1,
});
```

### 매개변수

- **totalItems**: `number` - 전체 아이템 수
- **itemsPerPage**: `number` - 한 페이지당 표시할 아이템 수
- **initialPage**: `number` (선택적) - 초기 페이지 번호 (기본값: 1)

### 반환값

- **currentPage**: `number` - 현재 페이지 번호
- **totalPages**: `number` - 총 페이지 수
- **goToPage**: `(page: number) => void` - 특정 페이지로 이동하는 함수
- **goToPrevPage**: `() => void` - 이전 페이지로 이동 (1보다 작으면 이동하지 않음)
- **goToNextPage**: `() => void` - 다음 페이지로 이동 (총 페이지보다 크면 이동하지 않음)
- **goToFirstPage**: `() => void` - 첫 페이지로 이동
- **goToLastPage**: `() => void` - 마지막 페이지로 이동

## ✅ 예시

### 기본 페이지네이션 구현

```tsx
import { usePagination } from './usePagination';

function ProductList() {
  const products = Array.from({ length: 87 }, (_, i) => ({ id: i + 1, name: `상품 ${i + 1}` }));

  const { currentPage, totalPages, goToPage, goToPrevPage, goToNextPage } = usePagination({
    totalItems: products.length,
    itemsPerPage: 12,
    initialPage: 1,
  });

  // 현재 페이지의 상품들만 추출
  const currentProducts = products.slice((currentPage - 1) * 12, currentPage * 12);

  return (
    <div>
      <div className="product-grid">
        {currentProducts.map((product) => (
          <div key={product.id} className="product-card">
            {product.name}
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={goToPrevPage} disabled={currentPage === 1}>
          이전
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          다음
        </button>
      </div>
    </div>
  );
}
```

### 페이지 번호 버튼이 있는 페이지네이션

```tsx
import { usePagination } from './usePagination';

function DataTable() {
  const data = Array.from({ length: 156 }, (_, i) => ({
    id: i + 1,
    name: `데이터 ${i + 1}`,
    value: Math.random() * 100,
  }));

  const { currentPage, totalPages, goToPage, goToPrevPage, goToNextPage, goToFirstPage, goToLastPage } = usePagination({
    totalItems: data.length,
    itemsPerPage: 20,
  });

  const currentData = data.slice((currentPage - 1) * 20, currentPage * 20);

  // 페이지 번호 버튼 생성
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>값</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.value.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button onClick={goToFirstPage} disabled={currentPage === 1}>
          처음
        </button>
        <button onClick={goToPrevPage} disabled={currentPage === 1}>
          이전
        </button>

        {pageNumbers.map((pageNum) => (
          <button key={pageNum} onClick={() => goToPage(pageNum)} className={currentPage === pageNum ? 'active' : ''}>
            {pageNum}
          </button>
        ))}

        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          다음
        </button>
        <button onClick={goToLastPage} disabled={currentPage === totalPages}>
          마지막
        </button>
      </div>
    </div>
  );
}
```

### 검색 결과와 함께 사용하는 예시

```tsx
import { useState, useMemo } from 'react';
import { usePagination } from './usePagination';

function SearchableList() {
  const allItems = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `아이템 ${i + 1}`,
    category: ['전자제품', '의류', '도서', '스포츠'][i % 4],
  }));

  const [searchTerm, setSearchTerm] = useState('');

  // 검색 필터링
  const filteredItems = useMemo(() => {
    if (!searchTerm) return allItems;
    return allItems.filter((item) => item.title.includes(searchTerm) || item.category.includes(searchTerm));
  }, [searchTerm]);

  const { currentPage, totalPages, goToPage, goToPrevPage, goToNextPage } = usePagination({
    totalItems: filteredItems.length,
    itemsPerPage: 10,
  });

  // 검색어가 변경되면 첫 페이지로 이동
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    goToPage(1); // 검색 시 첫 페이지로 이동
  };

  // ⚠️ 슬라이싱 필요
  const currentItems = filteredItems.slice((currentPage - 1) * 15, currentPage * 15);

  return (
    <div>
      <input
        type="text"
        placeholder="검색어를 입력하세요..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />

      <p>총 {filteredItems.length}개의 결과</p>

      <div className="item-list">
        {currentItems.map((item) => (
          <div key={item.id} className="item-card">
            <h3>{item.title}</h3>
            <span className="category">{item.category}</span>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={goToPrevPage} disabled={currentPage === 1}>
            ◀ 이전
          </button>
          <span>
            페이지 {currentPage} / {totalPages}
          </span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            다음 ▶
          </button>
        </div>
      )}
    </div>
  );
}
```

## 🎯 사용 팁

1. **목록 슬라이싱과 함께 사용**

   ```tsx
   const currentItems = allItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
   ```

2. **검색 기능과 조합 시 주의사항**
   - 검색어 변경 시 `goToPage(1)`을 호출하여 첫 페이지로 이동
   - filteredItems의 길이를 totalItems로 사용

3. **동적 데이터와 함께 사용**
   - 데이터가 변경될 때마다 totalItems를 업데이트
   - 현재 페이지가 유효하지 않을 수 있으므로 적절한 페이지로 이동 필요
