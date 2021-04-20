import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input("title") public title: string = "";
  @Input("segment") public segment: number;
  @Input("shouldShow") public shouldShow: boolean;

  constructor() { }

  ngOnInit() { }

}
