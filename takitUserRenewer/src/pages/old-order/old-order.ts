import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
import {MenuDetailPage} from '../menu-detail/menu-detail';

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
    console.log("OldOrderPage constructor 1");
    this.storageProvider.takitId=navParams.get('takitId');
    console.log("OldOrderPage constructor 2");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OldOrderPage');
    //need to get sorting data
  }

  ionViewWillEnter(){
      
    console.log('ionViewDidEnter OldOrderPage');
    this.serverProvider.getOldOrders().then((res:any)=>{
        if(res.result === "success" && Array.isArray(res.oldOrders)){
            console.log("getOldOrders success");
            this.oldOrders=res.oldOrders;
        }else{
            console.log(JSON.stringify(res));
        }
    },err=>{
        console.log("getOldOrders error:"+JSON.stringify(err));
    });
  }

  enterMenuDetail(order,shopName){
    let option={menuNO:order.menuNO,menuName:order.menuName};
    this.serverProvider.post(this.storageProvider.serverAddress+"/getMenu",JSON.stringify(option)).then((res:any)=>{
        if(res.result==="success"){

            this.navCtrl.push(MenuDetailPage,{menu:res.menu});
        }else if(res.result === "failure"){
            console.log("enterMenuDetail server failure:"+res.error);
        }
    }).catch(err=>{
        console.log(err);
    });
  }

   closePage(){
       this.navCtrl.pop({animate:true,animation: 'slide-up', direction:'back' });
   }
  

}
