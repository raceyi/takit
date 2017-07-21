import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PasswordPage } from '../password/password';
import {SignupPage } from '../signup/signup';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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

  signup(){
    this.navCtrl.push(SignupPage, {email:true});
  }
}
