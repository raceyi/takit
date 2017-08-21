import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
import { NativeStorage } from '@ionic-native/native-storage';
import { InAppBrowser,InAppBrowserEvent } from '@ionic-native/in-app-browser';
import {TranslateService} from 'ng2-translate/ng2-translate';

declare var zxcvbn:any;

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

  browserRef;

  phoneModification:boolean=false;
  modification:boolean=false; //Please check phone auth for this flag
  phoneModAuth:boolean=false;
  phoneModAuthNum:string="";

  userPhone:string="";
  userReceiptId:string="";
  userReceiptType:string="";
  userReceiptIssue:boolean=false;
  userTaxIssueCompanyName:string="";
  userTaxIssueEmail:string="";

  saveInProgress:boolean=false;

  oldPassword:string="";
  existingPassword:string="";

  passwordChange:boolean=false;
  password:string="";
  passwordConfirm:string="";

  passwordGuideHide:boolean=true;
  passwordMatch:boolean=true;
  passwordGuide;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController, public storageProvider:StorageProvider,
              private nativeStorage:NativeStorage,private serverProvider:ServerProvider,
              private iab: InAppBrowser,public translateService: TranslateService) {

    this.getPassword().then((password:string)=>{
          this.existingPassword=password;
          console.log("existing password:"+this.existingPassword);
    },(err)=>{
        
    });

    this.userPhone=this.storageProvider.phone;
    this.userReceiptId=this.storageProvider.receiptId;
    this.userReceiptType=this.storageProvider.receiptType;
    this.userReceiptIssue=this.storageProvider.receiptIssue;
    this.userTaxIssueCompanyName=this.storageProvider.taxIssueCompanyName;
    this.userTaxIssueEmail=this.storageProvider.taxIssueEmail;
    if(this.userTaxIssueCompanyName==undefined){
        this.userTaxIssueCompanyName="";
    }
    if(this.userTaxIssueEmail==undefined){
        this.userTaxIssueEmail="";
    }
    this.receiptIssue=this.storageProvider.receiptIssue;
    this.receiptId=this.storageProvider.receiptId;
    this.receiptType=this.storageProvider.receiptType;
    this.taxIssueCompanyName=this.storageProvider.taxIssueCompanyName;
    this.taxIssueEmail=this.storageProvider.taxIssueEmail;
    this.phone=this.storageProvider.phone;

    if(this.taxIssueCompanyName==undefined){
        this.taxIssueCompanyName="";
    }
    if(this.taxIssueEmail==undefined){
        this.taxIssueEmail="";
    }

    this.password=this.oldPassword;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserInfoPage');
    this.receiptType=this.storageProvider.receiptType;
  }

  back(){
    this.navCtrl.pop({animate:true,animation: 'slide-up', direction:'back' });
  }

  expenseProofOff(){
      console.log("expenseProofOff");
      this.receiptType="IncomeDeduction";
      this.enableModification();
  }

  expenseProofOn(){
      console.log("expenseProofOn");
      this.receiptType="ExpenseProof";
      this.enableModification();
  }

  modifyPhone(){
    if(!this.phoneModification){
        this.phoneModification=true;
        this.phoneModAuth=false;
    }
  }

  doPhoneAuth(){
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

  performAuth(){
    this.doPhoneAuth().then((res:any)=>{
      if(this.phone!=res.userPhone){
              let alert = this.alertCtrl.create({
                  title: "인증번호와 입력번호가 일치 하지 않습니다. 인증 번호로 진행하시겠습니까?",
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
                      this.phone=res.userPhone;
                      this.phoneModAuth=true;
                      this.phoneModification=false;
                      this.phoneModAuthNum=this.phone;                      
                      return;   
                    }
                  }]
              });
              alert.present();
      }
      if(this.storageProvider.name!=res.userName){
              let alert = this.alertCtrl.create({
                  title: "고객 정보와 다른 이름입니다. 이름 변경이 필요하신 분은 고객센터(0505-170-3636,help@takit.biz)로 연락 바랍니다.",
                  buttons: ['OK']
              });
              alert.present();
              return;
      }
      this.phoneModAuth=true;
      this.phoneModification=false;
      this.phoneModAuthNum=this.phone;
    });
  }

  enableModification(){
      console.log("...existingPassword: "+this.existingPassword+" password:"+this.password);
      console.log("this.storageProvider.emailLogin:"+this.storageProvider.emailLogin);
      
      console.log("this.phone: "+this.phone);
      console.log("this.receiptId:"+this.receiptId);
      console.log("this.taxIssueCompanyName: "+this.taxIssueCompanyName);
      console.log("this.taxIssueEmail: "+this.taxIssueEmail);

    if( this.userPhone==this.phone.trim() &&
        ( this.userReceiptId==this.receiptId  || (this.receiptId && this.userReceiptId==this.receiptId.trim())) &&
        this.userReceiptType==this.receiptType &&
        this.userReceiptIssue==this.receiptIssue &&
        ( this.userTaxIssueCompanyName==this.taxIssueCompanyName || ( this.taxIssueCompanyName && this.userTaxIssueCompanyName==this.taxIssueCompanyName.trim())) &&
        ( this.userTaxIssueEmail==this.taxIssueEmail|| ( this.taxIssueEmail && this.userTaxIssueEmail==this.taxIssueEmail.trim())) &&
        (!this.storageProvider.emailLogin || (this.storageProvider.emailLogin 
              && this.existingPassword===this.password))){
        this.modification=false;
    }else{
        this.modification=true;
    }
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

  passwordUpNoti(){
    console.log("passwordUpNoti");  
    if(this.password===this.passwordConfirm){
            console.log("passwordGuideHide true");
            this.passwordMatch=true;
    }else{
            console.log("passwordGuideHide false");
            this.passwordMatch=false;
    }
    this.enableModification();

    console.log("passwordUp-modification:"+this.modification);
  }

  passwordConfirmUp(){
    console.log("password:"+this.password+" passwordConfirm:"+this.passwordConfirm);

    if(this.password===this.passwordConfirm){
            console.log("passwordGuideHide true");
            this.passwordMatch=true;
    }else{
            console.log("passwordGuideHide false");
            this.passwordMatch=false;
    }
    this.enableModification();
    console.log("passwordConfirmUp-modification:"+ this.modification);
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
          this.passwordGuide = "영문대문자,영문소문자,특수문자,숫자 중 3개 이상 선택, 8자리 이상으로 구성하세요";
          return false;
        }
      }
      else{
        this.passwordGuide ="비밀번호는 연속문자,숫자 및 영단어를 사용할 수 없습니다.";
        return false;
      }
  }

  getPassword(){
      return new Promise((resolve, reject)=>{
            this.nativeStorage.getItem("password").then((value:string)=>{
                var password=this.storageProvider.decryptValue("password",decodeURI(value));
                resolve(password);
            },(err)=>{
                console.log("getPassword reject");
                reject();
            });
      });
  }

  saveInfo(){
    if(this.storageProvider.tourMode){
            let alert = this.alertCtrl.create({
                        title: '둘러보기 모드입니다.',
                        buttons: ['OK']
                    });
            alert.present(); 
            return;          
    }  

    if(this.saveInProgress) return;

    this.enableModification();

    if(!this.modification){
          console.log("no modification");
          return;
    }

    if(this.phone!=this.userPhone && this.phoneModAuthNum!=this.phone){
          let alert = this.alertCtrl.create({
                        title: '인증을 수행해 주시기 바랍니다',
                        buttons: ['OK']
                    });
            alert.present();   
            return;
    }  

    if(this.storageProvider.emailLogin){ 
            if(this.oldPassword.trim().length==0){
                    let alert = this.alertCtrl.create({
                        title: '기존 비밀번호를 입력해주시기 바랍니다.',
                        buttons: ['OK']
                    });
                    alert.present();              
            }
            if(this.passwordConfirm!=this.password){
              let alert = this.alertCtrl.create({
                            title: '비밀번호가 일치하지 않습니다.',
                            buttons: ['OK']
                        });
                alert.present();   
                return;
            }

    }
   
    if(this.receiptType=="ExpenseProof" && this.userTaxIssueEmail.trim().length>0 
      && !this.validateEmail(this.userTaxIssueEmail.trim())){
                  let alert = this.alertCtrl.create({
                  title: '정상 이메일(전자세금계산서발급)을 입력해주시기 바랍니다.',
                  buttons: ['OK']
              });
              alert.present();
              return;
    }
    console.log("set saveInProgress true ");
    this.saveInProgress=true;

    let body;
    let receiptIssueVal:number;
    if(this.receiptId && this.receiptId.trim().length>0)
        receiptIssueVal=1;
    else
        receiptIssueVal=0;


    if(this.phone!=this.userPhone) //bug fix 2017.08.10 kalen.lee
           this.userPhone=this.phone;

    if(this.storageProvider.emailLogin){
        if(this.passwordChange){
          body= JSON.stringify({email:this.storageProvider.email,
                              newPassword:this.password,
                              oldPassword:this.oldPassword,
                              phone:this.userPhone.trim(),
                              name:this.storageProvider.name,
                              receiptIssue:receiptIssueVal,
                              receiptId:this.receiptId,
                              receiptType:this.receiptType,
                              taxIssueEmail:this.taxIssueEmail,
                              taxIssueCompanyName:this.taxIssueCompanyName});
        }else{
          body= JSON.stringify({email:this.storageProvider.email,
                              oldPassword:this.oldPassword,
                              phone:this.userPhone.trim(),
                              name:this.storageProvider.name,
                              receiptIssue:receiptIssueVal,
                              receiptId:this.receiptId,
                              receiptType:this.receiptType,
                              taxIssueEmail:this.taxIssueEmail,
                              taxIssueCompanyName:this.taxIssueCompanyName});
        }
    }else{
      body= JSON.stringify({email:this.storageProvider.email,
                              phone:this.userPhone.trim(),
                              name:this.storageProvider.name,
                              receiptIssue:receiptIssueVal,
                              receiptId:this.receiptId,
                              receiptType:this.receiptType,
                              taxIssueEmail:this.taxIssueEmail,
                              taxIssueCompanyName:this.taxIssueCompanyName});

    }
    console.log("call modifyUserInfo "+JSON.stringify(body));
    console.log("existing password:"+this.existingPassword);

         this.serverProvider.post(this.storageProvider.serverAddress+"/modifyUserInfo",body).then((res:any)=>{
             console.log("res:"+JSON.stringify(res));
             if(res.result=="success"){
                 this.storageProvider.phone=this.userPhone.trim();
                 this.storageProvider.receiptIssue=this.receiptIssue;
                 this.storageProvider.receiptId=this.receiptId;
                 this.storageProvider.receiptType=this.receiptType;
                 this.storageProvider.taxIssueEmail=this.taxIssueEmail;
                 this.storageProvider.taxIssueCompanyName=this.taxIssueCompanyName;
                 if(this.passwordChange){
                    var encrypted=this.storageProvider.encryptValue('password',this.password);// save email id
                    this.nativeStorage.setItem('password',encodeURI(encrypted));
                    this.existingPassword=this.password;
                }

                let alert = this.alertCtrl.create({
                            title: "회원 정보가 수정되었습니다",
                            buttons: ['OK']
                        });
                        alert.present();
             }else{
                let alert = this.alertCtrl.create({
                            title: "회원 정보 수정에 실패했습니다.",
                            buttons: ['OK']
                        });
                        alert.present();
             }
             this.saveInProgress=false;
         },(err)=>{
             if(err=="NetworkFailure"){
                let alert = this.alertCtrl.create({
                            title: "서버와 통신에 문제가 있습니다.",
                            buttons: ['OK']
                        });
                        alert.present();
            }else{
                let alert = this.alertCtrl.create({
                            title: "회원 정보 수정에 실패했습니다.",
                            buttons: ['OK']
                        });
                        alert.present();
            }
            this.saveInProgress=false;
         });    
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
