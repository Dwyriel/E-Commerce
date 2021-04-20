import { Component, Input, OnInit } from '@angular/core';
import { AppInfoService } from 'src/app/services/app-info.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input("title") public title: string = "";
  @Input("segment") public segment: number;
  public shouldShow: boolean = (AppInfoService.isMobile) ? true : false;

  constructor() { }

  ngOnInit() { }

}