# useEventDelegation

이벤트 위임(Event Delegation) 패턴으로 **대량의 하위 요소에 대한 이벤트 처리를 최적화**하는 커스텀 React Hook입니다.

- 부모 컨테이너에 **하나의 핸들러만 등록**하고 하위 요소 이벤트를 효율적으로 처리
- `data-id` 속성으로 **요소와 데이터를 자동 매핑**
- **커스텀 selector/idAttribute** 지원으로 유연한 매칭
- 내장된 `stopPropagation`/`preventDefault` 옵션
- **callbackRef 패턴**으로 불필요한 핸들러 재생성 방지

---

## 🔗 사용법

```tsx
const handler = useEventDelegation(dataList, callback, options?);
```

---

## 📥 매개변수

| 이름       | 타입                | 설명                                   |
| ---------- | ------------------- | -------------------------------------- |
| `dataList` | `readonly T[]`      | 이벤트와 연결할 데이터 배열            |
| `callback` | `EventCallback<T>`  | 이벤트 발생 시 실행될 콜백 함수        |
| `options`  | `DelegationOptions` | 선택값 / 매칭 방식 및 이벤트 제어 설정 |

### 🔧 `callback` 시그니처

```tsx
type EventCallback<T> = (event: React.SyntheticEvent, data: T, element: HTMLElement) => void;
```

### 🔧 `options` 구조

| 필드              | 타입       | 설명                                          |
| ----------------- | ---------- | --------------------------------------------- |
| `selector`        | `string?`  | 매칭할 CSS selector (기본: `[idAttribute]`)   |
| `idAttribute`     | `string?`  | 요소에서 id를 읽을 속성명 (기본: `'data-id'`) |
| `stopPropagation` | `boolean?` | 이벤트 버블링 중단 여부 (기본: `false`)       |
| `preventDefault`  | `boolean?` | 브라우저 기본 동작 방지 여부 (기본: `false`)  |

---

## 🔁 반환값

| 타입                                    | 설명                                      |
| --------------------------------------- | ----------------------------------------- |
| `(event: React.SyntheticEvent) => void` | 부모 컨테이너에 등록할 이벤트 핸들러 함수 |

---

## ✅ 예시

### 1) 기본 예시 (data-id 매핑)

- 가장 일반적인 사용법. `data-id` 속성으로 요소와 데이터를 매핑합니다.

```tsx
import { useEventDelegation } from 'hookdle';

const items = [
  { id: 1, name: 'Apple', price: 100 },
  { id: 2, name: 'Banana', price: 200 },
  { id: 3, name: 'Cherry', price: 300 },
];

export default function ItemList() {
  const handleItemClick = useEventDelegation(items, (event, item, element) => {
    console.log(`Clicked: ${item.name} (${item.price}원)`);
    element.classList.add('clicked');
  });

  return (
    <div onClick={handleItemClick} className="item-container">
      {items.map((item) => (
        <button key={item.id} data-id={item.id} className="item-button">
          {item.name} - {item.price}원
        </button>
      ))}
    </div>
  );
}
```

### 2) 커스텀 속성 (idAttribute)

- `data-id` 대신 다른 속성으로 매핑하고 싶을 때 사용합니다.

```tsx
const tabs = [
  { id: 'home', label: '홈', content: 'Home content' },
  { id: 'about', label: '소개', content: 'About content' },
];

function TabNavigation() {
  const handleTabClick = useEventDelegation(
    tabs,
    (e, tab) => {
      setActiveTab(tab.id);
    },
    {
      idAttribute: 'data-tab-id',
    }
  );

  return (
    <nav onClick={handleTabClick}>
      {tabs.map((tab) => (
        <button key={tab.id} data-tab-id={tab.id}>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
```

### 3) 고급 selector 및 이벤트 제어

- 더 구체적인 매칭과 이벤트 동작 제어가 필요할 때 사용합니다.

```tsx
const menuItems = [
  { id: 1, name: 'Edit', action: 'edit' },
  { id: 2, name: 'Delete', action: 'delete' },
];

function ContextMenu() {
  const handleMenuClick = useEventDelegation(
    menuItems,
    (e, item, el) => {
      console.log(`Action: ${item.action}`);
      // 메뉴 닫기
      closeContextMenu();
    },
    {
      selector: 'li button.menu-action',
      stopPropagation: true,
      preventDefault: true,
    }
  );

  return (
    <ul onClick={handleMenuClick} className="context-menu">
      {menuItems.map((item) => (
        <li key={item.id}>
          <button className="menu-action" data-id={item.id}>
            {item.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

---

## 🧩 팁

- **타입 안전성**: `const items = [...] as const` 사용으로 id 타입을 더 엄격하게 관리
- **options 최적화**: `useMemo`로 options 객체를 안정화하여 핸들러 재생성 방지
- **성능**: 대량 리스트(100+ 아이템)에서 개별 이벤트 리스너 대비 월등한 성능
- **접근성**: `role`, `aria-*` 속성과 함께 사용하여 키보드 내비게이션 지원
