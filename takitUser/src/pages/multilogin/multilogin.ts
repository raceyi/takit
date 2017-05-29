import { Component } from '@angular/core';
import { NavController, NavParams ,App,Platform} from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
import {TabsPage} from '../tabs/tabs';
import {LoginPage} from  '../login/login';
import { SplashScreen } from '@ionic-native/splash-screen';
//import {Storage} from "@ionic/storage";
import { NativeStorage } from '@ionic-native/native-storage';

import {Device} from 'ionic-native';

/*
  Generated class for the Multilogin page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-multilogin',
  templateUrl: 'multilogin.html'
})
export class MultiloginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public storageProvider:StorageProvider,private serverProvider:ServerProvider,
  private app:App,private platform:Platform,private nativeStorage: NativeStorage, private splashScreen: SplashScreen) {
    this.navParams.get("id");
    this.navParams.get("password");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MultiloginPage');
    this.splashScreen.hide();
  }

  login(){
        let body = JSON.stringify({uuid:Device.uuid});
        this.serverProvider.post(this.storageProvider.serverAddress+"/preventMultiLogin",body).then((res:any)=>{
            console.log("res:"+JSON.stringify(res));
            if(res.result=="success"){
              // move into TabPage
              if(res.userInfo.hasOwnProperty("shopList")){
                  this.storageProvider.shoplistSet(JSON.parse(res.userInfo.shopList));
              }
              //save this.storageProvider.id
              this.storageProvider.userInfoSetFromServer(res.userInfo);
              //save id information into storage
              let id=this.navParams.get("id");
              if(id!=undefined){
                    var encrypted:string=this.storageProvider.encryptValue('id',id);
                    this.nativeStorage.setItem('id',encodeURI(encrypted));
                    this.storageProvider.id=id;
              }else{
                //read id info and then save it into storageProvider
                this.nativeStorage.getItem("id").then((value:string)=>{
                  this.storageProvider.id=this.storageProvider.decryptValue("id",decodeURI(value));
                });
              }
              console.log("move into TbasPage");
              this.app.getRootNav().setRoot(TabsPage);
            }else{
                 console.log("move into LoginPage");
                  // move into loginPage
                  this.storageProvider.reset();
                  this.app.getRootNav().setRoot(LoginPage);
            }
        });
  }

  exit(){
      //move into ErrorPage
  }
}
