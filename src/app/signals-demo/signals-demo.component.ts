import { Component, DestroyRef, effect, signal } from '@angular/core';
import { StarWarsApiService } from '../services/star-wars-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Episode } from '../models/Episode';
import { CommonModule } from '@angular/common';
import { Character } from '../models/Character';
import { CharacterDetails } from '../models/CharacterDetails';

@Component({
  selector: 'app-signals-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signals-demo.component.html',
})
export class SignalsDemoComponent {
  protected episodes = signal<Episode[]>([]);
  protected charactersByEpisode = signal<Character[]>([]);
  protected selectedCharacterDetails = signal<CharacterDetails | undefined>(
    undefined,
  );

  protected selectedEpisode = signal<Episode | undefined>(undefined);
  protected selectedCharacter = signal<Character | undefined>(undefined);

  constructor(starWarsService: StarWarsApiService, destroyRef: DestroyRef) {
    starWarsService.getEpisodes().subscribe((x) => this.episodes.set(x));

    effect(() => {
      const selectedEpisode = this.selectedEpisode();
      if (selectedEpisode !== undefined) {
        starWarsService
          .getCharactersByEpisode(selectedEpisode)
          .pipe(takeUntilDestroyed(destroyRef))
          .subscribe((x) => this.charactersByEpisode.set(x));
      }
    });

    effect(() => {
      const selectedCharacter = this.selectedCharacter();
      if (selectedCharacter) {
        starWarsService
          .getCharacterDetails(selectedCharacter)
          .pipe(takeUntilDestroyed(destroyRef))
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
