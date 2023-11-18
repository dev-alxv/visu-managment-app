import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ff-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.scss']
})
export class SideComponent implements OnInit {

  public appVersion: string;
  public currentYear: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
    this.appVersion = environment.appVersion;
  }

}
