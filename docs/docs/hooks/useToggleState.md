# useToggleState

## 📝 사용법

boolean 타입의 state를 Toggle로 쉽게 사용할 수 있는 hook 입니다.

```ts
type useToggleStateReturn = readonly [boolean, () => void];

function useToggleState(defaultValue: boolean = false): useToggleStateReturn;
```

## 📝 사용 예시

```ts
const [bool, toggle] = useToggleState(false);
```
