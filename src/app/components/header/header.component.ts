import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppResources } from 'src/app/services/app-info.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input("title") public title: string = "";
  @Input("segment") public segment: number;
  public isMobile: boolean = true;
  private subscription: Subscription;

  constructor() {
  }

  ngOnInit() {
    if (this.subscription && !this.subscription.closed)
      this.subscription.unsubscribe();
    this.subscription = AppResources.GetAppInfo().subscribe(info => {
      this.isMobile = info.appWidth <= AppResources.maxMobileWidth;
    });
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed)
      this.subscription.unsubscribe();
  }

}