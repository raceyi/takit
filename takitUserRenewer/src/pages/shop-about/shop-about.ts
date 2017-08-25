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
    breakTime=[];
    lastOrderTime=[];
    availOrderTime=[];
    shopPhoneHref:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
                public storageProvider:StorageProvider) {

                    this.businessTime=JSON.parse(storageProvider.shopInfo.businessTime);
                    this.notice = storageProvider.shopInfo.notice;
                    console.log("shopInfo!:"+JSON.stringify(storageProvider.shopInfo));

                    //console.log("reviewList length:"+storageProvider.shopInfo.reviewList.length);
                    
                    if(storageProvider.shopInfo.breakTime){
                      this.breakTime = JSON.parse(this.storageProvider.shopInfo.breakTime);
                    }

                    if(storageProvider.shopInfo.availOrderTime){
                      this.availOrderTime = JSON.parse(this.storageProvider.shopInfo.availOrderTime);
                    }

                    this.shopPhoneHref="tel:"+storageProvider.shopInfo.shopPhone;

                }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopAboutPage');
  }

  enterOldOrder(){
      this.navCtrl.push(OldOrderPage,{takitId:"세종대@더큰도시락"});
  }

  enterCart(){
    this.navCtrl.push(ShopCartPage);
  }
}
