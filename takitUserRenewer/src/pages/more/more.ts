import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App,AlertController } from 'ionic-angular';
import {UserInfoPage} from '../user-info/user-info';
import {PolicyPage} from '../policy/policy';
import {FaqPage} from '../faq/faq';
import { NativeStorage } from '@ionic-native/native-storage';
import {StorageProvider} from '../../providers/storageProvider';
import {LoginPage} from '../login/login';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {FbProvider} from '../../providers/LoginProvider/fb-provider';
import {EmailProvider} from '../../providers/LoginProvider/email-provider';
import {KakaoProvider} from '../../providers/LoginProvider/kakao-provider';
import { BackgroundMode } from '@ionic-native/background-mode';
import {SearchPage} from '../search/search';
import {TutorialPage} from '../tutorial/tutorial';

/**
 * Generated class for the MorePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage {
    phone:string;
    email:string;
    name:string;
    loginMethod:string;
    serviceInfoShow:boolean=false;
    serviceVersion:string;
    
  constructor(public navCtrl: NavController, public navParams: NavParams
            ,private app:App,private nativeStorage: NativeStorage
            , public translateService: TranslateService,private backgroundMode:BackgroundMode
            ,public fbProvider:FbProvider, public kakaoProvider:KakaoProvider
            ,public emailProvider:EmailProvider
            ,private alertCtrl: AlertController, public storageProvider:StorageProvider){
    /////////////////////
    this.phone=this.storageProvider.phone;
    this.email=this.storageProvider.email;
    this.name=this.storageProvider.name;
    //this.loginMethod=this.storageProvider.lo"이메일"; Please add password change
    this.serviceVersion=this.storageProvider.version;
    ////////////////////
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MorePage');
  }

  configureUserInfo(){
    console.log("configureUserInfo");
    this.app.getRootNav().push(UserInfoPage,{},{animate:true,animation: 'slide-up', direction: 'forward' });
  }

  serviceInfo(){
    console.log("serviceInfo");
    this.serviceInfoShow=!this.serviceInfoShow;
  }

  faq(){
    console.log("faq");
    this.app.getRootNav().push(FaqPage,{},{animate:true,animation: 'slide-up', direction: 'forward' });
  }

  tutorial(){
    console.log("tutorial");
    this.app.getRootNav().push(TutorialPage,{trigger:"more"},{animate:true,animation: 'slide-up', direction: 'forward' });
  }

  policyInfo(){
    console.log("policy");
    this.app.getRootNav().push(PolicyPage,{},{animate:true,animation: 'slide-up', direction: 'forward' });
  }

  goHome(){
      this.navCtrl.parent.select(0);
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

    if(this.storageProvider.tourMode){
            let alert = this.alertCtrl.create({
                title: '둘러보기 모드입니다.',
                buttons: ['OK']
            });
            alert.present()
            return;
    }

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
                    this.backgroundMode.disable();
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
                    this.backgroundMode.disable();
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
                    this.backgroundMode.disable();
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

    if(this.storageProvider.tourMode){
            let alert = this.alertCtrl.create({
                title: '둘러보기 모드입니다.',
                buttons: ['OK']
            });
            alert.present()
            return;
    }
          
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
                    this.backgroundMode.disable();
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
                    this.backgroundMode.disable();
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
                    this.backgroundMode.disable();
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

      search(){
        console.log("search click");
        this.app.getRootNav().push(SearchPage);
    }
}
