// useClickOutside.js — Close a dropdown/modal when user clicks outside it
// Reusable hook: used by Navbar dropdown, modals, date pickers, etc.
import { useEffect, useRef } from 'react';

// Usage:
// const ref = useClickOutside(() => setOpen(false));
// <div ref={ref}>...dropdown content...</div>
const useClickOutside = (handler) => {
  const ref = useRef(null);

  useEffect(() => {
    const listener = (event) => {
      // If the click is INSIDE the ref element, do nothing.
      // If it's OUTSIDE, call the handler to close the dropdown.
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    // Listen on the document for mousedown (fires before click)
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener); // mobile support

    // Cleanup on unmount — prevents memory leaks
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]); // re-attach if handler changes

  return ref;
};

export default useClickOutside;
