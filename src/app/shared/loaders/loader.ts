import { Component, inject } from '@angular/core';
import { ThemeService } from '../../core/theme.service';
import { CoffeeLoader } from './coffee/coffee-loader';
import { NatureLoader } from './nature/nature-loader';
import { CyberpunkLoader } from './cyberpunk/cyberpunk-loader';

@Component({
  selector: 'app-loader',
  imports: [CoffeeLoader, NatureLoader, CyberpunkLoader],
  templateUrl: './loader.html',
})
export class Loader {
  protected readonly theme = inject(ThemeService);
}
