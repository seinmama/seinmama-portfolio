import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { GuestbookEntry } from './models';

const KEY = 'guestbook';

const SEED_ENTRIES: GuestbookEntry[] = [
  {
    id: 'seed-webmaster_tina',
    name: 'webmaster_tina',
    message: 'kewl site!! love the glitter :) added u to my links page',
    createdAt: '2026-07-11T00:00:00.000Z',
  },
  {
    id: 'seed-x_darkcoder_x',
    name: 'x_darkcoder_x',
    message: 'how did u do the marquee?? teach me sensei 🙏',
    createdAt: '2026-07-09T00:00:00.000Z',
  },
  {
    id: 'seed-GeoFan99',
    name: 'GeoFan99',
    message: 'best homepage on the whole net!! keep it up ⭐⭐⭐',
    createdAt: '2026-07-02T00:00:00.000Z',
  },
];

@Injectable({ providedIn: 'root' })
export class GuestbookService {
  private readonly storage = inject(StorageService);

  readonly entries = signal<GuestbookEntry[]>(this.storage.get<GuestbookEntry[]>(KEY) ?? SEED_ENTRIES);

  add(name: string, message: string, badge?: string): void {
    const entry: GuestbookEntry = {
      id: crypto.randomUUID(),
      name,
      message,
      createdAt: new Date().toISOString(),
      ...(badge ? { badge } : {}),
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
