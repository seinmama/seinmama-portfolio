import { Injectable, PLATFORM_ID, WritableSignal, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const PREFIX = 'zune-portfolio:';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  get<T>(key: string): T | null {
    if (!this.isBrowser) {
      return null;
    }
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  }

  /** A signal seeded from storage that writes every `set`/`update` back to it. */
  persisted<T>(key: string, initial: T): WritableSignal<T> {
    const state = signal<T>(this.get<T>(key) ?? initial);
    const setState = state.set.bind(state);
    state.set = (value: T) => {
      setState(value);
      this.set(key, value);
    };
    state.update = (fn: (value: T) => T) => state.set(fn(state()));
    return state;
  }

  remove(key: string): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.removeItem(PREFIX + key);
  }
}
