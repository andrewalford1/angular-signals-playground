import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Episode } from '../models/Episode';
import { Character } from '../models/Character';
import { CharacterDetails } from '../models/CharacterDetails';

@Injectable({
  providedIn: 'root',
})
export class StarWarsApiService {
  constructor(private readonly httpClient: HttpClient) {}

  public getEpisodes(): Observable<Episode[]> {
    return this.httpClient.get<any>('https://swapi.dev/api/films/').pipe(
      map((x) => {
        const films = x.results as any[];
        return films.map(
          (value, index) =>
            <Episode>{
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

  public getCharactersByEpisode(episode: Episode): Observable<Character[]> {
    return this.getCharacterUrlsByEpisode(episode).pipe(
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

  private getCharacterUrlsByEpisode(episode: Episode): Observable<string[]> {
    return this.httpClient.get<any>('https://swapi.dev/api/films/').pipe(
      map((x) => {
        const episodes = x.results as any[];
        return episodes[episode.id];
      }),
      map((x) => x.characters),
    );
  }
}
