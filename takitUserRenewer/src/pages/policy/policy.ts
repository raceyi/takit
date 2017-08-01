import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PolicyPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-policy',
  templateUrl: 'policy.html',
})
export class PolicyPage {

  userAgreementShown:boolean=false;
  userInfoShown:boolean=false;
  locationShown:boolean=false;
  pictureShown:boolean=false;
  transactionAgreementShown:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PolicyPage');
  }

  back(){
    this.navCtrl.pop({animate:true,animation: 'slide-up', direction:'back' });  
  }

  transactionAgreement(){
  console.log("transactionAgreement click");
    this.transactionAgreementShown=!(this.transactionAgreementShown);
    if(this.transactionAgreementShown){
      this.userAgreementShown=false;
      this.userInfoShown=false;
      this.pictureShown=false;
      this.locationShown=false;
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

}
