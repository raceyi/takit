import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OrderCompletePage } from '../order-complete/order-complete';
/*
  Generated class for the Order page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order',
  templateUrl: 'order.html'
})
export class OrderPage {
    couponDiscount:number=-300;
    takitDiscount:number=-100;
    totalDiscount:number=-400;
    totalPay:number=10000;
    deliveryMSG:string="농업생산성의 재고와 농지의 합리적인 이용을 위하거나 불가피한 사정으로 발생하는 농지의"
    userInfo={"balance":"100,000","receiptId":"000-000-000"}
    menu={"amount":"10,000"}

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

  orderComplete(){
      this.navCtrl.push(OrderCompletePage);
  }
}
