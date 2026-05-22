import { useEffect } from "react";

export function useKeydown(callback, code, isCtrl) {
  useEffect(() => {
    function callbackFunction(ev) {
      if ((isCtrl ? ev.ctrlKey : true) && ev.code === code) {
        callback?.();
      }
    }
    document.addEventListener("keydown", callbackFunction);
    return () => document.removeEventListener("keydown", callbackFunction);
  }, [callback, code, isCtrl]);
}
