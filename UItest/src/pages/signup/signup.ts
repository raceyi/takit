import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SignupPaymentPage } from '../signup-payment/signup-payment';
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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log("param:"+navParams.get("email"));
    if(navParams.get("email")==true){
      this.emailLogin=true;
    }
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

  userAgreement(){
    console.log("userAgreement click");
    this.userAgreementShown=!(this.userAgreementShown);
    if(this.userAgreementShown){
      this.userInfoShown=false;
      this.pictureShown=false;
      this.locationShown=false;
    }
  }

  personalInfo(){
    console.log("personalInfo click");
    this.userInfoShown=!this.userInfoShown;
    if(this.userInfoShown){
      this.userAgreementShown=false;
      this.pictureShown=false;
      this.locationShown=false;      
    }
  }

  pictureShownClick(){
    this.pictureShown=!this.pictureShown;
    if(this.pictureShown){
        this.userAgreementShown=false;
        this.userInfoShown=false;
        this.locationShown=false;  
    }
  }

  locationShownClick(){
    this.locationShown=!this.locationShown;
    if(this.locationShown){
        this.userInfoShown=false;
        this.userAgreementShown=false;
        this.pictureShown=false;
    }
  }

  phoneAuth(){
    console.log("call phone Auth");
  }

  signup(){
     this.navCtrl.push(SignupPaymentPage);
  }
}
