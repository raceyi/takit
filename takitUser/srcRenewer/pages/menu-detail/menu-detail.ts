import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storageProvider'
import { OrderPage } from '../order/order';

/**
 * Generated class for the MenuDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-menu-detail',
  templateUrl: 'menu-detail.html',
})
export class MenuDetailPage {
    menu:any;
    amount:number;
    options:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public storageProvider:StorageProvider) {
     console.log("param:"+JSON.stringify(navParams.get('menu')));
     this.menu=navParams.get('menu');
     this.amount=this.menu.price;
     this.options=JSON.parse(this.menu.options);
     this.menu.count = 1;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuDetailPage');
  }

  decreaseCount(menu){
    if(menu.count <= 1){
        menu.count=1;
    }else{
        menu.count--;
    }
    
  }

  increaseCount(menu){
    menu.count++;
  }

  enterOrder(){
      this.navCtrl.push(OrderPage);
  }

}
