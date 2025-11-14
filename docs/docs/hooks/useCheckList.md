# useCheckList

체크리스트 상태를 관리하는 커스텀 React Hook입니다.

아이템 목록의 체크 상태를 효율적으로 관리하며, 개별 아이템 조작부터 전체 일괄 처리까지 다양한 기능을 제공합니다. To-do 리스트, 다중 선택 테이블, 설문조사 등에 활용할 수 있습니다.

## 🔗 사용법

```tsx
const checkList = useCheckList<ItemType>(initialItems);
```

### 매개변수

- `initialItems: T[]`
  - 초기 아이템 배열
  - 각 아이템은 `CheckableItem` 인터페이스를 확장해야 합니다
  - `id`와 `checked` 속성이 없는 단순 배열도 자동으로 변환됩니다

### 반환값

`UseCheckListReturns<T>` 객체

| 속성             | 타입                                        | 설명                                      |
| ---------------- | ------------------------------------------- | ----------------------------------------- |
| `list`           | `T[]`                                       | 현재 관리 중인 아이템 리스트              |
| `set`            | `(items: T[]) => void`                      | 리스트 전체를 새로운 배열로 교체          |
| `isChecked`      | `(id: IdType<T>) => boolean`                | 특정 아이템의 체크 여부 확인              |
| `isAllChecked`   | `() => boolean`                             | 모든 아이템이 체크되었는지 확인           |
| `checkItem`      | `(id: IdType<T>) => void`                   | 특정 아이템을 체크 상태로 설정            |
| `unCheckItem`    | `(id: IdType<T>) => void`                   | 특정 아이템을 체크 해제                   |
| `toggleItem`     | `(id: IdType<T>) => void`                   | 특정 아이템의 체크 상태 토글              |
| `updateItem`     | `(id: IdType<T>, checked: boolean) => void` | 특정 아이템의 체크 상태를 명시적으로 설정 |
| `toggleAll`      | `() => void`                                | 모든 아이템의 체크 상태 반전              |
| `checkAll`       | `() => void`                                | 모든 아이템을 체크 상태로 설정            |
| `unCheckAll`     | `() => void`                                | 모든 아이템을 체크 해제                   |
| `updateAll`      | `(checked: boolean) => void`                | 모든 아이템의 체크 상태를 일괄 변경       |
| `getCheckedList` | `() => T[]`                                 | 체크된 아이템 배열 반환                   |
| `getCheckedIds`  | `() => IdType<T>[]`                         | 체크된 아이템들의 ID 배열 반환            |
| `selectedCount`  | `number`                                    | 체크된 아이템의 개수                      |

---

## ✅ 예시

### 기본 사용법 - To-do 리스트

```tsx
import { useCheckList } from './hooks/useCheckList';

interface Todo {
  id: number;
  text: string;
  checked?: boolean;
}

function TodoList() {
  const todos: Todo[] = [
    { id: 1, text: '프로젝트 기획서 작성', checked: false },
    { id: 2, text: '디자인 시안 검토', checked: false },
    { id: 3, text: '코드 리뷰', checked: true },
  ];

  const { list, toggleItem, checkAll, unCheckAll, selectedCount, getCheckedList } = useCheckList<Todo>(todos);

  const handleDelete = () => {
    const checkedItems = getCheckedList();
    console.log('삭제할 항목:', checkedItems);
  };

  return (
    <div>
      <h1>할 일 목록</h1>
      <div>
        <button onClick={checkAll}>전체 선택</button>
        <button onClick={unCheckAll}>전체 해제</button>
        <button onClick={handleDelete}>선택 항목 삭제 ({selectedCount})</button>
      </div>
      <ul>
        {list.map((todo) => (
          <li key={todo.id}>
            <label>
              <input type="checkbox" checked={todo.checked} onChange={() => toggleItem(todo.id)} />
              <span style={{ textDecoration: todo.checked ? 'line-through' : 'none' }}>{todo.text}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 테이블에서 다중 선택

```tsx
import { useCheckList } from './hooks/useCheckList';

interface User {
  id: string;
  name: string;
  email: string;
  checked?: boolean;
}

function UserTable() {
  const users: User[] = [
    { id: 'u1', name: '메이토', email: 'mato@example.com' },
    { id: 'u2', name: '기린', email: 'kirine@example.com' },
    { id: 'u3', name: '호이초이', email: 'hocho@example.com' },
  ];

  const { list, isAllChecked, toggleAll, toggleItem, getCheckedIds, selectedCount } = useCheckList<User>(users);

  const handleBulkAction = () => {
    const selectedIds = getCheckedIds();
    console.log('선택된 사용자 ID:', selectedIds);
  };

  return (
    <div>
      <h2>사용자 목록 ({selectedCount}개 선택됨)</h2>
      <button onClick={handleBulkAction} disabled={selectedCount === 0}>
        일괄 작업 실행
      </button>
      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" checked={isAllChecked()} onChange={toggleAll} />
            </th>
            <th>이름</th>
            <th>이메일</th>
          </tr>
        </thead>
        <tbody>
          {list.map((user) => (
            <tr key={user.id}>
              <td>
                <input type="checkbox" checked={user.checked} onChange={() => toggleItem(user.id)} />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 단순 배열 사용 (자동 정규화)

```tsx
import { useCheckList } from './hooks/useCheckList';

function FruitSelector() {
  // id와 checked가 없는 단순 배열도 자동으로 처리됩니다
  const fruits = ['사과', '바나나', '오렌지', '포도'];

  const { list, toggleItem, getCheckedList } = useCheckList(fruits.map((fruit) => ({ name: fruit })));

  return (
    <div>
      <h2>좋아하는 과일을 선택하세요</h2>
      {list.map((item) => (
        <label key={item.id}>
          <input type="checkbox" checked={item.checked} onChange={() => toggleItem(item.id)} />
          {item.name}
        </label>
      ))}
      <p>
        선택한 과일:{' '}
        {getCheckedList()
          .map((i) => i.name)
          .join(', ')}
      </p>
    </div>
  );
}
```

### 조건부 체크/해제

```tsx
import { useCheckList } from './hooks/useCheckList';

interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  checked?: boolean;
}

function ProductList() {
  const products: Product[] = [
    { id: 1, name: '노트북', price: 1500000, inStock: true },
    { id: 2, name: '마우스', price: 30000, inStock: false },
    { id: 3, name: '키보드', price: 80000, inStock: true },
  ];

  const { list, set, getCheckedList } = useCheckList<Product>(products);

  // 재고가 있는 상품만 선택
  const selectInStock = () => {
    const updated = list.map((item) => ({
      ...item,
      checked: item.inStock,
    }));
    set(updated);
  };

  // 특정 가격 이상 상품만 선택
  const selectExpensive = () => {
    const updated = list.map((item) => ({
      ...item,
      checked: item.price >= 50000,
    }));
    set(updated);
  };

  return (
    <div>
      <button onClick={selectInStock}>재고 있는 상품만 선택</button>
      <button onClick={selectExpensive}>5만원 이상만 선택</button>
      {/* 상품 목록 렌더링 */}
    </div>
  );
}
```
