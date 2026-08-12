import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'flow-intro',
  imports: [RouterLink],
  templateUrl: './intro.html',
  styleUrl: './intro.less',
})
export class Intro {}
