import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { StarWarsApiService } from '../services/star-wars-api.service';
import { firstValueFrom } from 'rxjs';
import { Episode } from '../models/Episode';
import { CommonModule } from '@angular/common';
import { Character } from '../models/Character';

@Component({
  selector: 'app-states-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './states-demo.component.html',
})
export class StatesDemoComponent implements OnInit {
  private readonly starWarsService = inject(StarWarsApiService);

  protected episodes: Episode[] = [];
  private readonly selectedEpisode = signal<Episode | undefined>(undefined);
  private readonly selectedCharacter = signal<Character | undefined>(undefined);

  protected selectedEpisodeCharacters = computed(async () => {
    const episode = this.selectedEpisode();

    if (episode) {
      const characters$ = this.starWarsService.getCharactersByEpisode(episode);
      return await firstValueFrom(characters$);
    } else {
      return [];
    }
  });

  protected selectedCharacterDetails = computed(async () => {
    const character = this.selectedCharacter();

    if (character) {
      const characterDetails$ =
        this.starWarsService.getCharacterDetails(character);
      return await firstValueFrom(characterDetails$);
    } else {
      return undefined;
    }
  });

  public async ngOnInit() {
    const episodes$ = this.starWarsService.getEpisodes();
    this.episodes = await firstValueFrom(episodes$);
  }

  protected selectEpisode(episode: Episode) {
    this.selectedCharacter.set(undefined);
    this.selectedEpisode.set(episode);
  }

  protected selectCharacter(character: Character) {
    this.selectedCharacter.set(character);
  }
}
