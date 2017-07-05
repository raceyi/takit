import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';

/*
  Generated class for the OldOrder page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-old-order',
  templateUrl: 'old-order.html'
})
export class OldOrderPage {

    oldOrders = [];
    array=new Array(4);
    takitId:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public storageProvider:StorageProvider, public serverProvider:ServerProvider) {
    this.takitId=navParams.get('takitId');
  }

//   ionViewDidLoad() {
//     console.log('ionViewDidLoad OldOrderPage');
//     //need to get sorting data
//   }

  ionViewDidEnter(){
    console.log('ionViewDidEnter OldOrderPage');
    this.serverProvider.getOldOrders().then((res:any)=>{
        this.oldOrders=res;
    },err=>{
        console.log("getOldOrders error:"+JSON.stringify(err));
    });
  }
  

}
