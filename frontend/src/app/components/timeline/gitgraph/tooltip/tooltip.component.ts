import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { createPopper } from '@popperjs/core';

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
  mouseEntered = new EventEmitter<void>();

  @Output()
  mouseLeft = new EventEmitter<void>();

  private popper;

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
    this.mouseEntered.emit();
  }

  onTooltipMouseLeave() {
    this.insideTooltip = false;
    this.mouseLeft.emit();
    this.active = false;
  }
}
