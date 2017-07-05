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

    shef = [{"img":"UItest/shef1.png"}];
    keywords = ["맛난도시락","비건도시락","외국인","세종대","맛집"];
    businessTime;


  constructor(public navCtrl: NavController, public navParams: NavParams,
                public storageProvider:StorageProvider) {

                    this.businessTime=JSON.parse(storageProvider.shopInfo.businessTime);
                    this.keywords=storageProvider.shopInfo.keywords;
                    storageProvider.shopInfo.blogAddress="www.takit.biz";

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
