import { Component, DestroyRef, effect, signal } from '@angular/core';
import { StarWarsApiService } from '../services/star-wars-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Film } from '../models/Film';
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
  protected episodes = signal<Film[]>([]);
  //protected selectedEpisodeSubject = new Subject<number>();
  protected charactersByEpisode = signal<Character[]>([]);
  protected selectedCharacterDetails = signal<CharacterDetails | undefined>(
    undefined,
  );

  protected selectedEpisode = signal<Film | undefined>(undefined);
  protected selectedCharacter = signal<Character | undefined>(undefined);

  constructor(starWarsService: StarWarsApiService, destroyRef: DestroyRef) {
    // this.selectedEpisodeSubject
    //   .pipe(
    //     switchMap((episodeId) =>
    //       this.starWarsService.getCharactersByEpisodeId(episodeId),
    //     ),
    //     takeUntilDestroyed(),
    //   )
    //   .subscribe((x) => this.charactersByEpisode.set(x));

    starWarsService.getFilms().subscribe((x) => this.episodes.set(x));

    // Fetch characters by episode.
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
            console.log(x);
            return this.selectedCharacterDetails.set(x);
          });
      }
    });
  }

  protected selectEpisode(episode: Film) {
    this.charactersByEpisode.set([]);
    this.selectedEpisode.set(episode);
  }

  protected selectCharacter(character: Character) {
    this.selectedCharacterDetails.set(undefined);
    this.selectedCharacter.set(character);
  }
}
