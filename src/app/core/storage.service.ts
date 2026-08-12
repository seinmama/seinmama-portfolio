import { Injectable, PLATFORM_ID, inject } from '@angular/core';
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

  remove(key: string): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.removeItem(PREFIX + key);
  }
}
