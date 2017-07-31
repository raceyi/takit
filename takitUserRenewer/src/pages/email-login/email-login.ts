import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,LoadingController} from 'ionic-angular';
import { PasswordPage } from '../password/password';
import {SignupPage } from '../signup/signup';
import {StorageProvider} from '../../providers/storageProvider';
import {EmailProvider} from '../../providers/LoginProvider/email-provider';
import { NativeStorage } from '@ionic-native/native-storage';
import {TabsPage} from '../tabs/tabs';
import {MultiloginPage} from '../multilogin/multilogin';
import {SignupPaymentPage} from '../signup-payment/signup-payment';

/**
 * Generated class for the EmailLoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-email-login',
  templateUrl: 'email-login.html',
})
export class EmailLoginPage {
  email:string="";
  password:string="";

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController,private emailProvider:EmailProvider,
              private storageProvider:StorageProvider,private nativeStorage: NativeStorage,
              public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmailLoginPage');
  }

  back(){
    this.navCtrl.pop();
  }

  emailReset(event){
    this.navCtrl.push(PasswordPage);
  }

  emailLogin($event){
      console.log('emailLogin comes email:'+this.email+" password:"+this.password);    
      if(this.email.trim().length==0){
              let alert = this.alertCtrl.create({
                        title: '이메일을 입력해주시기 바랍니다.',
                        buttons: ['OK']
                    });
                    alert.present();
          return;
      }
      if(this.password.trim().length==0){
                let alert = this.alertCtrl.create({
                        title: '비밀번호를 입력해주시기 바랍니다.',
                        buttons: ['OK']
                    });
                    alert.present();
            return;
      }

       let loading = this.loadingCtrl.create({
            content: '로그인 중입니다.'
        });
      loading.present();
        setTimeout(() => {
            loading.dismiss();
        }, 5000);

      this.emailProvider.EmailServerLogin(this.email,this.password).then((res:any)=>{
                                loading.dismiss();
                                console.log("emailLogin-login page:"+JSON.stringify(res));
                                if(parseFloat(res.version)>parseFloat(this.storageProvider.version)){
                                        let alert = this.alertCtrl.create({
                                                        title: '앱버전을 업데이트해주시기 바랍니다.',
                                                        subTitle: '현재버전에서는 일부 기능이 정상동작하지 않을수 있습니다.',
                                                        buttons: ['OK']
                                                    });
                                            alert.present();
                                }
                                if(res.result=="success"){
                                    this.storageProvider.emailLogin=true;
                                    var encrypted:string=this.storageProvider.encryptValue('id',this.email);
                                    this.nativeStorage.setItem('id',encodeURI(encrypted));
                                    encrypted=this.storageProvider.encryptValue('password',this.password);
                                    this.nativeStorage.setItem('password',encodeURI(encrypted));

                                    console.log("email-shoplist:"+res.userInfo.shopList);
                                    if(res.userInfo.hasOwnProperty("shopList")){
                                        this.storageProvider.shoplistSet(JSON.parse(res.userInfo.shopList));
                                    }
                                    this.storageProvider.emailLogin=true;
                                    this.storageProvider.userInfoSetFromServer(res.userInfo);
                                    if(!res.userInfo.hasOwnProperty("cashId") || res.userInfo.cashId==null || res.userInfo.cashId==undefined){
                                        console.log("move into signupPaymentPage");
                                        this.navCtrl.setRoot(SignupPaymentPage);
                                    }else{
                                        console.log("move into TabsPage");
                                        this.navCtrl.setRoot(TabsPage);
                                    }
                                }else if(res.result=='failure'&& res.error=='multiLogin'){
                                        // How to show user a message here? move into error page?
                                        // Is it possible to show alert here?
                                    this.navCtrl.setRoot(MultiloginPage,{id:this.email});
                                }else{
                                    let alert = this.alertCtrl.create({
                                                title: '회원 정보가 일치하지 않습니다.',
                                                buttons: ['OK']
                                            });
                                            alert.present().then(()=>{
                                              console.log("alert is done");
                                            });
                                }
                            },login_err =>{
                                loading.dismiss();
                                console.log(JSON.stringify(login_err));
                                let alert = this.alertCtrl.create({
                                        title: '로그인 에러가 발생했습니다',
                                        subTitle: '네트웍 상태를 확인하신후 다시 시도해 주시기 바랍니다.',
                                        buttons: ['OK']
                                    });
                                    alert.present();
                    }); 
  }

  signup(){
    this.navCtrl.push(SignupPage, { login:"email"});
  }
}
