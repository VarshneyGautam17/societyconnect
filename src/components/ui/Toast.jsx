'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [state, setState] = useState({ msg: '', visible: false });
  const timerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setState({ msg, visible: true });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setState((s) => ({ ...s, visible: false })), 2600);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        role="status"
        className={
          'fixed left-1/2 bottom-6 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-md text-label-md font-semibold px-5 py-3 rounded-full shadow-xl z-50 max-w-[90vw] text-center transition-all duration-200 pointer-events-none ' +
          (state.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')
        }
      >
        {state.msg}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
