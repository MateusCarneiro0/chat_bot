import { useEffect, useState } from "react";

export function useLocalStorage(initialValue, key) {
  const [value, setValue] = useState(() => {
    const localValue = localStorage.getItem(key);
    return localValue ? JSON.parse(localValue) : initialValue;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
