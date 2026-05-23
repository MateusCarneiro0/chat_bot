import { useState } from "react";

export function useGetItem(key, initialValue, callback) {
  const [value, setValue] = useState(() => {
    const localValue = JSON.parse(localStorage.getItem(key));
    return localValue?.length ? localValue.map(callback) : initialValue;
  });

  return [value, setValue];
}
