import { Component, inject, signal, computed } from '@angular/core';
import { StarWarsApiService } from '../services/star-wars-api.service';
import { Episode } from '../models/Episode';
import { CommonModule } from '@angular/common';
import { Character } from '../models/Character';
import { CharacterDetails } from '../models/CharacterDetails';

@Component({
  selector: 'app-states-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './declarative-signals-demo.component.html',
})
export class DeclarativeSignalsDemoComponent {
  private readonly starWarsService = inject(StarWarsApiService);

  protected episodes = signal<Episode[]>([]);
  protected selectedEpisode = signal<Episode | undefined>(undefined);
  protected selectedEpisodeCharacters = signal<Character[]>([]);
  protected selectedCharacter = signal<Character | undefined>(undefined);
  protected selectedCharacterDetails = signal<CharacterDetails | undefined>(
    undefined,
  );

  constructor() {
    this.starWarsService.getEpisodes().subscribe((episodes) => {
      this.episodes.set(episodes);
    });
  }

  protected selectEpisode(episode: Episode) {
    this.resetState();
    this.selectedEpisode.set(episode);

    this.starWarsService
      .getCharactersByEpisode(episode)
      .subscribe((characters) => {
        this.selectedEpisodeCharacters.set(characters);
      });
  }

  protected selectCharacter(character: Character) {
    this.selectedCharacter.set(character);

    this.starWarsService.getCharacterDetails(character).subscribe((details) => {
      this.selectedCharacterDetails.set(details);
    });
  }

  private resetState() {
    this.selectedCharacter.set(undefined);
    this.selectedEpisodeCharacters.set([]);
    this.selectedCharacterDetails.set(undefined);
  }
}
