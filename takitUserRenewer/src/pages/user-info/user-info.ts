import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';

/**
 * Generated class for the UserInfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html',
})
export class UserInfoPage {
  receiptIssue:boolean=false;
  receiptId:string="";
  receiptType:string="";
  taxIssueCompanyName:string="";
  taxIssueEmail:string="";
  phone:string="";
  //email:string="";

  phoneModification:boolean=false;
  modification:boolean=false; //Please check phone auth for this flag
  phoneModAuth:boolean=false;
  phoneModAuthNum:string;

  userPhone:string;
  userReceiptId:string;
  userReceiptType:string;
  userReceiptIssue:boolean=false;
  userTaxIssueCompanyName:string="";
  userTaxIssueEmail:string="";

  saveInProgress:false;

  oldPassword:string;
  passwordChange:boolean=false;
  password:string="";
  passwordConfirm:string="";

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController, public storageProvider:StorageProvider) {
    this.userPhone=this.storageProvider.phone;
    this.userReceiptId=this.storageProvider.receiptId;
    this.userReceiptType=this.storageProvider.receiptType;
    this.userReceiptIssue=this.storageProvider.receiptIssue;
    this.userTaxIssueCompanyName=this.storageProvider.taxIssueCompanyName;
    this.userTaxIssueEmail=this.storageProvider.taxIssueEmail;

    this.receiptIssue=this.storageProvider.receiptIssue;
    this.receiptId=this.storageProvider.receiptId;
    this.receiptType=this.storageProvider.receiptType;
    this.taxIssueCompanyName=this.storageProvider.taxIssueCompanyName;
    this.taxIssueEmail=this.storageProvider.taxIssueEmail;
    this.phone=this.storageProvider.phone;

    this.password=this.oldPassword;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserInfoPage');
    this.receiptType=this.storageProvider.receiptType;
  }

  back(){
    this.navCtrl.pop();
  }

  expenseProofOff(){
      this.receiptType="IncomeDeduction";
  }

  expenseProofOn(){
      this.receiptType="ExpenseProof";
  }

  modifyPhone(){
    if(!this.phoneModification){
        this.phoneModification=true;
    }
  }

  performAuth(){
    this.phoneModAuth=true;
    this.phoneModification=false;
    this.phoneModAuthNum=this.phone;
  }

  enableModification(){
    if(this.userPhone==this.phone.trim() &&
        this.userReceiptId==this.receiptId.trim() &&
        this.userReceiptType==this.receiptType &&
        this.userReceiptIssue==this.receiptIssue &&
        this.userTaxIssueCompanyName==this.taxIssueCompanyName.trim() &&
        this.userTaxIssueEmail==this.taxIssueEmail.trim() &&
        (!this.storageProvider.emailLogin || (this.storageProvider.emailLogin && this.oldPassword==this.password)))
        this.modification=false;
    else
        this.modification=true;    
  }

  phoneKeyUp(){
    console.log("phoneKeyUp "+this.phone+" "+this.phoneModAuthNum);
    if(this.phone!=this.phoneModAuthNum){
      this.phoneModAuth=false;
    }
    this.enableModification();
  }

  receiptIdKeyUp(){
    console.log("receiptIdKeyUp");
    this.enableModification();
  }

  companyNameKeyUp(){
    console.log("companyNameKeyUp");
    this.enableModification();
  }

  emailKeyUp(){
    console.log("emailKeyUp");
    this.enableModification();
  }

  saveInfo(){
    if(this.phone!=this.userPhone && this.phoneModAuthNum!=this.phone){
          let alert = this.alertCtrl.create({
                        title: '인증을 수행해 주시기 바랍니다',
                        buttons: ['OK']
                    });
            alert.present();   
            return;
    }  
    if(this.passwordConfirm!=this.password){
          let alert = this.alertCtrl.create({
                        title: '비밀번호가 일치하지 않습니다.',
                        buttons: ['OK']
                    });
            alert.present();   
            return;
    }
    if(this.saveInProgress) return;
  }

    changePassword(){
    this.passwordChange=true;
  }

  cancelChangePassword(){
        this.passwordChange=false;
        this.password="";
        this.passwordConfirm="";
  }

}
