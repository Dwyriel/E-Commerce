import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppInfoService } from 'src/app/services/app-info.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input("title") public title: string = "";
  @Input("segment") public segment: number;
  public shouldShow: boolean = true;
  private subscription: Subscription;

  constructor() {
  }

  ngOnInit() {
    if (this.subscription && !this.subscription.closed)
      this.subscription.unsubscribe();
    this.subscription = AppInfoService.GetAppInfo().subscribe(info => {
      this.shouldShow = info.appWidth <= AppInfoService.maxMobileWidth;
    });
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed)
      this.subscription.unsubscribe();
  }

}