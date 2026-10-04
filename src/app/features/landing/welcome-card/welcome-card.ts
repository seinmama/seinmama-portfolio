import { Component, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CLASSIC_SITE_URL, LANDING_CARD } from '../../../data/studio';

/** The card that greets visitors in the room and lets them pick the 3D studio or the classic site. */
@Component({
  selector: 'app-welcome-card',
  imports: [RouterLink],
  templateUrl: './welcome-card.html',
  styleUrl: './welcome-card.less',
})
export class WelcomeCard {
  /** Back to the closed door. */
  readonly replay = output();

  protected readonly card = LANDING_CARD;
  protected readonly classicUrl = CLASSIC_SITE_URL;
}
