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
  email:string="";

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController, public storageProvider:StorageProvider) {
    this.userPhone=this.storageProvider.phone;
    this.userReceiptId=this.storageProvider.receiptId;
    this.userReceiptType=this.storageProvider.receiptType;
    this.userReceiptIssue=this.storageProvider.receiptIssue;
   // this.userTaxIssueCompanyName=this.storageProvider.taxIssueCompanyName;
   // this.userTaxIssueEmail=this.storageProvider.taxIssueEmail;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserInfoPage');
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
        this.userTaxIssueEmail==this.taxIssueEmail.trim())
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
    if(this.saveInProgress) return;
    // this.saveInProgress=true;
    // this.saveInProgress=false;
  }
}
