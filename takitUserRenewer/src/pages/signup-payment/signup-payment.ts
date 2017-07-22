import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
import {TabsPage} from '../tabs/tabs';
import {CashPassword} from '../cash-password/cash-password';
import {SplashScreen } from '@ionic-native/splash-screen';

/**
 * Generated class for the SignupPaymentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-signup-payment',
  templateUrl: 'signup-payment.html',
})
export class SignupPaymentPage {
  cashId:string="";
  cashIdGuideHide:boolean=false;
  cashIdGuide:string;
  validCashId:boolean=false;
  receiptType:string;
  langauge:string;
  cashIdUnique:boolean=false;
  cashIdPassword:string;
  cashIdPasswordConfirm:string;
  issueEmail:string="";
  issueCompanyName:string="";
  receiptId:string="";

  email:string;
  name:string;
  phone:string;

  passwordConfirmString:string="";
  passwordString:string="";

  startInProgress:boolean=false;
  
  constructor(public storageProvider:StorageProvider,private serverProvider:ServerProvider,
      private splashScreen: SplashScreen,
      public navCtrl: NavController, private alertCtrl: AlertController,public navParams: NavParams) {
    console.log("SignupPaymentPage-constructor");    
    this.cashIdGuide="대소문자 구분없음";

    this.email=this.navParams.get("email");
    this.name=this.navParams.get("name");
    this.phone=this.navParams.get("phone");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPaymentPage');
    this.splashScreen.hide();
    this.receiptType="IncomeDeduction"; //Please initialize receiptType here not constructor
  }

  expenseProofOn(){
      this.receiptType="ExpenseProof";
      console.log("expenseProofOn: "+this.receiptType);
  }

  expenseProofOff(){
      this.receiptType="IncomeDeduction";
      console.log("expenseProofOff: "+this.receiptType);
  }

  validateEmail(email){   //http://www.w3resource.com/javascript/form/email-validation.php 
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){  
        return (true);  
      }  
      return (false);  
  }  

  checkValidity(){
        console.log("checkValidity");

        var valid=/[0-9a-zA-Z]{5,7}/.test(this.cashId.trim());

        if(this.cashId.trim().length<5 || this.cashId.trim().length>7 || valid==false){
            let alert = this.alertCtrl.create({
                        title: '영문,숫자조합 5~7자리로 캐쉬아이디를 설정해주시기 바랍니다.',
                        buttons: ['OK']
                    });
            alert.present();       
            return false;
        }
        if(!this.cashIdUnique){
            let alert = this.alertCtrl.create({
                        title: '캐쉬아이디 중복을 확인해 주시기 바랍니다',
                        buttons: ['OK']
                    });
            alert.present();       
            return false;
        }
        if(this.cashIdPassword!=this.cashIdPasswordConfirm){
            let alert = this.alertCtrl.create({
                        title: '캐쉬 비밀번호가 일치하지 않습니다.',
                        buttons: ['OK']
                    });
            alert.present();       
            return false;
        }

        if( this.receiptId.trim().length>0 && this.receiptType=="ExpenseProof" && this.issueEmail.trim().length>0){
            if(!this.validateEmail(this.issueEmail)){
              let alert = this.alertCtrl.create({
                        title: '세금계산서 발급 이메일을 정확히 입력해주시기 바랍니다.',
                        buttons: ['OK']
                    });
              alert.present();       
              return false;
            }
        }

        return true;
    }


  start(){
    if(this.startInProgress) return;
      if(this.checkValidity()){
          this.startInProgress=true;
          let body = JSON.stringify({cashId:this.cashId.trim().toUpperCase(),password:this.cashIdPassword});
                console.log("[configureCashId]body:"+body);
                this.serverProvider.post(this.storageProvider.serverAddress+"/createCashId",body).then((res:any)=>{
                    console.log("configureCashId:"+JSON.stringify(res));
                    if(res.result=="success"){
                        console.log("res.result is success");
                        this.storageProvider.cashId=this.cashId.trim().toUpperCase();
                        this.storageProvider.cashAmount=0;
                        /////////////////////////////////////////
                        //configure payment info
                        console.log("configure payment info "+this.receiptId.trim().length);
                        let receiptIssueVal:number;
                        if(this.receiptId.trim().length>0)
                            receiptIssueVal=1;
                        else
                            receiptIssueVal=0;
                        /*
                        console.log(" email:"+ this.email.trim());
                        console.log(" phone:"+ this.phone.trim());
                        console.log(" name:"+ this.name.trim());
                        console.log(" receiptIssue:"+ receiptIssueVal);
                        console.log(" receiptId:"+ this.receiptId);
                        console.log(" receiptType:"+this.receiptType);
                        console.log(" taxIssueEmail:"+this.issueEmail);
                        console.log(" taxIssueCompanyName:"+this.issueCompanyName);
                        */
                        body= JSON.stringify({email:this.email.trim(),
                                              phone:this.phone.trim(), 
                                              name:this.name.trim(),
                                              receiptIssue:receiptIssueVal,
                                              receiptId:this.receiptId,
                                              receiptType:this.receiptType,
                                              taxIssueEmail:this.issueEmail,
                                              taxIssueCompanyName:this.issueCompanyName
                                            });
                                            
                        console.log("modifyUserInfo:"+body);
                        this.serverProvider.post(this.storageProvider.serverAddress+"/modifyUserInfo",body).then((res:any)=>{
                            console.log("res:"+JSON.stringify(res));
                            if(res.result=="success"){
                                    this.navCtrl.setRoot(TabsPage);
                            }
                        },(err)=>{
                                        let alert = this.alertCtrl.create({
                                            title: "현금 영수증 발급 정보 등록에 실패했습니다. 더보기 -> 설정에서 입력해 주시기 바랍니다.",
                                            buttons: ['OK']
                                        });
                                        alert.present();
                                        this.navCtrl.setRoot(TabsPage);
                        });

                    }else{ 
                        this.startInProgress=false;
                        if(res.hasOwnProperty("error") && res.error=="duplicationCashId"){
                            let alert = this.alertCtrl.create({
                                title: this.cashId.trim().toUpperCase()+"(이)가 이미 존재합니다. 캐쉬아이디를 변경해주시기바랍니다.",
                                buttons: ['OK']
                            });
                            alert.present();
                        }else{
                            let alert = this.alertCtrl.create({
                                title: "캐쉬아이디 설정에 실패했습니다. 잠시후 다시 시도해 주시기 바랍니다.",
                                buttons: ['OK']
                            });
                            alert.present();
                        }
                    }
                },(err)=>{
                    this.startInProgress=false;
                    if(err=="NetworkFailure"){
                        let alert = this.alertCtrl.create({
                            title: "서버와 통신에 문제가 있습니다.",
                            buttons: ['OK']
                        });
                        alert.present();
                    }else{
                            let alert = this.alertCtrl.create({
                                title: "캐쉬아이디 설정에 실패했습니다. 잠시후 다시 시도해 주시기 바랍니다.",
                                buttons: ['OK']
                            });
                            alert.present();
                    }
                });
      }  

  }

  checkCashIdDuplicate(){
    var valid=/[0-9a-zA-Z]{5,7}/.test(this.cashId.trim());

    if(this.cashId.trim().length<5 || this.cashId.trim().length>7 || valid==false){
        let alert = this.alertCtrl.create({
                    title: '영문,숫자조합 5~7자리로 캐쉬아이디를 설정해주시기 바랍니다.',
                    buttons: ['OK']
                });
        alert.present();       
        return false;
    }
    let body=JSON.stringify({cashId:this.cashId});
    this.serverProvider.post(this.storageProvider.serverAddress+"/validCashId",body).then((res:any)=>{
                console.log("res.result:"+res.result);
                var result:string=res.result;
                if(result=="success"){
                    if(res.duplication=='valid'){
                        this.cashIdUnique=true;
                        let alert = this.alertCtrl.create({
                            title: "사용가능합니다.",
                            buttons: ['OK']
                        });
                        alert.present();
                        return;
                    }else{ // res.duplication=='duplication'
                        this.cashIdUnique=false;
                        let alert = this.alertCtrl.create({
                            title: "사용불가능합니다. 캐쉬아이디를 다시 설정해주시기 바랍니다.",
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                }else{
                    
                }
    },(err)=>{
                    if(err=="NetworkFailure"){
                        let alert = this.alertCtrl.create({
                            title: "서버와 통신에 문제가 있습니다.",
                            buttons: ['OK']
                        });
                        alert.present();
                    }else{
                            let alert = this.alertCtrl.create({
                                title: "캐쉬아이디 중복확인에 실패했습니다. 잠시후 다시 시도해 주시기 바랍니다.",
                                buttons: ['OK']
                            });
                            alert.present();
                    }
    });
  }

  myCallbackFunction = (_params) => {
      return new Promise((resolve, reject) => {
          console.log("password params:"+_params);
          this.cashIdPassword=_params;
          this.passwordString="******";
          resolve();
      });
  }

 myCallbackConfirmFunction = (_params) => {
      return new Promise((resolve, reject) => {
          console.log("password params:"+_params);
          this.cashIdPasswordConfirm=_params;
          this.passwordConfirmString="******";
          resolve();
      });
  }
  passwordInput(){
      console.log("passwordInput");
      this.navCtrl.push(CashPassword,{callback: this.myCallbackFunction, order:false,title:"캐쉬비밀번호"});
  }

  passwordConfirmInput(){
      console.log("passwordConfirmInput");
      this.navCtrl.push(CashPassword,{callback: this.myCallbackConfirmFunction, order:false,title:"캐쉬비밀번호확인"});
  }
}
