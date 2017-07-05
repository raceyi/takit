import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the OrderDone page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order-done',
  templateUrl: 'order-done.html'
})
export class OrderDonePage {
  title:string;
  message:string;
  orderNumber:number;
  orderContent:string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      console.log('OrderDonePage -constructor custom:'+ JSON.stringify(navParams.get('custom')));
      let order   =navParams.get('custom');
      this.title  =navParams.get('title');
      this.message=navParams.get('message');
      this.orderNumber=order.orderNO;
      this.orderContent=this.message;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDonePage');
  }

  dismiss(){
    this.navCtrl.pop();
  }
}
