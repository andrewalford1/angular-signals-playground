import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Film } from '../models/Film';
import { Character } from '../models/Character';
import { CharacterDetails } from '../models/CharacterDetails';

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

  public getCharacterDetails(
    character: Character,
  ): Observable<CharacterDetails> {
    return this.httpClient
      .get<any>(`https://swapi.dev/api/people/${character.id}`)
      .pipe(
        map((x) => {
          const id = parseInt(x.url.match(/\/people\/(\d+)\//)[1], 10);
          const imageUrl = `./assets/images/${id}_${(x.name as string).toLowerCase().replace(/\s+/g, '_')}.png`;
          //const imageUrl = `assets/images/4-lom.png`;
          return <CharacterDetails>{
            id,
            name: x.name,
            imageUrl,
            heightInches: x.height == 'unknown' ? x.height : `${x.height}"`,
            weightPounds: x.mass == 'unknown' ? x.mass : `${x.mass}lbs`,
            birthYear: x.birth_year,
            sex: x.gender,
          };
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
        characters
          .map(
            (character) =>
              <Character>{
                id: parseInt(character.url.match(/\/people\/(\d+)\//)[1], 10),
                name: character.name,
              },
          )
          .sort((a, b) => a.name.localeCompare(b.name)),
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
