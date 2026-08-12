import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { AudienceId, SkinId } from './models';

export type FlowStep = 'intro' | 'audience' | 'skins' | 'terminal';

export const FLOW_ORDER: readonly FlowStep[] = ['intro', 'audience', 'skins', 'terminal'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageService);

  readonly audience = signal<AudienceId | null>(this.storage.get<AudienceId>('audience'));
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

  setSkin(id: SkinId): void {
    this.skin.set(id);
    this.storage.set('skin', id);
  }

  stepIndex(step: FlowStep): number {
    return this.order().indexOf(step);
  }

  reset(): void {
    this.audience.set(null);
    this.skin.set(null);
    this.storage.remove('audience');
    this.storage.remove('skin');
  }
}
