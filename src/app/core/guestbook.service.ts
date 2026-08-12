import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { GuestbookEntry } from './models';

const KEY = 'guestbook';

@Injectable({ providedIn: 'root' })
export class GuestbookService {
  private readonly storage = inject(StorageService);

  readonly entries = signal<GuestbookEntry[]>(this.storage.get<GuestbookEntry[]>(KEY) ?? []);

  add(name: string, message: string): void {
    const entry: GuestbookEntry = {
      id: crypto.randomUUID(),
      name,
      message,
      createdAt: new Date().toISOString(),
    };
    const next = [entry, ...this.entries()];
    this.entries.set(next);
    this.storage.set(KEY, next);
  }

  remove(id: string): void {
    const next = this.entries().filter((entry) => entry.id !== id);
    this.entries.set(next);
    this.storage.set(KEY, next);
  }
}
