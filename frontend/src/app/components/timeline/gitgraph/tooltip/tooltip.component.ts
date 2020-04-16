import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { createPopper } from '@popperjs/core';
import { faEye, faEyeSlash, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Commit } from 'src/app/model/commit.model';

export enum TooltipMenuItem {
  Deselect = 'Deselect',
  View = 'View',
  Begin = 'Begin',
  End = 'End'
}

export enum TooltipState {
  Select = 'select',
  Deselect = 'deselect',
  SelectEnd = 'select_end',
  SelectBegin = 'select_begin'
}

export interface TooltipMenuItemSelected {
  action: TooltipMenuItem;
  commit: Commit;
}

@Component({
  selector: 'cc-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {

  TooltipState = TooltipState;
  TooltipMenuItem = TooltipMenuItem;

  @Input('active')
  active: boolean = false;

  _anchorElement: HTMLElement;
  @Input('anchorElement')
  set anchorElement(value) {
    this._anchorElement = value;
    this.initTooltip(this._anchorElement);
  }

  @Input()
  tooltipState: TooltipState = TooltipState.Select;

  @Input()
  commit: Commit;

  @Output()
  menuItemSelected = new EventEmitter<TooltipMenuItemSelected>();

  insideTooltip = false;

  @ViewChild('popover', {static: true})
  popover: ElementRef<HTMLElement>;

  @Output()
  mouseEnter = new EventEmitter<void>();

  @Output()
  mouseLeave = new EventEmitter<void>();

  private popper;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faArrowRight = faArrowRight;

  constructor() { }

  ngOnInit() {
  }

  onMenuItemClicked(event) {
    if (event === TooltipMenuItem.View) {
      this.menuItemSelected.emit(
        {
        action: TooltipMenuItem.View,
        commit: this.commit
      });
    } else if (event === TooltipMenuItem.Deselect) {
      this.menuItemSelected.emit(
        {
        action: TooltipMenuItem.Deselect,
        commit: this.commit
      });
    } else if (event === TooltipMenuItem.Begin) {
      this.menuItemSelected.emit(
        {
        action: TooltipMenuItem.Begin,
        commit: this.commit
      });
    } else if (event === TooltipMenuItem.End) {
      this.menuItemSelected.emit(
        {
        action: TooltipMenuItem.End,
        commit: this.commit
      });
    }
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
