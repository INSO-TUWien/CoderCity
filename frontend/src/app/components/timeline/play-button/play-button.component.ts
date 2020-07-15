import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'cc-play-button',
  template: `
  <button class="btn btn-primary btn-sm btn-play" (click)="onCommitsClick()">
  <fa-icon *ngIf="!_playing" [icon]="faPlay" size="sm"></fa-icon>
  <fa-icon *ngIf="_playing" [icon]="faStop" size="sm"></fa-icon>
</button>`,
  styleUrls: ['./play-button.component.scss']
})
export class PlayButtonComponent implements OnInit {

  faPlay = faPlay;
  faStop = faStop;

  _playing = false;

  @Input()
  playing: boolean;

  @Output()
  isPlaying = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  onCommitsClick() {
    this._playing = !this._playing;
    this.isPlaying.emit(this.playing);
  }
}
