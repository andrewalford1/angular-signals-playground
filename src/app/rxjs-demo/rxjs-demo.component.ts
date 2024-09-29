import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Episode } from '../models/Episode';
import { StarWarsApiService } from '../services/star-wars-api.service';
import { Character } from '../models/Character';

@Component({
  selector: 'app-rxjs-demo',
  standalone: true,
  imports: [],
  templateUrl: './rxjs-demo.component.html',
})
export class RxjsDemoComponent {
  protected episodes$: Observable<Episode | undefined> = new Observable(
    undefined,
  );
  protected characters$: Observable<Episode | undefined> = new Observable(
    undefined,
  );

  constructor(starWarsService: StarWarsApiService) {}

  protected selectEpisode(episodeId: number) {
    console.error('not implemented');
  }

  protected selectCharacter(character: Character) {}
}
