import { signOut } from 'next-auth/react';
import { useEffect, useRef } from 'react';

const useInactivityLogout = (timeoutMinutes) => {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!timeoutMinutes) return; // ❗ Skip if not active (e.g., not authenticated)

    const timeout = timeoutMinutes * 60 * 1000;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        signOut();
      }, timeout);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // start initial timer

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [timeoutMinutes]); // re-run only when the timeout changes
};

export default useInactivityLogout;
