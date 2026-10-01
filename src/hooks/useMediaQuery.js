import { useMemo, useSyncExternalStore } from 'react';

export function useMediaQuery(query) {
  const media = useMemo(() => window.matchMedia(query), [query]);
  const subscribe = useMemo(() => callback => {
    media.addEventListener('change', callback);
    return () => media.removeEventListener('change', callback);
  }, [media]);
  return useSyncExternalStore(subscribe, () => media.matches, () => false);
}
