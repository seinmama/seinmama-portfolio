import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength = 120): string {
    if (value.length <= maxLength) {
      return value;
    }
    return `${value.slice(0, maxLength).trimEnd()}…`;
  }
}
