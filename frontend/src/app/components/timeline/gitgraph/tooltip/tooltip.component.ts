import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { createPopper } from '@popperjs/core';
import { faEye, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'cc-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {

  @Input('active')
  active: boolean = false;

  _anchorElement: HTMLElement;
  @Input('anchorElement')
  set anchorElement(value) {
    this._anchorElement = value;
    this.initTooltip(this._anchorElement);
  }

  insideTooltip = false;

  @ViewChild('popover', {static: true})
  popover: ElementRef<HTMLElement>;

  @Output()
  mouseEnter = new EventEmitter<void>();

  @Output()
  mouseLeave = new EventEmitter<void>();

  private popper;
  faEye = faEye;
  faArrowRight = faArrowRight;

  constructor() { }

  ngOnInit() {
  }

 /**
  * Tooltips
  */
  private initTooltip(anchorElement) {
    if (anchorElement != null) {
      if (this.popper != null) {
        this.popper.destroy();
      }
      this.popper = createPopper(anchorElement, this.popover.nativeElement, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
        ],
      });
    } else {
      alert(`anchor null`);
    }
  }

  onTooltipMouseEnter() {
    this.insideTooltip = true;
    this.mouseEnter.emit();
  }

  onTooltipMouseLeave() {
    this.insideTooltip = false;
    this.mouseLeave.emit();
    this.active = false;
  }
}
