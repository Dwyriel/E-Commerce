import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppResources } from 'src/app/services/app-info.service';
import { User } from 'src/app/structure/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  public title: string = "Chat";
  public loggedUser: User = new User();
  public otherUser: User = new User();
  public isMobile: boolean;

  private loadingAlertID: string;
  private id: string;

  //Subscription
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;
  private subscription5: Subscription;
  private subscription6: Subscription;
  private subscription7: Subscription;

  constructor() { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.GetPlataformInfo();
  }

  ionViewWillLeave() {
    this.title = "Carregando";
    this.loggedUser = new User()
    this.otherUser = new User()
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    if (this.subscription4 && !this.subscription4.closed)
      this.subscription4.unsubscribe();
    if (this.subscription5 && !this.subscription5.closed)
      this.subscription5.unsubscribe();
    if (this.subscription6 && !this.subscription6.closed)
      this.subscription6.unsubscribe();
    if (this.subscription7 && !this.subscription7.closed)
      this.subscription7.unsubscribe();
  }

  GetPlataformInfo() {
    this.subscription1 = AppResources.GetAppInfo().subscribe(info => {
      this.isMobile = info.appWidth <= AppResources.maxMobileWidth;
      this.setDivWidth(((info.appWidth * .4 > (AppResources.maxMobileWidth / 1.5)) ? "40%" : (AppResources.maxMobileWidth / 1.5) + "px"));
    });
  }

  setDivWidth(value: string) {
    document.body.style.setProperty('--maxWidth', value);
  }
}
