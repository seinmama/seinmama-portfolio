import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { AudienceId, SkinId, StyleId } from './models';

export type FlowStep = 'intro' | 'audience' | 'style' | 'skins' | 'terminal';

export const FLOW_ORDER: readonly FlowStep[] = ['intro', 'audience', 'style', 'skins', 'terminal'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageService);

  readonly audience = signal<AudienceId | null>(this.storage.get<AudienceId>('audience'));
  readonly style = signal<StyleId | null>(this.storage.get<StyleId>('style'));
  readonly skin = signal<SkinId | null>(this.storage.get<SkinId>('skin'));
  readonly order = signal<readonly FlowStep[]>(FLOW_ORDER);

  readonly themeClass = computed(() => {
    const skin = this.skin();
    return skin ? `theme-${skin}` : 'theme-default';
  });

  setAudience(id: AudienceId): void {
    this.audience.set(id);
    this.storage.set('audience', id);
  }

  setStyle(id: StyleId): void {
    this.style.set(id);
    this.storage.set('style', id);
  }

  setSkin(id: SkinId): void {
    this.skin.set(id);
    this.storage.set('skin', id);
  }

  stepIndex(step: FlowStep): number {
    return this.order().indexOf(step);
  }

  reset(): void {
    this.audience.set(null);
    this.style.set(null);
    this.skin.set(null);
    this.storage.remove('audience');
    this.storage.remove('style');
    this.storage.remove('skin');
  }
}
