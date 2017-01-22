import { Component } from '@angular/core';
import { Platform ,App,AlertController,NavController} from 'ionic-angular';
import { StatusBar,Network} from 'ionic-native';

import {TabsPage} from '../pages/tabs/tabs';

import {LoginPage} from '../pages/login/login';
import {ErrorPage} from '../pages/error/error';
import {MultiloginPage} from '../pages/multilogin/multilogin';

import {ServiceInfoPage} from '../pages/serviceinfo/serviceinfo';
import {UserInfoPage} from '../pages/userinfo/userinfo';

import {FbProvider} from '../providers/LoginProvider/fb-provider';
import {EmailProvider} from '../providers/LoginProvider/email-provider';
import {KakaoProvider} from '../providers/LoginProvider/kakao-provider';
import {StorageProvider} from '../providers/storageProvider';
import {Storage} from '@ionic/storage';
declare var cordova:any;

@Component({
  selector:'page-menu',
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage:any;
  disconnectSubscription;

  constructor(platform: Platform,public storageProvider:StorageProvider,
                public storage:Storage,public app:App,
                public fbProvider:FbProvider, public kakaoProvider:KakaoProvider,
                public emailProvider:EmailProvider,public alertCtrl:AlertController) {
    console.log("platform ready comes");

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
        StatusBar.styleDefault();

        console.log("platform ready comes");
        if(Network.connection=="none"){
            //this.storageProvider.errorReasonSet('네트웍 연결이 원할하지 않습니다'); 
            //Please check current page and then move into ErrorPage!
            //console.log("rootPage:"+JSON.stringify(this.rootPage));
            if(!this.rootPage==undefined){
                this.storage.get("id").then((value:string)=>{
                    console.log("value:"+value);
                    if(value==null){
                        this.rootPage=LoginPage;
                    }else{    
                        this.rootPage=ErrorPage;
                    }
                },(err)=>{
                    this.rootPage=LoginPage;
                });
            }else{
                console.log("show alert");
            }       
        }else{
            console.log('network connected!');
        }

            this.disconnectSubscription = Network.onDisconnect().subscribe(() => { 
                console.log('network was disconnected :-( ');
                console.log("rootPage:"+JSON.stringify(this.rootPage));
                if(this.rootPage==undefined){
                    this.storage.get("id").then((value:string)=>{
                        console.log("value:"+value);
                        if(value==null){
                            this.rootPage=LoginPage;
                        }else{    
                            console.log("move into ErrorPage");
                            this.rootPage=ErrorPage;
                        }
                    },(err)=>{
                        this.rootPage=LoginPage;
                    });
                }       
            });

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
                                console.log("MyApp:"+JSON.stringify(res));
                                if(res.result=="success"){
                                    //save shoplist
                                    console.log("res.email:"+res.email +"res.name:"+res.name);
                                    if(res.userInfo.hasOwnProperty("shopList")){
                                        this.storageProvider.shoplistSet(JSON.parse(res.userInfo.shopList));
                                    }
                                    this.storageProvider.userInfoSetFromServer(res.userInfo);
                                    console.log("shoplist...:"+JSON.stringify(this.storageProvider.shoplist));
                                    this.rootPage=TabsPage;
                                }else if(res.result=='failure'&& res.error=='invalidId'){
                                    console.log("사용자 정보에 문제가 발생했습니다. 로그인 페이지로 이동합니다.");
                                    this.rootPage=LoginPage;   
                                }else if(res.result=='failure'&& res.error=='multiLogin'){
                                        // How to show user a message here? move into error page?
                                        // Is it possible to show alert here?
                                    this.rootPage=MultiloginPage;
                                }else{
                                    console.log("invalid result comes from server-"+JSON.stringify(res));
                                    //this.storageProvider.errorReasonSet('로그인 에러가 발생했습니다');
                                    this.rootPage=ErrorPage;   
                                }
                            },login_err =>{
                                console.log("move into ErrorPage-"+JSON.stringify(login_err));
                                //this.storageProvider.errorReasonSet('로그인 에러가 발생했습니다'); 
                                this.rootPage=ErrorPage;
                    });
                }else if(id=="kakao"){ //kakao login
                        //console.log("kakao login is not implemented yet");
                        // read kakao id and try server login
                        this.kakaoProvider.login().then((res:any)=>{
                                console.log("MyApp:"+JSON.stringify(res));
                                if(res.result=="success"){
                                    //save shoplist
                                    if(res.userInfo.hasOwnProperty("shopList")){
                                        this.storageProvider.shoplistSet(JSON.parse(res.userInfo.shopList));
                                    }
                                    this.storageProvider.userInfoSetFromServer(res.userInfo);
                                    console.log("move into TabsPage");
                                    this.rootPage=TabsPage;
                                }else if(res.result=='failure' && res.result=='invalidId'){
                                    console.log("사용자 정보에 문제가 발생했습니다. 로그인 페이지로 이동합니다.");
                                    this.rootPage=LoginPage;
                                }else if(res.result=='failure'&& res.error=='multiLogin'){
                                        // How to show user a message here? move into error page?
                                        // Is it possible to show alert here?
                                    this.rootPage=MultiloginPage;
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
                }else{ // email login 
                        this.storage.get("password").then((value:string)=>{
                        var password=this.storageProvider.decryptValue("password",decodeURI(value));
                        this.emailProvider.EmailServerLogin(id,password).then((res:any)=>{
                                console.log("MyApp:"+JSON.stringify(res));
                                if(res.result=="success"){
                                    if(res.userInfo.hasOwnProperty("shopList")){
                                        //save shoplist
                                        this.storageProvider.shoplistSet(JSON.parse(res.userInfo.shopList));
                                    }
                                    this.storageProvider.userInfoSetFromServer(res.userInfo);
                                    this.rootPage=TabsPage;
                                }else if(res.result=='failure'&& res.error=='multiLogin'){
                                        // How to show user a message here? move into error page?
                                        // Is it possible to show alert here?
                                    this.rootPage=MultiloginPage;
                                }else{ 
                                    console.log("사용자 정보에 문제가 발생했습니다. 로그인 페이지로 이동합니다.");
                                    this.rootPage=LoginPage;
                                }
                            },login_err =>{
                                console.log(JSON.stringify(login_err));
                                //this.storageProvider.errorReasonSet('로그인 에러가 발생했습니다'); 
                                this.rootPage=ErrorPage;
                        });
                        },(error)=>{
                                console.log("사용자 정보에 문제가 발생했습니다. 로그인 페이지로 이동합니다.");
                                this.rootPage=LoginPage;
                        });
                }
            },(error)=>{
                console.log("id doesn't exist");
                this.rootPage=LoginPage;
            });
    });
  }
  
  openServiceInfo(){
    console.log("serviceInfo");
    this.app.getRootNav().push(ServiceInfoPage);
  }
     
 openUserInfo(){
    console.log("openUserInfo");
    //call push function 
     this.app.getRootNav().push(UserInfoPage);
  }

  removeStoredInfo(){
        this.storage.clear(); 
        this.storage.remove("id"); //So far, clear() doesn't work. Please remove this line later
        this.storage.remove("refundBank");
        this.storage.remove("refundAccount");
        this.storageProvider.reset();
        this.storageProvider.dropCartInfo().then(()=>{
            console.log("move into LoginPage"); //Please exit App and then restart it.
            if(this.storageProvider.login==true){
                console.log("call setRoot with LoginPage");
                this.storageProvider.navController.setRoot(LoginPage);
            }else{
                this.rootPage=LoginPage;
            }
        },(error)=>{
            console.log("fail to dropCartInfo");
            if(this.storageProvider.login==true){
                console.log("call setRoot with LoginPage");
                this.storageProvider.navController.setRoot(LoginPage);
            }else{
                this.rootPage=LoginPage;
            }
            //let alert = this.alertCtrl.create({
            //    title: '장바구니 정보 삭제에 실패했습니다.',
            //    buttons: ['OK']
            //});
            //alert.present().then(()=>{
            //});                     
        });  
  }

  openLogout(){
    console.log("logout");
    let confirm = this.alertCtrl.create({
      title: '로그아웃하시겠습니까?',
      message: '타킷 사용을 위해 로그인이 필요합니다. 장바구니 정보는 삭제되며 주문,캐쉬 입금 알림도 중지됩니다.',
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
            console.log('Agree clicked');
            //facebook logout, kakao logout
            if(this.storageProvider.id=="facebook"){
                this.fbProvider.logout().then((result)=>{
                    console.log("fbProvider.logout() result:"+JSON.stringify(result));
                    console.log("cordova.plugins.backgroundMode.disable");
                    cordova.plugins.backgroundMode.disable();
                    this.removeStoredInfo();
                },(err)=>{
                    console.log("facebook-logout failure");
                    console.log("logout err:"+err);
                    if(err=="NetworkFailure"){
                        let alert = this.alertCtrl.create({
                            title: '서버와 통신에 문제가 있습니다',
                            subTitle: '네트웍상태를 확인해 주시기바랍니다',
                            buttons: ['OK']
                        });
                        alert.present();
                    }else{
                        let alert = this.alertCtrl.create({
                            title: '로그아웃에 실패했습니다.',
                            subTitle: '잠시후 다시 실도해 주시기 바랍니다.',
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                    //cordova.plugins.backgroundMode.disable();
                    //this.removeStoredInfo();
                });
            }else if(this.storageProvider.id=="kakao"){
                console.log("call kakaoProvider.logout");
                this.kakaoProvider.logout().then((res)=>{
                    console.log("kakao logout success");
                    console.log("cordova.plugins.backgroundMode.disable");
                    cordova.plugins.backgroundMode.disable();
                    this.removeStoredInfo();
                },(err)=>{
                    console.log("kakao-logout failure");
                    console.log("logout err:"+err);
                    if(err=="NetworkFailure"){
                        let alert = this.alertCtrl.create({
                            title: '서버와 통신에 문제가 있습니다',
                            subTitle: '네트웍상태를 확인해 주시기바랍니다',
                            buttons: ['OK']
                        });
                        alert.present();
                    }else{
                        let alert = this.alertCtrl.create({
                            title: '로그아웃에 실패했습니다.',
                            subTitle: '잠시후 다시 실도해 주시기 바랍니다.',
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                    //cordova.plugins.backgroundMode.disable();
                    //this.removeStoredInfo();
                });
            }else{
                this.emailProvider.logout().then(()=>{
                    console.log("cordova.plugins.backgroundMode.disable");
                    cordova.plugins.backgroundMode.disable();
                    this.removeStoredInfo();
                },(err)=>{
                    console.log("logout err:"+err);
                    if(err=="NetworkFailure"){
                        let alert = this.alertCtrl.create({
                            title: '서버와 통신에 문제가 있습니다',
                            subTitle: '네트웍상태를 확인해 주시기바랍니다',
                            buttons: ['OK']
                        });
                        alert.present();
                    }else{
                        let alert = this.alertCtrl.create({
                            title: '로그아웃에 실패했습니다.',
                            subTitle: '잠시후 다시 실도해 주시기 바랍니다.',
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                    //cordova.plugins.backgroundMode.disable();
                    //this.removeStoredInfo();
                });
            }   
          }
        }
      ]
    });
    confirm.present();
  }

  openUnregister(){
    console.log("unregister");
     let confirm = this.alertCtrl.create({
      title: '회원탈퇴를 하시겠습니까?',
      message: '거래 내역을 제외한 모든 개인정보는 삭제됩니다.',
      buttons: [
        {
          text: '아니오',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '네',
          handler: () => {
            console.log('Agree clicked');
            //facebook logout, kakao logout
            if(this.storageProvider.id=="facebook"){
                this.fbProvider.unregister().then(()=>{
                    console.log("facebook unregister success");
                    this.removeStoredInfo();
                    console.log("cordova.plugins.backgroundMode.disable");
                    cordova.plugins.backgroundMode.disable();
                },(err)=>{
                    console.log("unregister failure");
                    //move into error page
                    confirm.dismiss();
                    let noti = this.alertCtrl.create({
                        title: '회원탈퇴에 실패했습니다.',
                        buttons: ['OK']
                    });
                    noti.present();
                });
            }else if(this.storageProvider.id=="kakao"){
                this.kakaoProvider.unregister().then(()=>{
                    console.log("facebook unregister success");
                    this.removeStoredInfo();
                    console.log("cordova.plugins.backgroundMode.disable");
                    cordova.plugins.backgroundMode.disable();
                },(err)=>{
                    console.log("unregister failure");
                    confirm.dismiss();
                    let noti = this.alertCtrl.create({
                        title: '회원탈퇴에 실패했습니다.',
                        buttons: ['OK']
                    });
                    noti.present();
                });
            }else{
                this.emailProvider.unregister().then(()=>{
                    console.log("unregister success");
                    this.removeStoredInfo();
                    console.log("cordova.plugins.backgroundMode.disable");
                    cordova.plugins.backgroundMode.disable();
                },(err)=>{
                    console.log("unregister failure");
                    confirm.dismiss();
                    let noti = this.alertCtrl.create({
                        title: '회원탈퇴에 실패했습니다.',
                        buttons: ['OK']
                    });
                    noti.present();
                });
            }   
          }
        }
      ]
    });
    confirm.present();
  }

}
