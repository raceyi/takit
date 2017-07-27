import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import { OldOrderPage } from '../old-order/old-order';
import { ShopCartPage } from '../shopcart/shopcart';

/*
  Generated class for the ShopAbout page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-shop-about',
  templateUrl: 'shop-about.html'
})
export class ShopAboutPage {

    businessTime;
    notice:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
                public storageProvider:StorageProvider) {

                    this.businessTime=JSON.parse(storageProvider.shopInfo.businessTime);
                    storageProvider.shopInfo.blogAddress="www.takit.biz";
                    this.notice = storageProvider.shopInfo.notice;
                    console.log("shopInfo!:"+JSON.stringify(storageProvider.shopInfo));
                }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopAboutPage');
  }

  enterOldOrder(){
      this.navCtrl.push(OldOrderPage,{takitId:"세종대@더큰도시락"});
  }

  enterShopCart(){
      this.navCtrl.push(ShopCartPage);
  }
}
