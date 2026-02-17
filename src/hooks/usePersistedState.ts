import { useReducer, useEffect, useRef, useState, useCallback, type Reducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * A drop-in replacement for useReducer that persists state to AsyncStorage.
 *
 * On mount it hydrates from the given storage key; every subsequent state
 * change is written back automatically.  While hydration is in progress the
 * `hydrated` flag is false so the UI can show a loading state if desired.
 */
export function usePersistedReducer<S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  storageKey: string
): [state: S, dispatch: React.Dispatch<A>, hydrated: boolean] {
  const [hydrated, setHydrated] = useState(false);

  // Wrap the real reducer so we can inject a special HYDRATE action that
  // replaces the entire state with whatever was found in storage.
  const hydrateActionRef = useRef(Symbol("HYDRATE"));

  const wrappedReducer = useCallback(
    (state: S, action: A | { __hydrate: symbol; payload: S }): S => {
      if (
        action !== null &&
        typeof action === "object" &&
        "__hydrate" in action &&
        (action as { __hydrate: symbol }).__hydrate === hydrateActionRef.current
      ) {
        return (action as { payload: S }).payload;
      }
      return reducer(state, action as A);
    },
    [reducer]
  );

  const [state, rawDispatch] = useReducer(wrappedReducer, initialState);

  // Expose a typed dispatch that hides the internal hydrate action.
  const dispatch: React.Dispatch<A> = rawDispatch as React.Dispatch<A>;

  // ── Hydrate from AsyncStorage on mount ──────────────────────────
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;

    (async () => {
      try {
        const json = await AsyncStorage.getItem(storageKey);
        if (json !== null && isMounted.current) {
          const parsed = JSON.parse(json) as S;
          rawDispatch({
            __hydrate: hydrateActionRef.current,
            payload: parsed,
          });
        }
      } catch (error) {
        console.warn(`[usePersistedReducer] Failed to load "${storageKey}":`, error);
      } finally {
        if (isMounted.current) {
          setHydrated(true);
        }
      }
    })();

    return () => {
      isMounted.current = false;
    };
  }, [storageKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Persist to AsyncStorage on every state change ───────────────
  const isFirstRender = useRef(true);
  useEffect(() => {
    // Skip writing the initial (empty) state before hydration completes.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!hydrated) return;

    AsyncStorage.setItem(storageKey, JSON.stringify(state)).catch((error) =>
      console.warn(`[usePersistedReducer] Failed to save "${storageKey}":`, error)
    );
  }, [state, storageKey, hydrated]);

  return [state, dispatch, hydrated];
}
