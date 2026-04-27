import {
  useDebugValue,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react';

type Selector<TSnapshot, TSelection> = (snapshot: TSnapshot) => TSelection;
type Equality<TSelection> = (a: TSelection, b: TSelection) => boolean;

export function useSyncExternalStoreWithSelector<TSnapshot, TSelection>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => TSnapshot,
  getServerSnapshot: (() => TSnapshot) | undefined,
  selector: Selector<TSnapshot, TSelection>,
  isEqual?: Equality<TSelection>,
): TSelection {
  const latestSelectionRef = useRef<TSelection | null>(null);
  const hasSelectionRef = useRef(false);

  const memoizedSelector = useMemo(
    () => (snapshot: TSnapshot) => {
      const nextSelection = selector(snapshot);

      if (
        hasSelectionRef.current &&
        isEqual &&
        latestSelectionRef.current !== null &&
        isEqual(latestSelectionRef.current, nextSelection)
      ) {
        return latestSelectionRef.current;
      }

      hasSelectionRef.current = true;
      latestSelectionRef.current = nextSelection;
      return nextSelection;
    },
    [isEqual, selector],
  );

  const selection = useSyncExternalStore(
    subscribe,
    () => memoizedSelector(getSnapshot()),
    getServerSnapshot
      ? () => memoizedSelector(getServerSnapshot())
      : () => memoizedSelector(getSnapshot()),
  );

  useEffect(() => {
    latestSelectionRef.current = selection;
    hasSelectionRef.current = true;
  }, [selection]);

  useDebugValue(selection);

  return selection;
}

export default {
  useSyncExternalStoreWithSelector,
};
