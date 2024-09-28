import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Film } from '../models/Film';
import { Character } from '../models/Character';

@Injectable({
  providedIn: 'root',
})
export class StarWarsApiService {
  constructor(private readonly httpClient: HttpClient) {}

  public getPlanets(): Observable<object> {
    return this.httpClient.get('https://swapi.dev/api/planets/');
  }

  public getFilms(): Observable<Film[]> {
    return this.httpClient.get<any>('https://swapi.dev/api/films/').pipe(
      map((x) => {
        const films = x.results as any[];
        return films.map(
          (value, index) =>
            <Film>{
              id: index,
              title: value.title,
            },
        );
      }),
    );
  }

  public getCharactersByEpisodeId(episodeId: number): Observable<Character[]> {
    return this.getCharacterUrlsByEpisode(episodeId).pipe(
      switchMap((urls: string[]) => {
        const requests = urls.map((url) => this.httpClient.get<any>(url));
        return forkJoin(requests);
      }),
      map((characters) =>
        characters.map(
          (character, index) => <Character>{ id: index, name: character.name },
        ),
      ),
    );
  }

  private getCharacterUrlsByEpisode(episodeId: number): Observable<string[]> {
    return this.httpClient.get<any>('https://swapi.dev/api/films/').pipe(
      map((x) => {
        const films = x.results as any[];
        return films[episodeId];
      }),
      map((film) => film.characters),
    );
  }
}
