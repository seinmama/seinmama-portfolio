import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

const BOOT_LINES = [
  'initializing device…',
  'loading library…',
  'syncing preferences…',
  'ready.',
];

@Component({
  selector: 'flow-terminal',
  templateUrl: './terminal.html',
  styleUrl: './terminal.less',
})
export class Terminal implements OnInit {
  private readonly router = inject(Router);

  protected readonly visibleLines = signal<string[]>([]);

  ngOnInit(): void {
    BOOT_LINES.forEach((line, index) => {
      setTimeout(() => {
        this.visibleLines.update((lines) => [...lines, line]);
        if (index === BOOT_LINES.length - 1) {
          setTimeout(() => this.router.navigate(['/site']), 600);
        }
      }, index * 500);
    });
  }
}
