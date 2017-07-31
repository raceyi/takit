import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {SignupPaymentPage } from '../signup-payment/signup-payment';
import {StorageProvider} from '../../providers/storageProvider';
import { InAppBrowser,InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { DeviceAccounts } from '@ionic-native/device-accounts';
import {ServerProvider} from '../../providers/serverProvider';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {FbProvider} from '../../providers/LoginProvider/fb-provider';
import {KakaoProvider} from '../../providers/LoginProvider/kakao-provider';
import {EmailProvider} from '../../providers/LoginProvider/email-provider';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../login/login';

declare var zxcvbn:any;
/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  emailLogin:boolean=false;
  authVerified:boolean=false;
  signupInputDone:boolean=false;
  paswordGuideHide:boolean=false;
  paswordGuide:string;
  passwordMatch:boolean=false;
  paswordMismatch:string;

  userAgreementShown:boolean=false;
  userInfoShown:boolean=false;
  locationShown:boolean=false;
  pictureShown:boolean=false;
  transactionAgreementShown:boolean=false;

  email:string="";
  loginMethod:string;
  refId:string;

  name:string;  // It comes from mobile auth.
  phone:string; // It comes from mobile auth.
  password:string; 
  passwordConfirm:string;

  browserRef;

  country:string="82"; // So far, only Korea is available.

  sex:string;
  birthYear:string;
  signupInProgress:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
        private nativeStorage: NativeStorage,
        private storageProvider:StorageProvider,private deviceAccounts: DeviceAccounts,
        private serverProvider:ServerProvider,private iab: InAppBrowser,
        public translateService: TranslateService,private alertCtrl: AlertController,
        private fbProvider:FbProvider,private emailProvider:EmailProvider,private kakaoProvider:KakaoProvider) {
    console.log("param-login:"+navParams.get("login")+"email:"+navParams.get("email"));

    if(navParams.get("login")=="email"){
      this.emailLogin=true;
    }else if(!navParams.get("email") && this.storageProvider.isAndroid){ // no email info given
            this.deviceAccounts.getEmail()
                .then(account => {
                    console.log("DeviceAccounts.getEmail():"+account);
                    this.email=account;
                }).catch(error => {console.error(error);});
    }

    if(navParams.get("login")=="facebook"){
        this.refId=navParams.get("id");
        if(navParams.get("email")){
          this.email=navParams.get("email");
        }
    }else if(navParams.get("login")=="kakao"){
        this.refId=navParams.get("id");
    }

    this.loginMethod=navParams.get('login');
    this.paswordGuide="영문대문자,영문소문자,특수문자,숫자 중 3개 이상선택, 8자리 이상으로 구성하세요.";
    this.paswordMismatch="비밀번호가 일치하지 않습니다.";

    this.passwordMatch=true;
    this.paswordGuideHide=false;  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  back(){
    this.navCtrl.pop();
  } 

  transactionAgreement(){
    console.log("transactionAgreement click");
    this.transactionAgreementShown=!(this.transactionAgreementShown);
    if(this.transactionAgreementShown){
      this.userInfoShown=false;
      this.pictureShown=false;
      this.locationShown=false;
      this.userAgreementShown=false;
    }
  }

  userAgreement(){
    console.log("userAgreement click");
    this.userAgreementShown=!(this.userAgreementShown);
    if(this.userAgreementShown){
      this.userInfoShown=false;
      this.pictureShown=false;
      this.locationShown=false;
      this.transactionAgreementShown=false;
    }
  }

  personalInfo(){
    console.log("personalInfo click");
    this.userInfoShown=!this.userInfoShown;
    if(this.userInfoShown){
      this.userAgreementShown=false;
      this.pictureShown=false;
      this.locationShown=false;   
      this.transactionAgreementShown=false;   
    }
  }

  pictureShownClick(){
    this.pictureShown=!this.pictureShown;
    if(this.pictureShown){
        this.userAgreementShown=false;
        this.userInfoShown=false;
        this.locationShown=false;  
        this.transactionAgreementShown=false;
    }
  }

  locationShownClick(){
    this.locationShown=!this.locationShown;
    if(this.locationShown){
        this.userInfoShown=false;
        this.userAgreementShown=false;
        this.pictureShown=false;
        this.transactionAgreementShown=false;
    }
  }

phoneAuth(){
  this.mobileAuth().then((res:any)=>{
      console.log("[phoneAuth]res:"+JSON.stringify(res));
      this.authVerified=true;
      this.phone=res.userPhone;
      this.sex=res.userSex;
      this.birthYear=res.userAge;
      this.name=res.userName;
      console.log("sex:"+this.sex+"birthYear:"+this.birthYear+"name:"+this.name+" phone:"+this.phone);
  },(err)=>{
      
  });  
}

  mobileAuth(){
      console.log("mobileAuth");
    return new Promise((resolve,reject)=>{
      // move into CertPage and then 
      if(this.storageProvider.isAndroid){
            this.browserRef=this.iab.create(this.storageProvider.certUrl,"_blank" ,'toolbar=no');
      }else{ // ios
            console.log("ios");
            this.browserRef=this.iab.create(this.storageProvider.certUrl,"_blank" ,'location=no,closebuttoncaption=종료');
      }
              this.browserRef.on("exit").subscribe((event)=>{
                  console.log("InAppBrowserEvent(exit):"+JSON.stringify(event)); 
                  this.browserRef.close();
              });
              this.browserRef.on("loadstart").subscribe((event:InAppBrowserEvent)=>{
                  console.log("InAppBrowserEvent(loadstart):"+String(event.url));
                  if(event.url.startsWith("https://takit.biz/oauthSuccess")){ // Just testing. Please add success and failure into server 
                        console.log("cert success");
                        var strs=event.url.split("userPhone=");    
                        if(strs.length>=2){
                            var nameStrs=strs[1].split("userName=");
                            if(nameStrs.length>=2){
                                var userPhone=nameStrs[0];
                                var userSexStrs=nameStrs[1].split("userSex=");
                                var userName=userSexStrs[0];
                                var userAgeStrs=userSexStrs[1].split("userAge=");
                                var userSex=userAgeStrs[0];
                                var userAge=userAgeStrs[1];
                                console.log("userPhone:"+userPhone+" userName:"+userName+" userSex:"+userSex+" userAge:"+userAge);
                                let body = JSON.stringify({userPhone:userPhone,userName:userName,userSex:userSex,userAge:userAge});
                                this.serverProvider.post(this.storageProvider.serverAddress+"/getUserInfo",body).then((res:any)=>{
                                    console.log("/getUserInfo res:"+JSON.stringify(res));
                                    if(res.result=="success"){
                                        // forward into cash id page
                                        resolve(res);
                                    }else{
                                        // change user info
                                        //    
                                        reject("invalidUserInfo");
                                    }
                                },(err)=>{
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
                                    }
                                    reject(err);
                                });
                            } 
                            ///////////////////////////////
                        }
                        this.browserRef.close();
                        return;
                  }else if(event.url.startsWith("https://takit.biz/oauthFailure")){
                        console.log("cert failure");
                        this.browserRef.close();
                         reject();
                        return;
                  }
              });
    });
  }

  validateEmail(email){   //http://www.w3resource.com/javascript/form/email-validation.php 
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){  
        return (true);  
      }  
      return (false);  
  }  

  passwordValidity(password){
      var number = /\d+/.test(password);
      var smEng = /[a-z]+/.test(password);
      var bigEng= /[A-Z]+/.test(password);
      var special = /[^\s\w]+/.test(password);
      var digits = /.{8,}/.test(password);
      var result = zxcvbn(password);

      if(result.guesses >1000000000){
        if(number && smEng && bigEng && digits){
          return true;
        }
        else if(number && smEng && special && digits){
          return true;
        }
        else if(smEng && bigEng && special && digits){
          return true;
        }
        else if(number && bigEng && special && digits){
          return true;
        }
        else{
          this.paswordGuide = "영문대문자,영문소문자,특수문자,숫자 중 3개 이상 선택, 8자리 이상으로 구성하세요";
          return false;
        }
      }
      else{
        this.paswordGuide ="비밀번호는 연속문자,숫자 및 영단어를 사용할 수 없습니다.";
        return false;
      }
  }

  signup(){
      if(this.signupInProgress)
          return;
          
      //check email
      if(!this.validateEmail(this.email)){
          let alert = this.alertCtrl.create({
                    title: '정상 이메일을 입력해주시기 바랍니다.',
                    buttons: ['OK']
                });
                alert.present();
          return;
      }
     //check password if necessary
     if(this.emailLogin){
        if(!this.passwordValidity(this.password)){
              this.paswordGuideHide=false;
              let alert = this.alertCtrl.create({
                        title: '비밀번호가 규칙에 맞지 않습니다.',
                        buttons: ['OK']
                    });
                    alert.present();
              return;
        }
        if(this.password!==this.passwordConfirm){
              let alert = this.alertCtrl.create({
                        title: '비밀번호가 일치하지 않습니다.',
                        buttons: ['OK']
                    });
                    alert.present();
              return;
        }
     } 

     if(!this.authVerified){
              let alert = this.alertCtrl.create({
                        title: '휴대폰 본인 인증을 수행해주시기 바랍니다.',
                        buttons: ['OK']
                    });
                    alert.present();
     }

     if(this.loginMethod=="facebook"){
                this.signupInProgress=true;
                this.fbProvider.facebookServerSignup(this.refId,this.name,this.email,this.country,this.phone,this.sex,this.birthYear,false,"","IncomeDeduction").then(
                (result:any)=>{
                    // move into home page.  
                    console.log("result..:"+JSON.stringify(result));
                    var serverCode:string=result.result;
                    if(parseFloat(result.version)>parseFloat(this.storageProvider.version)){
                            let alert = this.alertCtrl.create({
                                            title: '앱버전을 업데이트해주시기 바랍니다.',
                                            subTitle: '현재버전에서는 일부 기능이 정상동작하지 않을수 있습니다.',
                                            buttons: ['OK']
                                        });
                                alert.present();
                    }
                    if(serverCode=="success"){
                        var encrypted:string=this.storageProvider.encryptValue('id','facebook');// save facebook id 
                        this.nativeStorage.setItem('id',encodeURI(encrypted));
                        this.storageProvider.shoplist=[];
                        this.storageProvider.userInfoSet(this.email,this.name,this.phone,false,"","IncomeDeduction");
                        this.navCtrl.setRoot(SignupPaymentPage,{email:this.email,name:this.name,phone:this.phone});
                    }else  if(serverCode=="duplication"){ // result.result=="exist"
                        let alert = this.alertCtrl.create({
                            title: '이미존재하는 아이디입니다.',
                            buttons: ['OK']
                        });
                        alert.present();
                        this.navCtrl.setRoot(LoginPage);
                    }else{
                        this.signupInProgress=false;
                        console.log("unknown result:"+serverCode);
                    }
                },(error)=>{ 
                        this.signupInProgress=false;
                        let alert = this.alertCtrl.create({
                            title: '서버로부터의 응답이 없습니다. 네트웍상태를 확인해주시기 바랍니다.',
                            buttons: ['OK']
                        });
                        alert.present();
                });
     }else if(this.loginMethod=="kakao"){
              this.signupInProgress=true;
              this.kakaoProvider.kakaoServerSignup(this.refId,this.country,this.phone,this.sex,this.birthYear,this.email,this.name,false,"","IncomeDeduction").then(
                (result:any)=>{
                    var serverCode:string=result.result;
                    if(parseFloat(result.version)>parseFloat(this.storageProvider.version)){
                            let alert = this.alertCtrl.create({
                                            title: '앱버전을 업데이트해주시기 바랍니다.',
                                            subTitle: '현재버전에서는 일부 기능이 정상동작하지 않을수 있습니다.',
                                            buttons: ['OK']
                                        });
                                alert.present();
                    }
                    if(serverCode=="success"){
                        var encrypted:string=this.storageProvider.encryptValue('id','kakao');// save kakao id 
                        this.nativeStorage.setItem('id',encodeURI(encrypted));
                        this.storageProvider.shoplist=[];
                        this.storageProvider.userInfoSet(this.email,this.name,this.phone,false,"","IncomeDeduction");
                        this.navCtrl.setRoot(SignupPaymentPage,{email:this.email,name:this.name,phone:this.phone});
                    }else if(serverCode=="duplication"){ // result.result=="exist"
                        let alert = this.alertCtrl.create({
                            title: '이미존재하는 아이디입니다.',
                            buttons: ['OK']
                        });
                        alert.present();
                        this.navCtrl.setRoot(LoginPage);
                    }else{ 
                        console.log("kakao server signup-unknown result:"+serverCode);
                        this.signupInProgress=false;
                    }
                },(error)=>{
                        this.signupInProgress=false;
                        let alert = this.alertCtrl.create({
                            title: '서버로부터의 응답이 없습니다. 네트웍상태를 확인해주시기 바랍니다.',
                            buttons: ['OK']
                        });
                        alert.present();
                });

     }else if(this.loginMethod=="email"){
            this.signupInProgress=true;
            this.emailProvider.emailServerSignup(this.password,this.name,this.email,this.country,this.phone,this.sex,this.birthYear,false,"","IncomeDeduction").then( 
            (result:any)=>{
                    if(parseFloat(result.version)>parseFloat(this.storageProvider.version)){
                            let alert = this.alertCtrl.create({
                                            title: '앱버전을 업데이트해주시기 바랍니다.',
                                            subTitle: '현재버전에서는 일부 기능이 정상동작하지 않을수 있습니다.',
                                            buttons: ['OK']
                                        });
                                alert.present();
                    }
                    // move into home page.  
                    var output:string=result.result;
                    if(output=="success"){
                        var encrypted:string=this.storageProvider.encryptValue('id',this.email);// save kakao id 
                        this.nativeStorage.setItem('id',encodeURI(encrypted));
                        encrypted=this.storageProvider.encryptValue('password',this.password);// save email id 
                        this.nativeStorage.setItem('password',encodeURI(encrypted));
                        this.storageProvider.shoplist=[];
                        this.storageProvider.emailLogin=true;
                        this.storageProvider.userInfoSet(this.email,this.name,this.phone,false,"","IncomeDeduction");
                        this.navCtrl.setRoot(SignupPaymentPage,{email:this.email,name:this.name,phone:this.phone,password:this.password});
                    }else if(output == "duplication"){ // result.result=="exist"
                        let alert = this.alertCtrl.create({
                            title: '이미존재하는 아이디입니다.',
                            buttons: ['OK']
                        });
                        alert.present();
                        this.navCtrl.setRoot(LoginPage);
                    }else{ //result.result=="exist"
                        console.log("unknown result:"+output);
                        this.signupInProgress=false;
                    }
                  },(error)=>{
                    this.signupInProgress=false;
                    let alert = this.alertCtrl.create({
                            title: '서버로부터의 응답이 없습니다. 네트웍상태를 확인해주시기 바랍니다.',
                            buttons: ['OK']
                        });
                        alert.present();
                });
     } 
  }
}
