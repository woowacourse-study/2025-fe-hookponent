// src/hooks/useBooleanState.test.tsx
import { renderHook } from "@testing-library/react";
import { useBooleanState } from "./useBooleanState";

type Return = ReturnType<typeof useBooleanState>;
type Controls = Return[1];

describe("useBooleanState", () => {
  it("should initialize with false by default", () => {
    const { result } = renderHook(() => useBooleanState());
    expect(result.current[0]).toBe(false);
  });

  it("should initialize with true when passed", () => {
    const { result } = renderHook(() => useBooleanState(true));
    expect(result.current[0]).toBe(true);
  });
});
