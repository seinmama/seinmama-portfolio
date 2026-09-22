import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuestbookService } from '../../../../core/guestbook.service';

@Component({
  selector: 'page-guestbook',
  imports: [FormsModule, DatePipe],
  templateUrl: './guestbook.html',
  styleUrl: './guestbook.less',
})
export class Guestbook {
  protected readonly guestbook = inject(GuestbookService);

  protected readonly name = signal('');
  protected readonly message = signal('');

  protected submit(): void {
    const name = this.name().trim();
    const message = this.message().trim();
    if (!name || !message) {
      return;
    }
    this.guestbook.add(name, message);
    this.name.set('');
    this.message.set('');
  }
}
