import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
                public storageProvider:StorageProvider) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopAboutPage');
  }

}
