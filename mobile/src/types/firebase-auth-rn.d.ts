import type { Persistence } from 'firebase/auth';

// The "types" condition in @firebase/auth resolves before "react-native", hiding this export.
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: {
    setItem(key: string, value: string): Promise<void>;
    getItem(key: string): Promise<string | null>;
    removeItem(key: string): Promise<void>;
  }): Persistence;
}
