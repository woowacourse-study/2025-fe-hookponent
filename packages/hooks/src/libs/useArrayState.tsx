import { useMemo, useState } from 'react';

interface UserDefinedArraySetterNameType<T> {
  set: (newArray: T[]) => void;
  push: (...newValues: T[]) => void;
  pop: () => void;
  clear: () => void;
  shift: () => void;
  unshift: (...newValues: T[]) => void;
  splice: (startIndex: number, deleteCount: number, ...newValues: T[]) => void;
  insertAt: (startIndex: number, ...newValues: T[]) => void;
  removeAt: (deleteIndex: number) => void;
  updateAt: (updateIndex: number, updateValue: T) => void;
}

type userArrayStateReturn<T> = [T[], UserDefinedArraySetterNameType<T>];

export function useArrayState<T>(initialValue: T[] | (() => T[])): userArrayStateReturn<T> {
  const [value, setValue] = useState<T[]>(initialValue);

  const userDefinedArraySetterName: UserDefinedArraySetterNameType<T> = useMemo(
    () => ({
      set: (newArray) => {
        setValue(newArray);
      },
      push: (...newValues) => {
        setValue((prev) => [...prev, ...newValues]);
      },
      pop: () => {
        setValue((prev) => prev.slice(0, -1));
      },
      clear: () => {
        setValue([]);
      },
      shift: () => {
        setValue((prev) => prev.slice(1));
      },
      unshift: (...newValues) => {
        setValue((prev) => [...newValues, ...prev]);
      },
      splice: (startIndex, deleteCount, ...newValues) => {
        setValue((prev) => {
          const newArray = [...prev];
          newArray.splice(startIndex, deleteCount, ...newValues);
          return newArray;
        });
      },
      insertAt: (startIndex, ...newValues) => {
        setValue((prev) => {
          const newArray = [...prev];
          newArray.splice(startIndex, 0, ...newValues);
          return newArray;
        });
      },
      removeAt: (deleteIndex) => {
        setValue((prev) => {
          const newArray = [...prev];
          newArray.splice(deleteIndex, 1);
          return newArray;
        });
      },
      updateAt: (updateIndex, updateValue) => {
        setValue((prev) => {
          const newArray = [...prev];
          newArray.splice(updateIndex, 1, updateValue);
          return newArray;
        });
      },
    }),
    []
  );

  return [value, userDefinedArraySetterName];
}
