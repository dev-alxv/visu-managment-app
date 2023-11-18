import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'scout24-container-spinner',
  templateUrl: './container-spinner.component.html',
  styleUrls: ['./container-spinner.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(150, style({ opacity: 1 }))
      ])
    ]),
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ContainerSpinnerComponent implements OnInit {

  public flexPosition = 'center center';

  @Input() public loading: boolean;
  @Input() public color = 'primary';
  @Input() public diameter = '100';
  @Input() public strokeWidth = '10';
  @Input() public message = null;
  @Input() public messageColor = null;
  @Input() public noAnimation = false;
  @Input() public transparentBackground = false;
  @Input() public backgroundColor = 'rgba(255, 255, 255, 0.8)';
  @Input() public borderRadius = '0';
  @Input() public positionTop = false;
  @Input() public positionRight = false;

  constructor() { }

  public ngOnInit() {
    if (this.positionTop) {
      this.flexPosition = 'start center'
    }

    if (this.positionRight) {
      this.flexPosition = 'center end'
    }
  }

}
