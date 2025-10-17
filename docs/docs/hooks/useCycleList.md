# useCycleList

`useCycleList`는 배열을 순환적으로 탐색하는 커스텀 React 훅입니다.

배열의 요소들을 순환하며 이동할 수 있는 기능과 캐러셀, 슬라이더 등에 유용한 확장 기능들을 제공합니다.

## 🔗 사용법

```tsx
const controls = useCycleList({ list, options });
```

### 매개변수

| 이름      | 타입                                     | 설명                 |
| --------- | ---------------------------------------- | -------------------- |
| `list`    | `T[]`                                    | 순환할 배열          |
| `options` | `{ initialValue?: T, steps?: number[] }` | 추가 옵션 (선택사항) |

#### Options

| 프로퍼티       | 타입       | 기본값      | 설명                               |
| -------------- | ---------- | ----------- | ---------------------------------- |
| `initialValue` | `T`        | `undefined` | 시작할 초기 값                     |
| `steps`        | `number[]` | `[1, -1]`   | 확장 배열 생성 시 사용할 스텝 배열 |

### 반환값

| 프로퍼티        | 타입                      | 설명                              |
| --------------- | ------------------------- | --------------------------------- |
| `state`         | `T`                       | 현재 선택된 값                    |
| `next`          | `() => void`              | 다음 항목으로 이동                |
| `prev`          | `() => void`              | 이전 항목으로 이동                |
| `extendedArray` | `T[]`                     | steps 기반으로 생성된 확장 배열   |
| `getStepValues` | `() => T[]`               | steps 위치의 값들을 반환하는 함수 |
| `goTo`          | `(value: T) => void`      | 특정 값으로 직접 이동             |
| `goToIndex`     | `(index: number) => void` | 특정 인덱스로 직접 이동           |
| `currentIndex`  | `number`                  | 현재 인덱스                       |

---

## ✅ 기본 예시

### 간단한 문자열 배열 순환

```tsx
import React from 'react';
import { useCycleList } from './useCycleList';

function BasicCycleExample() {
  const cycle = useCycleList({
    list: ['🍎', '🍌', '🍊', '🍇', '🍓'],
  });

  return (
    <div>
      <h2>과일 선택기</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={cycle.prev}>← 이전</button>
        <div
          style={{
            fontSize: '48px',
            minWidth: '80px',
            textAlign: 'center',
          }}
        >
          {cycle.state}
        </div>
        <button onClick={cycle.next}>다음 →</button>
      </div>
      <p>현재 인덱스: {cycle.currentIndex}</p>
    </div>
  );
}
```

### 초기값 설정

```tsx
function InitialValueExample() {
  const colors = useCycleList({
    list: ['red', 'green', 'blue', 'yellow'],
    options: { initialValue: 'blue' }, // blue부터 시작
  });

  return (
    <div>
      <h2>색상 선택기 (blue부터 시작)</h2>
      <div
        style={{
          backgroundColor: colors.state,
          padding: '20px',
          color: 'white',
          textAlign: 'center',
        }}
      >
        현재 색상: {colors.state}
      </div>
      <div>
        <button onClick={colors.prev}>이전</button>
        <button onClick={colors.next}>다음</button>
      </div>

      {/* 직접 이동 버튼들 */}
      <div style={{ marginTop: '10px' }}>
        {['red', 'green', 'blue', 'yellow'].map((color) => (
          <button
            key={color}
            onClick={() => colors.goTo(color)}
            style={{
              margin: '2px',
              backgroundColor: color === colors.state ? '#007bff' : '#f0f0f0',
            }}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### 캐러셀 (Steps 활용)

```tsx
function CarouselExample() {
  const carousel = useCycleList({
    list: ['🏠', '🏢', '🏭', '🏪', '🏫', '🏥', '🏦'],
    options: { steps: [-1, 0, 1] }, // 이전, 현재, 다음
  });

  const stepValues = carousel.getStepValues();

  return (
    <div>
      <h2>건물 캐러셀</h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <button onClick={carousel.prev}>← 이전</button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {stepValues.map((item, index) => (
            <div
              key={index}
              style={{
                fontSize: index === 1 ? '64px' : '32px', // 가운데가 더 크게
                opacity: index === 1 ? 1 : 0.5,
                transition: 'all 0.3s ease',
                padding: '8px',
              }}
            >
              {item}
            </div>
          ))}
        </div>

        <button onClick={carousel.next}>다음 →</button>
      </div>
      <p>Step Values: [{stepValues.join(', ')}]</p>
      <p>Extended Array: [{carousel.extendedArray.join(', ')}]</p>
    </div>
  );
}
```

### 컴포넌트 순환

```tsx
function ComponentCycleExample() {
  const components = useCycleList({
    list: [
      <div key="1" style={{ padding: '20px', backgroundColor: '#ffebee' }}>
        <h3>🔴 빨간 컴포넌트</h3>
        <p>첫 번째 컴포넌트입니다.</p>
      </div>,
      <div key="2" style={{ padding: '20px', backgroundColor: '#e3f2fd' }}>
        <h3>🔵 파란 컴포넌트</h3>
        <p>두 번째 컴포넌트입니다.</p>
      </div>,
      <div key="3" style={{ padding: '20px', backgroundColor: '#e8f5e8' }}>
        <h3>🟢 초록 컴포넌트</h3>
        <p>세 번째 컴포넌트입니다.</p>
      </div>,
    ],
  });

  return (
    <div>
      <h2>컴포넌트 순환기</h2>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={components.prev}>← 이전</button>
        <span style={{ margin: '0 16px' }}>
          {components.currentIndex + 1} / {components.extendedArray.length}
        </span>
        <button onClick={components.next}>다음 →</button>
      </div>

      <div
        style={{
          border: '2px solid #ddd',
          borderRadius: '8px',
          minHeight: '150px',
        }}
      >
        {components.state}
      </div>
    </div>
  );
}
```

## 🎯 주요 기능

### 1. **기본 순환 탐색**

- `next()`: 다음 항목으로 이동 (마지막에서 첫 번째로 순환)
- `prev()`: 이전 항목으로 이동 (첫 번째에서 마지막으로 순환)

### 2. **직접 이동**

- `goTo(value)`: 특정 값으로 직접 이동
- `goToIndex(index)`: 특정 인덱스로 직접 이동 (음수/초과 인덱스 자동 순환 처리)

### 3. **확장 기능**

- `steps`: 현재 위치 기준으로 여러 값을 동시에 가져오기
- `extendedArray`: steps 범위의 전체 배열 제공
- `getStepValues()`: steps 위치의 정확한 값들만 반환

### 4. **타입 안전성**

- TypeScript 완전 지원
- 제네릭을 통한 타입 추론
- 모든 메서드에 대한 타입 안전성 보장

## 🔧 활용 사례

- **캐러셀/슬라이더**: 이미지나 컨텐츠 순환 표시
- **탭 네비게이션**: 탭 간 순환 이동
- **설정 옵션**: 다양한 설정 값들 순환 선택
- **다단계 폼**: 단계별 폼 네비게이션
- **미디어 플레이어**: 재생목록 순환 재생
