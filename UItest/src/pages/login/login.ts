import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EmailLoginPage } from '../email-login/email-login';
import {SignupPage } from '../signup/signup';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  facebookLogin(){
    console.log('facebookLigin');  
    this.navCtrl.push(SignupPage,{email:false});
  }

  kakaoLogin(){
    console.log('kakaoLigin');  
    this.navCtrl.push(SignupPage,{email:false});
  }

  moveToEmailLogin(){
    console.log("EmailLoginPage");
    this.navCtrl.push(EmailLoginPage);
  }

}
