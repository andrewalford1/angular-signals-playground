import { Component, DestroyRef, effect, signal } from '@angular/core';
import { StarWarsApiService } from '../services/star-wars-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Film } from '../models/Film';
import { CommonModule } from '@angular/common';
import { Character } from '../models/Character';
import { CharacterDetails } from '../models/CharacterDetails';
import { take } from 'rxjs';

@Component({
  selector: 'app-signals-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signals-demo.component.html',
})
export class SignalsDemoComponent {
  protected episodes = signal<Film[]>([]);
  //protected selectedEpisodeSubject = new Subject<number>();
  protected selectedEpisode = signal<number | undefined>(undefined);
  protected charactersByEpisode = signal<Character[]>([]);

  protected selectedCharacter = signal<Character | undefined>(undefined);
  protected selectedCharacterDetails = signal<CharacterDetails | undefined>(
    undefined,
  );

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
      const selectedEpisodeId = this.selectedEpisode();
      if (selectedEpisodeId !== undefined) {
        starWarsService
          .getCharactersByEpisodeId(selectedEpisodeId)
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

  protected selectEpisode(episodeId: number) {
    this.charactersByEpisode.set([]);

    if (episodeId == this.selectedEpisode()) {
      this.selectedEpisode.set(undefined);
    } else {
      this.selectedEpisode.set(episodeId);
    }
    //this.selectedEpisodeSubject.next(episodeId);
  }

  protected selectCharacter(character: Character) {
    this.selectedCharacterDetails.set(undefined);
    this.selectedCharacter.set(character);
  }
}
