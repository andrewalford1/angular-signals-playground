import { Component, DestroyRef, effect, signal } from '@angular/core';
import { StarWarsApiService } from '../services/star-wars-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Episode } from '../models/Episode';
import { CommonModule } from '@angular/common';
import { Character } from '../models/Character';
import { CharacterDetails } from '../models/CharacterDetails';

/**
 * This code is a lot more cleaner than the pure RXSJ demo,
 * however, there is still some conditional logic within the effects.
 * Additionally, the Angular team recommend that effects should only
 * be used for things that do not effect the flow of code execution
 * such as logging analytics or debugging.
 */

@Component({
  selector: 'app-signals-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './imperative-signals-demo.component.html',
})
export class ImperativeSignalsDemoComponent {
  protected episodes: Episode[] = [];
  protected charactersByEpisode = signal<Character[]>([]);
  protected selectedCharacterDetails = signal<CharacterDetails | undefined>(
    undefined,
  );

  protected selectedEpisode = signal<Episode | undefined>(undefined);
  protected selectedCharacter = signal<Character | undefined>(undefined);

  constructor(starWarsService: StarWarsApiService) {
    starWarsService.getEpisodes().subscribe((x) => (this.episodes = x));

    effect(() => {
      const selectedEpisode = this.selectedEpisode();
      if (selectedEpisode !== undefined) {
        starWarsService
          .getCharactersByEpisode(selectedEpisode)
          .subscribe((x) => this.charactersByEpisode.set(x));
      }
    });

    effect(() => {
      const selectedCharacter = this.selectedCharacter();
      if (selectedCharacter) {
        starWarsService
          .getCharacterDetails(selectedCharacter)
          .subscribe((x) => {
            return this.selectedCharacterDetails.set(x);
          });
      }
    });
  }

  protected selectEpisode(episode: Episode) {
    this.charactersByEpisode.set([]);
    this.selectedEpisode.set(episode);
  }

  protected selectCharacter(character: Character) {
    this.selectedCharacterDetails.set(undefined);
    this.selectedCharacter.set(character);
  }
}
