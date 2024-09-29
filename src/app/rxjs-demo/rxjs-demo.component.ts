import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Episode } from '../models/Episode';
import { StarWarsApiService } from '../services/star-wars-api.service';
import { Character } from '../models/Character';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rxjs-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rxjs-demo.component.html',
})
export class RxjsDemoComponent implements OnInit {
  protected episodes$: Observable<Episode[] | undefined> | undefined =
    undefined;
  protected selectedEpisode$: Observable<Episode | undefined> | undefined =
    undefined;

  private readonly selectedEpisodeRefreshSubject = new BehaviorSubject({});
  private readonly selectedEpisode: BehaviorSubject<Episode | undefined> =
    new BehaviorSubject<Episode | undefined>(undefined);

  protected characters$: Observable<Episode | undefined> = new Observable(
    undefined,
  );

  constructor(private readonly starWarsService: StarWarsApiService) {}

  public ngOnInit() {
    this.selectedEpisode$ = this.selectedEpisode.asObservable();

    this.episodes$ = this.selectedEpisodeRefreshSubject.pipe(
      switchMap((x) => this.starWarsService.getEpisodes()),
    );
  }

  protected selectEpisode(episode: Episode) {
    this.selectedEpisode.next(episode);
  }

  protected selectCharacter(character: Character) {}
}
