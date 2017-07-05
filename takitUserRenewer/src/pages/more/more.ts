import { Component } from '@angular/core';
import { NavController, NavParams,AlertController,App } from 'ionic-angular';

import {LoginPage} from '../login/login';
import {ErrorPage} from '../error/error';
import {MultiloginPage} from '../multilogin/multilogin';
import {FaqPage} from '../faq/faq';
import {TutorialPage} from '../tutorial/tutorial';

import {ServiceInfoPage} from '../serviceinfo/serviceinfo';
import {UserInfoPage} from '../userinfo/userinfo';

import {FbProvider} from '../../providers/LoginProvider/fb-provider';
import {EmailProvider} from '../../providers/LoginProvider/email-provider';
import {KakaoProvider} from '../../providers/LoginProvider/kakao-provider';
import {StorageProvider} from '../../providers/storageProvider';

import {TranslateService} from 'ng2-translate/ng2-translate';
import { NativeStorage } from '@ionic-native/native-storage';


declare var cordova:any;
/*
  Generated class for the More page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-more',
  templateUrl: 'more.html'
})
export class MorePage {
    public rootPage:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
                public storageProvider:StorageProvider,private nativeStorage: NativeStorage,
                public fbProvider:FbProvider, public kakaoProvider:KakaoProvider,
                public emailProvider:EmailProvider,public alertCtrl:AlertController,
                public app:App,public translateService: TranslateService,) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MorePage');
  }

  goHome(){
      this.navCtrl.parent.select(0);
  }

    openFaq(){
    console.log("openFaqPage...");
    this.app.getRootNav().push(FaqPage);
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

 openTutorial(){
    console.log("openTutorial");
    this.app.getRootNav().push(TutorialPage);
 }


  removeStoredInfo(){
        this.nativeStorage.clear(); 
        this.nativeStorage.remove("id"); //So far, clear() doesn't work. Please remove this line later
        this.nativeStorage.remove("refundBank");
        this.nativeStorage.remove("refundAccount");
        this.nativeStorage.remove("cashDetailAlert");
        this.storageProvider.reset();
        this.storageProvider.dropCartInfo().then(()=>{
            console.log("move into LoginPage"); //Please exit App and then restart it.
            if(this.storageProvider.login==true){
                console.log("call setRoot with LoginPage");
                this.app.getRootNav().push(LoginPage);

            }else{
                this.app.getRootNav().push(LoginPage);
            }
        },(error)=>{
            console.log("fail to dropCartInfo");
            if(this.storageProvider.login==true){
                console.log("call setRoot with LoginPage");
                this.app.getRootNav().push(LoginPage);
            }else{
                this.app.getRootNav().push(LoginPage);
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
                        this.translateService.get('NetworkProblem').subscribe(
                            NetworkProblem => {
                                     this.translateService.get('checkNetwork').subscribe(
                                        checkNetwork => {
                                            let alert = this.alertCtrl.create({
                                                title: NetworkProblem,
                                                subTitle: checkNetwork,//'네트웍상태를 확인해 주시기바랍니다',
                                                buttons: ['OK']
                                            });
                                            alert.present();
                                        });
                            });
                    }else{
                        this.translateService.get('LogoutFailed').subscribe(
                            NetworkProblem => {
                                     this.translateService.get('TryItAgainLater').subscribe(
                                        checkNetwork => {
                                            let alert = this.alertCtrl.create({
                                                title: NetworkProblem,
                                                subTitle: checkNetwork,//'네트웍상태를 확인해 주시기바랍니다',
                                                buttons: ['OK']
                                            });
                                            alert.present();
                                        });
                            });
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
                        this.translateService.get('NetworkProblem').subscribe(
                            NetworkProblem => {
                                     this.translateService.get('checkNetwork').subscribe(
                                        checkNetwork => {
                                            let alert = this.alertCtrl.create({
                                                title: NetworkProblem,
                                                subTitle: checkNetwork,//'네트웍상태를 확인해 주시기바랍니다',
                                                buttons: ['OK']
                                            });
                                            alert.present();
                                        });
                            });
                    }else{
                        this.translateService.get('LogoutFailed').subscribe(
                            NetworkProblem => {
                                     this.translateService.get('TryItAgainLater').subscribe(
                                        checkNetwork => {
                                            let alert = this.alertCtrl.create({
                                                title: NetworkProblem,
                                                subTitle: checkNetwork,//'네트웍상태를 확인해 주시기바랍니다',
                                                buttons: ['OK']
                                            });
                                            alert.present();
                                        });
                            });
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
                        this.translateService.get('NetworkProblem').subscribe(
                            NetworkProblem => {
                                     this.translateService.get('checkNetwork').subscribe(
                                        checkNetwork => {
                                            let alert = this.alertCtrl.create({
                                                title: NetworkProblem,
                                                subTitle: checkNetwork,//'네트웍상태를 확인해 주시기바랍니다',
                                                buttons: ['OK']
                                            });
                                            alert.present();
                                        });
                            });
                    }else{
                        this.translateService.get('LogoutFailed').subscribe(
                            NetworkProblem => {
                                     this.translateService.get('TryItAgainLater').subscribe(
                                        checkNetwork => {
                                            let alert = this.alertCtrl.create({
                                                title: NetworkProblem,
                                                subTitle: checkNetwork,//'네트웍상태를 확인해 주시기바랍니다',
                                                buttons: ['OK']
                                            });
                                            alert.present();
                                        });
                            });
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
