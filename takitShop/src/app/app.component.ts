import { Component } from '@angular/core';
import { Platform,App,AlertController } from 'ionic-angular';

import {PrinterProvider} from '../providers/printerProvider';
import {StorageProvider} from '../providers/storageProvider';
import {FbProvider} from '../providers/LoginProvider/fb-provider';
import {KakaoProvider} from '../providers/LoginProvider/kakao-provider';
import {EmailProvider} from '../providers/LoginProvider/email-provider';
import {LoginPage} from '../pages/login/login';
import {ErrorPage} from '../pages/error/error';
import {ShopTablePage} from '../pages/shoptable/shoptable';
import{SelectorPage} from '../pages/selector/selector';
import{PrinterPage} from '../pages/printer/printer';
import {ServiceInfoPage} from '../pages/serviceinfo/serviceinfo';
import {CashPage} from '../pages/cash/cash';
import {UserInfoPage} from '../pages/userinfo/userinfo';
import {SalesPage} from '../pages/sales-page/sales-page';
import { EditMenuPage } from '../pages/edit-menu-page/edit-menu-page';



import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import {MediaProvider} from '../providers/mediaProvider';

declare var cordova:any;

@Component({
  selector:'page-menu',
  templateUrl: 'app.html'
})
export class MyApp {
   public rootPage:any;
   private disconnectSubscription;
  // private connectSubscription;

   constructor(private platform:Platform,public app:App,
                private fbProvider:FbProvider,private emailProvider:EmailProvider,
                private kakaoProvider:KakaoProvider,public storageProvider:StorageProvider,
                public storage:Storage,public printerProvider:PrinterProvider,
                public alertCtrl:AlertController,private network: Network, 
                private statusBar: StatusBar,private splashScreen:SplashScreen,
                private mediaProvider:MediaProvider) {
    
    this.platform=platform;
    ////////////Test-begin//////////
    if(!this.platform.is('cordova')){
        console.log("platform is not cordova");
        this.rootPage=ShopTablePage;
    }
    ////////////Test-end///////////
    
    platform.ready().then(() => {
            console.log("platform ready comes");
            //this.storageProvider.open(); So far, DB is not necessary.

            this.disconnectSubscription = this.network.onDisconnect().subscribe(() => { // Why it doesn't work?
                console.log('network was disconnected :-(');
                //this.storageProvider.errorReasonSet('네트웍 연결이 원할하지 않습니다'); 
                //Please check current page and then move into ErrorPage!
                console.log("rootPage:"+JSON.stringify(this.rootPage));
                if(this.rootPage==undefined){
                    console.log("move into ErrorPage");
                    this.rootPage=ErrorPage;
                    return;
                }   
            });
            this.mediaProvider.init();
            //Please login if login info exists or move into login page
            this.storage.get("id").then((value:string)=>{
                console.log("value:"+value);
                if(value==null){
                  console.log("id doesn't exist");
                  this.rootPage=LoginPage;
                  return;
                }
                console.log("decodeURI(value):"+decodeURI(value));
                var id=this.storageProvider.decryptValue("id",decodeURI(value));
                if(id=="facebook"){
                    this.fbProvider.login().then((res:any)=>{
                                console.log("...MyApp:"+JSON.stringify(res));
                                console.log("res.shopUserInfo:"+JSON.stringify(res.shopUserInfo));
                                if(res.result=="success"){
                                    //save shoplist
                                    this.shoplistHandler(res.shopUserInfo);
                                }else if(res.result=='invalidId'){
                                    console.log("사용자 정보에 문제가 발생했습니다. 로그인 페이지로 이동합니다.");
                                    this.rootPage=LoginPage; 
                                }else{
                                    console.log("invalid result comes from server-"+JSON.stringify(res));
                                    //this.storageProvider.errorReasonSet('로그인 에러가 발생했습니다');
                                    this.rootPage=ErrorPage;   
                                }
                            },login_err =>{
                                console.log(JSON.stringify(login_err));
                                //this.storageProvider.errorReasonSet('로그인 에러가 발생했습니다'); 
                                this.rootPage=ErrorPage;
                    });
                }else if(id=="kakao"){ //kakao login
                        console.log("kakao login is not implemented yet");
                        this.kakaoProvider.login().then((res:any)=>{
                                console.log("MyApp:"+JSON.stringify(res));
                                if(res.result=="success"){
                                    //save shoplist
                                    this.shoplistHandler(res.shopUserInfo);
                                }else if(res.result=='invalidId'){
                                    console.log("사용자 정보에 문제가 발생했습니다. 로그인 페이지로 이동합니다.");
                                    this.rootPage=LoginPage; 
                                }else{
                                    console.log("invalid result comes from server-"+JSON.stringify(res));
                                    //this.storageProvider.errorReasonSet('로그인 에러가 발생했습니다');
                                    this.rootPage=ErrorPage;   
                                }
                            },login_err =>{
                                //console.log(JSON.stringify(login_err));
                                //this.storageProvider.errorReasonSet('로그인 에러가 발생했습니다'); 
                                this.rootPage=ErrorPage;
                    });
                }else{ // email login 
                    this.storage.get("password").then((value:string)=>{
                        var password=this.storageProvider.decryptValue("password",decodeURI(value));
                        this.emailProvider.EmailServerLogin(id,password).then((res:any)=>{
                                console.log("MyApp:"+JSON.stringify(res));
                                if(res.result=="success"){
                                    //save shoplist
                                    this.shoplistHandler(res.shopUserInfo);
                                }else if(res.result=='invalidId'){
                                    //console.log("You have no right to access this app");
                                    console.log("사용자 정보에 문제가 발생했습니다. 로그인 페이지로 이동합니다.");
                                    this.rootPage=LoginPage; 
                                }else{
                                    //console.log("invalid result comes from server-"+JSON.stringify(res));
                                    //this.storageProvider.errorReasonSet('로그인 에러가 발생했습니다'); 
                                    this.rootPage=ErrorPage;   
                                }
                            },login_err =>{
                                //console.log(JSON.stringify(login_err));
                                //this.storageProvider.errorReasonSet('로그인 에러가 발생했습니다'); 
                                this.rootPage=ErrorPage;
                        });
                    });
                }
            },err=>{
                console.log("id doesn't exist. move into LoginPage");
                this.rootPage=LoginPage;
            });
        //this.connectSubscription = Network.onConnect().subscribe(() => { 
        //    console.log('network connected!');
        //});

        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        this.statusBar.styleDefault();
    });
  }

    shoplistHandler(userinfo:any){
        console.log("myshoplist:"+userinfo.myShopList);
        if(!userinfo.hasOwnProperty("myShopList")|| userinfo.myShopList==null){
            //this.storageProvider.errorReasonSet('등록된 상점이 없습니다.');
            this.rootPage=ErrorPage;
        }else{
             this.storageProvider.myshoplist=JSON.parse(userinfo.myShopList);
             this.storageProvider.userInfoSetFromServer(userinfo);
             if(this.storageProvider.myshoplist.length==1){
                console.log("move into ShopTablePage");
                this.storageProvider.myshop=this.storageProvider.myshoplist[0];
                this.rootPage=ShopTablePage;
             }else{ 
                console.log("multiple shops");
                this.rootPage=SelectorPage;
             }
        }
        this.storage.get("printer").then((value:string)=>{
            this.storageProvider.printerName=value;
            this.printerProvider.setPrinter(value);
            this.storage.get("printOn").then((value:string)=>{
                console.log("printOn:"+value);
                this.storageProvider.printOn= JSON.parse(value);
            },()=>{
                this.storageProvider.printOn=false;
            });
        },()=>{
            this.storageProvider.printOn=false;
        });
  }

   openPrint(){
        this.app.getRootNav().push(PrinterPage);
   }

   openServiceInfo(){
        this.app.getRootNav().push(ServiceInfoPage);
   }

   openCash(){
        this.app.getRootNav().push(CashPage);
   }

    openUserInfo(){
        this.app.getRootNav().push(UserInfoPage);
    }

    openSales(){
        this.app.getRootNav().push(SalesPage);
    }

    openEditMenu(){
        this.app.getRootNav().push(EditMenuPage)
    }
   openLogout(){
      let confirm = this.alertCtrl.create({
      title: '로그아웃하시겠습니까?',
      buttons: [
        {
          text: '아니오',
          handler: () => {
            console.log('Disagree clicked');
            return;
          }
        },
        {
          text: '네',
          handler: () => {
            console.log('Logout Agree clicked');
            console.log("cordova.plugins.backgroundMode.disable");
            cordova.plugins.backgroundMode.disable();
            
            //facebook logout, kakao logout
            if(this.storageProvider.id=="facebook"){
                this.fbProvider.logout().then((result)=>{
                    this.removeStoredInfo();
                },(err)=>{
                    this.removeStoredInfo();
                });
            }else if(this.storageProvider.id=="kakao"){
                this.kakaoProvider.logout().then((res)=>{
                    this.removeStoredInfo();
                },(err)=>{
                    this.removeStoredInfo();
                });
            }else{
                this.emailProvider.logout().then(()=>{
                    this.removeStoredInfo();
                },(err)=>{
                    this.removeStoredInfo();
                });
            }   
          }
        }
      ]
    });
    confirm.present();
   }

   removeStoredInfo(){
        this.storage.clear(); 
        this.storage.remove("id"); //So far, clear() doesn't work. Please remove this line later
        this.storage.remove("printer");
        this.storage.remove("printOn");
        this.storageProvider.reset();
        console.log("move into LoginPage"); //Please exit App and then restart it.
        if(this.storageProvider.login==true){
            console.log("call setRoot with LoginPage");
            this.storageProvider.navController.setRoot(LoginPage);
        }else{
            this.rootPage=LoginPage;
        }
  }
}

