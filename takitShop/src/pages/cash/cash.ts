import {Component,NgZone} from "@angular/core";
import {NavController,NavParams,AlertController} from 'ionic-angular';
import{ShopTablePage} from '../shoptable/shoptable';
import {Splashscreen} from 'ionic-native';
import {PrinterProvider} from '../../providers/printerProvider';
import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
import { Storage } from '@ionic/storage';

declare var moment:any;

@Component({
  selector: 'page-cash',
  templateUrl: 'cash.html',
})

export class CashPage {
    transactions=[];
    infiniteScroll;
    withdrawAmount;
    bankAccountHidden=false;
    withrawFree;
    withrawTrAtATime=10;

  constructor(private navController: NavController, private navParams: NavParams,
                private alertController:AlertController,private ngZone:NgZone,public storage:Storage,
                private serverProvider:ServerProvider,public storageProvider:StorageProvider,public alertCtrl:AlertController){
           console.log("CashPage construtor");

           this.serverProvider.updateCashAvailable().then((res)=>{

           },(err)=>{
              if(err=="NetworkFailure"){
                   console.log("/shop/getBalance error"+body);
                  let alert = this.alertController.create({
                                    title: '서버와 통신에 문제가 있습니다',
                                    subTitle: '네트웍상태를 확인해 주시기바랍니다',
                                    buttons: ['OK']
                                });
                  alert.present();
              }else{
                  let alert = this.alertController.create({
                                    title: '상점의 캐쉬(매출) 정보를 알수 없습니다.',
                                    subTitle: '상점 캐쉬(매출) 정보를 읽어오는데 실패했습니다.',
                                    buttons: ['OK']
                                });
                  alert.present();
              }
           });

           let body = JSON.stringify({takitId:this.storageProvider.myshop.takitId});
           this.serverProvider.post("/shop/getAccount",body).then((res:any)=>{
               console.log("/shop/getAccount res-"+JSON.stringify(res));
                if(res.result=="success"){
                    this.storageProvider.account=res.account;
                    this.storageProvider.maskAccount=this.maskAccount(res.account);
                    this.storageProvider.depositor= res.depositer;
                    this.storageProvider.bankCode=res.bankCode;
                    this.storageProvider.bankName=res.bankName;
                }else{
                  let alert = this.alertController.create({
                                    title: '상점의 캐쉬(매출) 정보를 알수 없습니다.',
                                    subTitle: res.error,
                                    buttons: ['OK']
                                });
                  alert.present();
                }

           },(err)=>{
              if(err=="NetworkFailure"){
                console.log("/shop/getAccount error"+body);
                  let alert = this.alertController.create({
                                    title: '서버와 통신에 문제가 있습니다',
                                    subTitle: '네트웍상태를 확인해 주시기바랍니다',
                                    buttons: ['OK']
                                });
                  alert.present();
              }else{
                  let alert = this.alertController.create({
                                    title: '상점의 캐쉬 설정 정보를 알수 없습니다.',
                                    subTitle: '상점 캐쉬 설정를 읽어오는데 실패했습니다.',
                                    buttons: ['OK']
                                });
                  alert.present();
              }
           });

           this.getWithdrawalList(-1).then((withdrawalList:any)=>{
             this.transactions=withdrawalList;
             this.transactions.forEach(trans=>{                        // convert GMT time into local time
                 this.addLocalTime(trans);  
             });
             console.log("transactions:"+JSON.stringify(this.transactions));
           },(err)=>{
              if(err=="NetworkFailure"){
                  console.log("/shop/getWithdrawalList error");
                  let alert = this.alertController.create({
                                    title: '서버와 통신에 문제가 있습니다',
                                    subTitle: '네트웍상태를 확인해 주시기바랍니다',
                                    buttons: ['OK']
                                });
                  alert.present();
              }else{
                  let alert = this.alertController.create({
                                    title: '상점의 캐쉬 인출 목록을 알수 없습니다.',
                                    subTitle: '상점 캐쉬 인출 목록을 읽어오는데 실패했습니다.',
                                    buttons: ['OK']
                                });
                  alert.present();
              }
           });
  }

  getWithdrawalList(lastWithdNO){
    return new Promise((resolve,reject)=>{
          let body = JSON.stringify({takitId:this.storageProvider.myshop.takitId,
                               lastWithdNO:lastWithdNO,
                               limit:this.withrawTrAtATime});

          this.serverProvider.post("/shop/getWithdrawalList",body).then((res:any)=>{
              console.log("getWithdrawalList:"+JSON.stringify(res));
               if(res.result=="success"){
                   if(res.withdrawalList=='0'){ 
                       console.log("withdrawList is 0");                   
                       resolve([]);
                   }else{
                       console.log("withdrawList is not empty");
                       resolve(res.withdrawalList);
                   }
               }else{
                    reject('상점 캐쉬 인출 목록을 읽어오는데 실패했습니다.');
               }
            },(err)=>{
                reject(err);
           });
    });
  }

  maskAccount(account:string){
      if(account==undefined || account.length<9){
          return undefined;
      }
      var mask:string='*'.repeat(account.length-this.storageProvider.accountMaskExceptFront-this.storageProvider.accountMaskExceptEnd);  
      var front:string=account.substr(0,this.storageProvider.accountMaskExceptFront);
      var end:string=account.substr(account.length-this.storageProvider.accountMaskExceptEnd,this.storageProvider.accountMaskExceptEnd);
      front.concat(mask, end);
      return (front+mask+end);       
  }

  doInfinite(infiniteScroll){
      let lastWithdNO=this.transactions[this.transactions.length-1].withdNO;

      this.getWithdrawalList(lastWithdNO).then((withdrawalList:any)=>{
          console.log("withdrawalList: "+JSON.stringify(withdrawalList));
        if(withdrawalList='0'){
                infiniteScroll.enable(false);
        }else{
          for(var i=0;i<withdrawalList.length-1;i++){
            let trans=withdrawalList[i];
            this.addLocalTime(trans);
            this.transactions.push(trans);
          }
          infiniteScroll.complete();
        }
      },err=>{
              if(err=="NetworkFailure"){
                  console.log("/shop/getWithdrawalList error");
                  let alert = this.alertController.create({
                                    title: '서버와 통신에 문제가 있습니다',
                                    subTitle: '네트웍상태를 확인해 주시기바랍니다',
                                    buttons: ['OK']
                                });
                  alert.present();
              }else{
                  let alert = this.alertController.create({
                                    title: '상점의 캐쉬 인출 목록을 알수 없습니다.',
                                    subTitle: '상점 캐쉬 인출 목록을 읽어오는데 실패했습니다.',
                                    buttons: ['OK']
                                });
                  alert.present();
              }
      });
  }
   
  addLocalTime(trans){
        var trTime:Date=moment.utc(trans.transactionTime).toDate();
        var mm = trTime.getMonth() < 9 ? "0" + (trTime.getMonth() + 1) : (trTime.getMonth() + 1); // getMonth() is zero-based
        var dd  = trTime.getDate() < 10 ? "0" + trTime.getDate() : trTime.getDate();
        var dString=trTime.getFullYear()+'-'+(mm)+'-'+dd;
        trans.localTime=dString;       
  }

  doWithraw(){
     //takitId, bankCode(은행코드 3자리) , withdrawalAmount(인출금액),fee
        let body = JSON.stringify({takitId:this.storageProvider.myshop.takitId,
                                bankCode:this.storageProvider.bankCode ,
                                withdrawalAmount:this.withdrawAmount,
                                fee:this.withrawFree});
      console.log("doWithraw"+body);                      
      this.serverProvider.post("/shop/withdrawCash",body).then((res:any)=>{
          console.log("refundCash res:"+JSON.stringify(res));
          if(res.result=="success"){
               let alert = this.alertController.create({
                    title: '인출요청에 성공했습니다.',
                    buttons: ['OK']
                });
                alert.present();
              //console.log("cashAmount:"+res.cashAmount);
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
              this.getWithdrawalList(-1).then((withdrawalList:any)=>{
                    this.transactions=withdrawalList;
                    this.transactions.forEach(trans=>{
                        // convert GMT time into local time
                        this.addLocalTime(trans);  
                    });
              },(err)=>{
                  if(err=="NetworkFailure"){
                      console.log("/shop/getWithdrawalList error");
                      let alert = this.alertController.create({
                                        title: '서버와 통신에 문제가 있습니다',
                                        subTitle: '네트웍상태를 확인해 주시기바랍니다',
                                        buttons: ['OK']
                                    });
                      alert.present();
                  }else{
                      let alert = this.alertController.create({
                                        title: '상점의 캐쉬 인출 목록을 알수 없습니다.',
                                        subTitle: '상점 캐쉬 인출 목록을 읽어오는데 실패했습니다.',
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
                    title: '인출에 실패하였습니다.',
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
                     let alert = this.alertController.create({
                            title: '서버응답에 문제가 있습니다.',
                            buttons: ['OK']
                        });
                        alert.present();
                 } 
      });
  }

  withdrawCash(){
     console.log("withdrawCash");
           if(this.withdrawAmount==undefined || this.withdrawAmount<=0){
            let alert = this.alertController.create({
                title: '인출 금액은 0보다 커야 합니다.',
                buttons: ['OK']
            });
            alert.present();
          return;
      }
     console.log("!!!withdrawCash");
     this.checkWithrawFee().then((res)=>{
          if(res==0){
              this.withrawFree=0;
              this.doWithraw();
          }else{
               let confirm = this.alertCtrl.create({
                    title: res+'원의 수수료가 차감됩니다.',
                    message: '환불을 진행하시겠습니까?',
                    buttons: [
                        {
                            text: '아니오',
                            handler: () => {
                                console.log('Disagree clicked');
                                this.withrawFree=undefined;
                                return;
                            }
                        },
                        {
                            text: '네',
                            handler: () => {
                                this.withrawFree=res;
                                this.doWithraw();
                            }
                        }]
                    });
               confirm.present();
          }

     },(err)=>{
         if(err=="NetworkFailure"){
                  console.log("/shop/checkWithdrawalCount error");
                  let alert = this.alertController.create({
                                    title: '서버와 통신에 문제가 있습니다',
                                    subTitle: '네트웍상태를 확인해 주시기바랍니다',
                                    buttons: ['OK']
                                });
                  alert.present();
              }else{
                  let alert = this.alertController.create({
                                    title: '캐쉬 인출에 실패했습니다.',
                                    subTitle: '다시 시도해 주시기 바랍니다.',
                                    buttons: ['OK']
                                });
                  alert.present();
              }
     });
  }

    checkWithrawFee(){
        return new Promise((resolve,reject)=>{
            console.log("checkWithrawFee");
      let body = JSON.stringify({bankCode:this.storageProvider.bankCode,
                                takitId:this.storageProvider.myshop.takitId});
            console.log("checkWithrawFee "+body);

            this.serverProvider.post("/shop/checkWithdrawalCount",body).then((res:any)=>{
                console.log("checkWithdrawalCount res: "+JSON.stringify(res));
                if(res.result=="success")
                    resolve(res.fee);
                else if(res.result=="failure")
                    reject(res.error);
            },(err)=>{
                reject(err);
            });
        });
  }

  collapse($event){
     console.log("collpase");
     this.bankAccountHidden=true;
  }

  expand($event){
     console.log("expand");
     this.bankAccountHidden=false;
  }

}
