import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AddresService } from 'src/app/services/addres.service';
import { RatingService } from 'src/app/services/rating.service';
import { User } from 'src/app/structure/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  @Input('user') public user: User = new User();
  public telephone: string;
  public loading: boolean = true;

  private subscription1: Subscription;
  private subscription2: Subscription;

  constructor(private AddressService: AddresService, private ratingService: RatingService) { }

  ngOnInit() { }

  async ionViewWillEnter() {
    this.telephone = this.GetUITel(this.user.tel);
    if (this.user.addressId)
      this.subscription1 = (await this.AddressService.Get(this.user.addressId)).subscribe(ans => {
        this.user.address = ans;
        this.loading = false;
      }, err => { this.loading = false; });
    else
      this.loading = false;
    this.subscription2 = (await this.ratingService.GetAllFromUser(this.user.id)).subscribe(ans => {
      this.user.ratings = ans;
      this.user.calculateAvgRating();
    });
  }

  ionViewWillLeave() {
    this.loading = true;
    this.user = new User();
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
  }

  GetUITel(tel: string) {
    var ddd = tel.substring(0, 2);
    var number = tel.substring(2);
    var length: number = number.length;
    var part1, part2
    if (length === 9) {
      part1 = number.substring(0, 5);
      part2 = number.substring(5,);
    }
    if (length === 8) {
      part1 = number.substring(0, 4);
      part2 = number.substring(4,);
    }
    return `(${ddd}) ${part1}-${part2}`
  }
}
