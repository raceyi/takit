import {Component,NgZone} from '@angular/core';
import {App,NavController,NavParams,Tabs,AlertController,TextInput} from 'ionic-angular';
import {Platform,Content,ModalController,InfiniteScroll} from 'ionic-angular';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {ViewChild} from '@angular/core';
import {Device,InAppBrowserEvent,InAppBrowser} from 'ionic-native';
import {CashIdPage} from '../cashid/cashid';
import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
import {Storage} from '@ionic/storage';
import {BankBranchPage} from '../bankbranch/bankbranch';
import {CashConfirmPage} from '../cashconfirm/cashconfirm';

declare var cordova:any;
declare var moment:any;

@Component({
  selector: 'page-cash',
  templateUrl: 'cash.html'
})
export class CashPage {
 //@ViewChild('infiniteScroll') infiniteScrollRef: InfiniteScroll;
  public infiniteScrollRef:any;
  public cashMenu: string = "cashIn";
  public transactions=[];
  public browserRef:InAppBrowser;
  public infiniteScroll=false;

  public refundBank:string="";
  public refundAccount:string="";

  public verifiedBank:string="";
  public verifiedAccount:string="";

  public refundEditable=true;
  public transferDate;

  public depositAmount:number=undefined;
  public depositBankInput;
  public depositMemo:string;

  public refundAmount:number=undefined;

  public lastTuno:number=-1;

  messageEmitterSubscription;

  constructor(private app:App,private platform:Platform, private navController: NavController
        ,private navParams: NavParams,public http:Http ,private alertController:AlertController
        ,public storageProvider:StorageProvider,private serverProvider:ServerProvider
        ,public storage:Storage,public modalCtrl: ModalController,private ngZone:NgZone) {

    var d = new Date();
    var mm = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1); // getMonth() is zero-based
    var dd  = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
    var dString=d.getFullYear()+'-'+(mm)+'-'+dd;
    this.transferDate=dString;

    this.depositMemo=this.storageProvider.name;
    //console.log(" param: "+this.navParams.get('param'));
    /*
    this.transactions.push({date:"2016-01-03" ,type:"입금", amount:"20,000",balance:"20,000"});
    this.transactions.push({date:"2016-01-03" ,type:"사용", amount:"-5,000",balance:"15,000"});
    this.transactions.push({date:"2016-01-15" ,type:"사용", amount:"-2,000",balance:"13,000"});
    this.transactions.push({date:"2016-01-29" ,type:"이자", amount:"+2",balance:"13,002"});
    this.transactions.push({date:"2016-01-29" ,type:"확인", amount:"+5,000",balance:"13,002"});
    */
    //read cash info from local storage
    // bank name and account saved in encrypted format.
    console.log("read refundBank");
     this.storage.get("refundBank").then((value:string)=>{
         console.log("refundBank is "+value);
         if(value!=null){
            this.refundBank=this.storageProvider.decryptValue("refundBank",decodeURI(value));
            this.storage.get("refundAccount").then((valueAccount:string)=>{
                if(value!=null){
                    this.refundAccount=this.storageProvider.decryptValue("refundAccount",decodeURI(valueAccount));
                    this.verifiedBank=this.refundBank;
                    this.verifiedAccount=this.refundAccount;
                    this.refundEditable=false;
                }
            },(err)=>{
                console.log("fail to read refundAccount");
            });
        }
     },(err)=>{
        console.log("refundBank doesn't exist");
     });

        this.messageEmitterSubscription= this.storageProvider.cashListUpdateEmitter.subscribe(()=> {
            console.log("!!!update cashlist comes!!!-"+this.cashMenu);
            if(this.cashMenu=='cashHistory'){ //update cashList
                console.log("!!!update cashlist!!!");
                    this.getTransactions(-1).then((res:any)=>{
                        this.ngZone.run(()=>{
                                console.log("res:"+JSON.stringify(res));
                                if(res.cashList=="0"){
                                    this.infiniteScroll=false;
                                }else{
                                    this.transactions=[];
                                    this.updateTransaction(res.cashList);
                                    if(this.infiniteScrollRef!=undefined)
                                        this.infiniteScrollRef.complete();
                                }
                        });
                    },(err)=>{
                        if(err=="NetworkFailure"){
                            let alert = this.alertController.create({
                                title: '서버와 통신에 문제가 있습니다',
                                subTitle: '네트웍상태를 확인해 주시기바랍니다',
                                buttons: ['OK']
                            });
                            alert.present();
                        }else{
                            let alert = this.alertController.create({
                                title: '캐쉬 내역을 가져오지 못했습니다.',
                                buttons: ['OK']
                            });
                            alert.present();
                        }
                    });
            }
        });
  }

  cashInCheck(confirm){
  /*
      let custom:any={"depositMemo":"이경주","amount":"2","depositDate":"2017-01-06","branchCode":"0110013","cashTuno":"20170106093158510","bankName":"농협"};
    
     // let custom=      {"cashTuno":"20170103075617278","cashId":"TAKIT02","transactionType":"deposit","amount":1,"transactionTime":"20170103","confirm":0,"bankName":"농협은행"}

        let cashConfirmModal = this.modalCtrl.create(CashConfirmPage, { custom: custom });
        cashConfirmModal.present();
   */    
      console.log("cashInCheck comes(confirm)");
      let body = JSON.stringify({});
      this.serverProvider.post(this.storageProvider.serverAddress+"/checkCashInstantly",body).then((res:any)=>{
          console.log("checkCashInstantly res:"+JSON.stringify(res));
          if(res.result=="success"){
              if(this.storageProvider.isAndroid){
                    console.log("success in checkCashInstantly");
                    let alert = this.alertController.create({
                        title: '입금 확인을 요청했습니다.',
                        subTitle: '잠시 기다려 주시기 바랍니다.',
                        buttons: ['OK']
                    });
                    alert.present();
              }
          }else{
                let alert = this.alertController.create({
                    title: '요청에 실패했습니다. 잠시후 다시 요청바랍니다.',
                    buttons: ['OK']
                });
                alert.present();
          }
      },(err)=>{
          if(err=="NetworkFailure"){
                let alert = this.alertController.create({
                    title: '서버와 통신에 문제가 있습니다',
                    subTitle: '네트웍상태를 확인해 주시기바랍니다',
                    buttons: ['OK']
                });
                alert.present();
          }else{
                let alert = this.alertController.create({
                    title: '요청에 실패했습니다. 잠시후 다시 요청바랍니다.',
                    buttons: ['OK']
                });
                alert.present();
          }
      });
  }

  cashInComplete(){
      console.log("cashInComplete");
      if(this.depositAmount==undefined){
            let alert = this.alertController.create({
                title: '입금액을 입력해주시기바랍니다.',
                buttons: ['OK']
            });
            alert.present();
          return;
      }
      if(this.storageProvider.depositBank=="0" && 
            (this.depositBankInput==undefined ||  this.depositBankInput.trim().length!=3)){
            let alert = this.alertController.create({
                title: '입금 은행코드를 정확히 입력해주시기바랍니다.',
                buttons: ['OK']
            });
            alert.present();
            return;
      }
      
      if(this.storageProvider.depositBranch=="codeInput" && 
        (this.storageProvider.depositBranchInput==undefined || this.storageProvider.depositBranchInput.trim().length!=7)){
            let alert = this.alertController.create({
                title: '입금 지점을 코드를 정확히 입력해주시기바랍니다.',
                buttons: ['OK']
            });
            alert.present();
            return;
      }
      
      if(this.depositMemo==undefined || this.depositMemo.length==0){
          this.depositMemo=this.storageProvider.name;
      }
      var transferDate=new Date(this.transferDate);

//      var depositBank= this.storageProvider.depositBank=='0'?this.depositBankInput:this.storageProvider.depositBank;
      var depositBranch= this.storageProvider.depositBranch=='codeInput'? this.storageProvider.depositBranchInput:this.storageProvider.depositBranch;

      let body;
      if(this.storageProvider.depositBank=='0'){
            body = JSON.stringify({depositDate:transferDate.toISOString(),
                                        amount: this.depositAmount,
                                        bankCode: this.depositBankInput,
                                        branchCode:depositBranch,
                                        depositMemo:this.depositMemo,
                                        cashId:this.storageProvider.cashId
                                 });
      }else{
           // look for name of depositBank
          var i;
          for(i=0;i<this.storageProvider.banklist.length;i++){
                if(this.storageProvider.banklist[i].value==this.storageProvider.depositBank){
                    break;
                }
          }
          console.log("bank name:"+this.storageProvider.banklist[i].name);
            body = JSON.stringify({depositDate:transferDate.toISOString(),
                                        amount: this.depositAmount,
                                        bankName: this.storageProvider.banklist[i].name,
                                        branchCode:depositBranch,
                                        depositMemo:this.depositMemo,
                                        cashId:this.storageProvider.cashId
                                 });
      }
                                 
     console.log("body:"+JSON.stringify(body));                           

      this.serverProvider.post(this.storageProvider.serverAddress+"/checkCashUserself",body).then((res:any)=>{
          console.log("res:"+JSON.stringify(res));
          if(res.result=="success"){
              if(this.storageProvider.isAndroid){
                    let alert = this.alertController.create({
                        title: '입금 확인을 요청했습니다.',
                        subTitle: '잠시 기다려 주시기 바랍니다.',
                        buttons: ['OK']
                    });
                    alert.present();
              }
          }else{
              let alert;

              if(res.error=="count excess"){
                    alert = this.alertController.create({
                        title: '3회 연속 오류로 수동확인이 불가능합니다.',
                        subTitle: '고객센터(help@takit.biz,0505-170-3636)에 연락하여 주시기바랍니다.',
                        buttons: ['OK']
                    });
              }else{
                    alert = this.alertController.create({
                        title: '입금 확인 요청에 실패했습니다.',
                        subTitle: '잠시후 다시 요청해주시기 바랍니다.',
                        buttons: ['OK']
                    });
              }
              alert.present();
          }
      },(err)=>{
                if(err=="NetworkFailure"){
                    let alert = this.alertController.create({
                        title: '서버와 통신에 문제가 있습니다',
                        subTitle: '네트웍상태를 확인해 주시기바랍니다',
                        buttons: ['OK']
                    });
                    alert.present();
                }else{
                    let alert = this.alertController.create({
                        title: '입금 확인 요청에 실패했습니다.',
                        subTitle: '잠시후 다시 요청해주시기 바랍니다.',
                        buttons: ['OK']
                    });
                    alert.present();
                }
      });     
  }
  
  configureCashId(){
   // this.app.getRootNav().push(CashIdPage);
   console.log("configureCashId");
   if(this.storageProvider.isAndroid){
        let confirm = this.alertController.create({
        title: '회원정보와 휴대폰 본인인증 정보가 동일해야만 합니다.',
        message: '다를 경우 회원정보 수정후 진행해주시기바랍니다.',
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
                console.log('Agree clicked');
                //this.app.getRootNav().push(CashIdPage);
               
                this.mobileAuth().then(()=>{ // success
                    this.app.getRootNav().push(CashIdPage);
                },(err)=>{ //failure
                    if(err=="invalidUserInfo"){
                        console.log("invalidUserInfo");
                        let alert = this.alertController.create({
                                title: '사용자 정보가 일치하지 않습니다.',
                                subTitle: '회원정보를 수정해주시기 바랍니다',
                                buttons: ['OK']
                            });
                            alert.present();
                    }
                });
                
            }
            }
        ]
        });
        confirm.present();    
    }else{
          this.app.getRootNav().push(CashIdPage);
/*
          console.log("ios....call mobileAuth");
                this.mobileAuth().then(()=>{ // success
                    this.app.getRootNav().push(CashIdPage);
                },(err)=>{ //failure
                    if(err=="invalidUserInfo"){
                        console.log("invalidUserInfo");
                        let alert = this.alertController.create({
                                title: '사용자 정보가 일치하지 않습니다.',
                                subTitle: '회원정보를 수정해주시기 바랍니다',
                                buttons: ['OK']
                            });
                            alert.present();
                    }
                });
*/
    }
  }

  mobileAuth(){
      console.log("mobileAuth");
    return new Promise((resolve,reject)=>{
      // move into CertPage and then 
      if(this.storageProvider.isAndroid){
            this.browserRef=new InAppBrowser("https://takit.biz:8443/NHPintech/kcpcert_start.jsp","_blank" ,'toolbar=no');
      }else{ // ios
            console.log("ios");
            this.browserRef=new InAppBrowser("https://takit.biz:8443/NHPintech/kcpcert_start.jsp","_blank" ,'location=no,closebuttoncaption=종료');
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
                                var userName=nameStrs[1];
                                console.log("userPhone:"+userPhone+" userName:"+userName);
                                let body = JSON.stringify({userPhone:userPhone,userName:userName});
                                this.serverProvider.post(this.storageProvider.serverAddress+"/validUserInfo",body).then((res:any)=>{
                                    if(res.result=="success"){
                                        // forward into cash id page
                                        resolve();
                                    }else{
                                        // change user info
                                        //    
                                        reject("invalidUserInfo");
                                    }
                                },(err)=>{
                                    if(err=="NetworkFailure"){
                                        let alert = this.alertController.create({
                                            title: '서버와 통신에 문제가 있습니다',
                                            subTitle: '네트웍상태를 확인해 주시기바랍니다',
                                            buttons: ['OK']
                                        });
                                        alert.present();
                                    }
                                    reject(err);
                                });
                            }
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

  convertType(type){
      if(type=='deposit'){
          return '입금';
      }else if(type=='payment'){
          return '구매';
      }else if(type=='refund'){
          return '환불';
      }else if(type=='interest'){
          return '이자';
      }else{
          console.log("convertType invalid type:"+type);
          return '알수 없음';
      }
  }
  
  addCash(transaction){
      let custom:any={};

      custom.amount=transaction.amount.toString();
      custom.cashId=transaction.cashId;
      custom.transactionTime=transaction.transactionTime;
      custom.cashTuno=transaction.cashTuno;
      custom.bankName=transaction.bankName;

        let cashConfirmModal= this.modalCtrl.create(CashConfirmPage, { custom: custom });
        cashConfirmModal.present();
  }

  updateTransaction(cashList){
            cashList.forEach((transaction)=>{
                var tr:any={};
                tr=transaction;
                tr.type=this.convertType(tr.transactionType);
                // convert GMT time into local time
                var trTime:Date=moment.utc(tr.transactionTime).toDate();
                var mm = trTime.getMonth() < 9 ? "0" + (trTime.getMonth() + 1) : (trTime.getMonth() + 1); // getMonth() is zero-based
                var dd  = trTime.getDate() < 10 ? "0" + trTime.getDate() : trTime.getDate();
                var dString=trTime.getFullYear()+'-'+(mm)+'-'+dd;
                tr.date=dString;
                console.log("tr:"+JSON.stringify(tr));
                this.transactions.push(tr);
            });
      
  }
  doInfinite(infiniteScroll){
    console.log("doInfinite");
    let lastTuno=this.transactions[this.transactions.length-1].cashTuno
    this.getTransactions(lastTuno).then((res:any)=>{
        console.log("res:"+JSON.stringify(res));
        if(res.cashList=="0"){
            infiniteScroll.enable(false);
            this.infiniteScroll=false;
        }else{
            this.updateTransaction(res.cashList);
            infiniteScroll.complete();
            this.infiniteScrollRef=infiniteScroll;
        }
    });
    //this.transactions.push({date:"2016-01-29" ,type:"확인", amount:"+5,000",balance:"13,002"});
    //infiniteScroll.complete();
  }

   disableInfiniteScroll(){
    console.log("disableInfiniteScroll");
    this.infiniteScroll=false;
  }

    getTransactions(lastTuno){
        return new Promise((resolve, reject)=>{
            let body = JSON.stringify({cashId:this.storageProvider.cashId,
                                lastTuno: lastTuno,
                                limit: this.storageProvider.TransactionsInPage});

            this.serverProvider.post( this.storageProvider.serverAddress+"/getCashList",body).then((res:any)=>{
                if(res.result=="success"){
                     resolve(res);
                }else{
                     reject("serverFailure");
                }
            },(err)=>{
                    reject(err);
            });
        });
    }

  enableInfiniteScroll(){
    console.log("enableInfiniteScroll");
    this.infiniteScroll=true;
    
    this.getTransactions(-1).then((res:any)=>{
                this.ngZone.run(()=>{
                        console.log("res:"+JSON.stringify(res));
                        if(res.cashList=="0"){
                            this.infiniteScroll=false;
                        }else{
                            this.transactions=[];
                            this.updateTransaction(res.cashList);
                            if(this.infiniteScrollRef!=undefined)
                                this.infiniteScrollRef.complete();
                        }
                });
            },(err)=>{
                if(err=="NetworkFailure"){
                    let alert = this.alertController.create({
                        title: '서버와 통신에 문제가 있습니다',
                        subTitle: '네트웍상태를 확인해 주시기바랍니다',
                        buttons: ['OK']
                    });
                    alert.present();
                }else{
                    let alert = this.alertController.create({
                        title: '캐쉬 내역을 가져오지 못했습니다.',
                        buttons: ['OK']
                    });
                    alert.present();
                }
            });
  }

  depositBankType(depositBank){
      console.log("depositBank is "+JSON.stringify(depositBank));
      if(depositBank!="0"){
          var i;
          for(i=0;i<this.storageProvider.banklist.length;i++){
                if(this.storageProvider.banklist[i].value==depositBank){
                    break;
                }
          }
          console.log("bank name:"+this.storageProvider.banklist[i].name);
          this.storageProvider.depositBranch=undefined;
          this.storageProvider.depositBranchInput=undefined;
          this.app.getRootNav().push(BankBranchPage,{bankName:this.storageProvider.banklist[i].name,
                                                     bankCode:this.storageProvider.banklist[i].value});
      }else{
          console.log("depositBranch is codeInput");
          this.storageProvider.depositBranch='codeInput';
          this.storageProvider.depositBranchInput=undefined;
      }
  }

  depositBranchType(depositBranch){
    console.log("depositBranch is"+depositBranch);
  }

  toggleSelectInput(type){
        if(type=='depositBankTypeSelect'){
            this.storageProvider.depositBank=undefined;
            this.storageProvider.depositBranch=undefined;
        }else if(type=='depositBranchTypeSelect'){
            if(this.storageProvider.depositBank!='0' && this.storageProvider.depositBank.length>0){
                var i;
                for(i=0;i<this.storageProvider.banklist.length;i++){
                        if(this.storageProvider.banklist[i].value==this.storageProvider.depositBank){
                            break;
                        }
                }
                this.app.getRootNav().push(BankBranchPage,{bankName:this.storageProvider.banklist[i].name,
                                                            bankCode:this.storageProvider.banklist[i].value});
            }else{
                    let alert = this.alertController.create({
                        title: '은행을 선택해주시기 바랍니다.',
                        buttons: ['OK']
                    });
                    alert.present();
            }
        }
  }

  checkWithrawAccount(){
      console.log("checkWithrawAccount");

      console.log("refundBank:"+this.refundBank);
      if(this.storageProvider.cashId.length==0){
            let alert = this.alertController.create({
                title: '캐쉬아이디를 등록해 주시기 바랍니다.',
                buttons: ['OK']
            });
            alert.present();
          return;
      }
      if(this.refundBank.length==0){
            let alert = this.alertController.create({
                title: '은행을 선택해 주시기 바랍니다.',
                buttons: ['OK']
            });
            alert.present();
          return;
      }

      if(this.refundAccount.trim().length==0 ){
            let alert = this.alertController.create({
                title: '계좌번호를 입력해 주시기 바랍니다.',
                buttons: ['OK']
            });
            alert.present();
          return;
      }

      let body = JSON.stringify({depositorName:this.storageProvider.name,
                                bankCode:this.refundBank ,account:this.refundAccount.trim()});
      this.serverProvider.post(this.storageProvider.serverAddress+"/registRefundAccount",body).then((res:any)=>{
          console.log("registRefundAccount res:"+JSON.stringify(res));
          if(res.result=="success"){
              // store info into local storage and convert button from registration into modification
              var encryptedBank:string=this.storageProvider.encryptValue('refundBank',this.refundBank);
              this.storage.set('refundBank',encodeURI(encryptedBank));
              var encrypted:string=this.storageProvider.encryptValue('refundAccount',this.refundAccount.trim());
              this.storage.set('refundAccount',encodeURI(encrypted));
              this.verifiedBank=this.refundBank;
              this.verifiedAccount=this.refundAccount.trim();
              this.refundEditable=false;
              return;
          }
          if(res.result=="failure"){
                let alert = this.alertController.create({
                    title: '환불계좌 등록에 실패하였습니다.',
                    subTitle: res.error,
                    buttons: ['OK']
                });
                alert.present();
          }
      },(err)=>{
                if(err=="NetworkFailure"){
                            let alert = this.alertController.create({
                                title: "서버와 통신에 문제가 있습니다.",
                                buttons: ['OK']
                            });
                            alert.present();
                 }else{
                     console.log("Hum...checkDepositor-HttpError");
                 } 

      });
  }

  enableRefundEditable(){
      this.refundEditable=true;
      this.refundBank="";
      this.refundAccount="";
  }

  cancelRefundEditable(){
      this.refundEditable=false;
      this.refundBank=this.verifiedBank;
      this.refundAccount=this.verifiedAccount;
  }

  refundCash(){
        if(this.refundAmount==undefined || this.refundAmount<=0){
            let alert = this.alertController.create({
                title: '환불 금액은 0보다 커야 합니다.',
                buttons: ['OK']
            });
            alert.present();
          return;
      }

      let body = JSON.stringify({depositorName:this.storageProvider.name,
                                bankCode:this.refundBank ,account:this.refundAccount.trim(),
                                cashId:this.storageProvider.cashId,
                                withdrawalAmount:this.refundAmount});

      this.serverProvider.post(this.storageProvider.serverAddress+"/refundCash",body).then((res:any)=>{
          console.log("refundCash res:"+JSON.stringify(res));
          if(res.result=="success"){
              console.log("cashAmount:"+res.cashAmount);
              this.serverProvider.updateCashAvailable().then((res)=>{
                  //do nothing;
                },(err)=>{
                    if(err=="NetworkFailure"){
                                    let alert = this.alertController.create({
                                        title: "서버와 통신에 문제가 있습니다.",
                                        buttons: ['OK']
                                    });
                                    alert.present();
                        }else{
                        let alert = this.alertController.create({
                                title: "캐쉬정보를 가져오지 못했습니다.",
                                buttons: ['OK']
                            });
                                alert.present();
                        }
                });
              return;
          }
          if(res.result=="failure" && res.error=='check your balance'){
                let alert = this.alertController.create({
                    title: '잔액이 부족합니다.',
                    buttons: ['OK']
                });
                alert.present();
              return;
          }
          if(res.result=="failure"){
                let alert = this.alertController.create({
                    title: '환불에 실패하였습니다.',
                    buttons: ['OK']
                });
                alert.present();
          }
      },(err)=>{
                if(err=="NetworkFailure"){
                            let alert = this.alertController.create({
                                title: "서버와 통신에 문제가 있습니다.",
                                buttons: ['OK']
                            });
                            alert.present();
                 }else{
                     console.log("Hum...checkDepositor-HttpError");
                 } 

      });
  }

  copyAccountInfo(){
    var account = "3012424363621";
    cordova.plugins.clipboard.copy(account);
    let alert = this.alertController.create({
        title: "클립보드로 계좌번호가 복사되었습니다.",
        buttons: ['OK']
    });
    alert.present();
  }
}
