import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'cc-play-button',
  templateUrl: './play-button.component.html',
  styleUrls: ['./play-button.component.scss']
})
export class PlayButtonComponent implements OnInit {

  faPlay = faPlay;
  faStop = faStop;

  private _playing = false;

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
