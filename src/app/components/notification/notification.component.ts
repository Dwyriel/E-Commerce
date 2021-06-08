import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppResources } from 'src/app/services/app-info.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AppNotification } from 'src/app/structure/notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {

  @Input('notifications') public notifications: AppNotification[];

  constructor(private router: Router, private notificationService: NotificationService) { }

  ngOnInit() { }

  MarkAllAsRead() {
    for (let notification of this.notifications) {
      this.notificationService.Delete(notification.id);
    }
    this.notifications = [];
  }

  MarkAsRead(id: string) {
    this.notificationService.Delete(id);
    var index = this.notifications.findIndex(item => item.id === id);
    this.notifications.splice(index, 1);
  }

  GoTo(url: string, id: string) {
    this.router.navigate([url]);
    AppResources.popovers.forEach(popover => {
      popover.dismiss();
    });
    //this.notificationService.Delete(id);
  }

}
