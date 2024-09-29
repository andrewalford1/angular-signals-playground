import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { Episode } from '../models/Episode';
import { StarWarsApiService } from '../services/star-wars-api.service';
import { Character } from '../models/Character';
import { CommonModule } from '@angular/common';
import { CharacterDetails } from '../models/CharacterDetails';

@Component({
  selector: 'app-rxjs-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rxjs-demo.component.html',
})
export class RxjsDemoComponent implements OnInit {
  private readonly starWarsService = inject(StarWarsApiService);

  protected episodes$: Observable<Episode[] | undefined> | undefined =
    undefined;
  protected selectedEpisode$: Observable<Episode | undefined> | undefined =
    undefined;
  private readonly selectedEpisodeSubject: BehaviorSubject<
    Episode | undefined
  > = new BehaviorSubject<Episode | undefined>(undefined);

  private readonly selectedEpisodeRefreshSubject = new BehaviorSubject({});

  protected characters$: Observable<Character[] | undefined> = new Observable(
    undefined,
  );
  protected selectedCharacter$: Observable<Character | undefined> | undefined =
    undefined;
  private readonly selectedCharacterSubject: BehaviorSubject<
    Character | undefined
  > = new BehaviorSubject<Character | undefined>(undefined);

  protected selectedCharacterDetails$:
    | Observable<CharacterDetails | undefined>
    | undefined = undefined;

  public ngOnInit() {
    this.selectedEpisode$ = this.selectedEpisodeSubject.asObservable();

    this.episodes$ = this.selectedEpisodeRefreshSubject.pipe(
      switchMap(() => this.starWarsService.getEpisodes()),
    );

    this.selectedCharacter$ = this.selectedCharacterSubject.asObservable();

    this.characters$ = this.selectedEpisode$.pipe(
      switchMap((episode) => {
        if (episode) {
          return this.starWarsService.getCharactersByEpisode(episode);
        } else {
          return of(undefined);
        }
      }),
    );

    this.selectedCharacterDetails$ = this.selectedCharacter$.pipe(
      switchMap((character) => {
        if (character) {
          return this.starWarsService.getCharacterDetails(character);
        } else {
          return of(undefined);
        }
      }),
    );
  }

  protected selectEpisode(episode: Episode) {
    this.selectedCharacterSubject.next(undefined);
    this.selectedEpisodeSubject.next(episode);
  }

  protected selectCharacter(character: Character) {
    this.selectedCharacterSubject.next(character);
  }
}
