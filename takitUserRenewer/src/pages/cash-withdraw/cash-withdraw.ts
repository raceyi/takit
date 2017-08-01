import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import { NativeStorage } from '@ionic-native/native-storage';
import {ServerProvider} from '../../providers/serverProvider';
import {TranslateService} from 'ng2-translate/ng2-translate';

/**
 * Generated class for the CashWithdrawPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-cash-withdraw',
  templateUrl: 'cash-withdraw.html',
})
export class CashWithdrawPage {
  showAccount:boolean=false;
  
  public refundBank:string="";
  public refundAccount:string="";
  public refundAccountMask:string="";
  public verifiedBank:string="";
  public verifiedAccount:string="";

  public refundBankName:string="";  
  //public refundEditable=true;

  public refundAmount:number=undefined;
  public refundFee:number=undefined;

  constructor(public navCtrl: NavController, public navParams: NavParams
        ,private alertController:AlertController,private serverProvider:ServerProvider
        ,public storageProvider:StorageProvider,private nativeStorage: NativeStorage
        ,public translateService: TranslateService) {

     this.nativeStorage.getItem("refundBank").then((value:string)=>{
         console.log("refundBank is "+value);
         if(value!=null){
            this.refundBank=this.storageProvider.decryptValue("refundBank",decodeURI(value));
            this.nativeStorage.getItem("refundAccount").then((valueAccount:string)=>{
                if(value!=null){
                    this.refundAccount=this.storageProvider.decryptValue("refundAccount",decodeURI(valueAccount));
                    this.verifiedBank=this.refundBank;
                    this.verifiedAccount=this.refundAccount;
                    //console.log("refundEditable:"+this.refundEditable);
                    //console.log("refundAccountMask:"+this.refundAccountMask);
                    this.refundAccountMask=this.maskAccount(this.refundAccount); /* mask except 3 digits at front and 5 digits at end */
                    this.refundBankName=this.storageProvider.bankName(this.refundBank);
                    //this.refundEditable=false;
                    //console.log("..refundEditable:"+this.refundEditable);
                    //console.log("..refundAccountMask:"+this.refundAccountMask);
                }
            },(err)=>{
                console.log("fail to read refundAccount");
            });
        }
     },(err)=>{
        console.log("refundBank doesn't exist");
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
      //console.log("front:"+front+"mask:"+mask+"end"+end);
      //console.log("account:"+ (front+mask+end));
      return (front+mask+end);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CashWithdrawPage');
  }

  back(){
    this.navCtrl.pop({animate:true,animation: 'slide-up', direction:'back' });
  }

  manageRefundAccount(){
      console.log("manageRefundAccount");      
      this.showAccount=!this.showAccount;
      //this.refundEditable=true;
  }

  checkWithrawAccount(){    
      console.log("refundBank:"+this.refundBank);
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
              this.refundBankName=this.storageProvider.bankName(this.refundBank);
              // store info into local storage and convert button from registration into modification
              var encryptedBank:string=this.storageProvider.encryptValue('refundBank',this.refundBank);
              this.nativeStorage.setItem('refundBank',encodeURI(encryptedBank));
              var encrypted:string=this.storageProvider.encryptValue('refundAccount',this.refundAccount.trim());
              this.nativeStorage.setItem('refundAccount',encodeURI(encrypted));
              this.verifiedBank=this.refundBank;
              this.verifiedAccount=this.refundAccount.trim();
              this.refundAccountMask=this.maskAccount(this.refundAccount);
              this.showAccount=false;
              //this.refundEditable=false;
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

    checkWithrawFee(){
        return new Promise((resolve,reject)=>{

      let body = JSON.stringify({bankCode:this.refundBank,
                                cashId:this.storageProvider.cashId});
            this.serverProvider.post(this.storageProvider.serverAddress+"/checkRefundCount",body).then((res:any)=>{
                console.log("checkRefundCount res: "+JSON.stringify(res));
                if(res.result=="success")
                    resolve(res.fee);
                else if(res.result=="failure")
                    reject(res.error);
            },(err)=>{
                reject(err);
            });
        });
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

      this.checkWithrawFee().then((res:number)=>{
          console.log("checkWithdrawFee:"+res);
          if(res==0){
              this.refundFee=0;
              this.doWithraw();
          }else{
               let confirm = this.alertController.create({
                    title: res+'원의 수수료가 차감됩니다.',
                    message: '환불을 진행하시겠습니까?',
                    buttons: [
                        {
                            text: '아니오',
                            handler: () => {
                                console.log('Disagree clicked');
                                this.refundFee=undefined;
                                return;
                            }
                        },
                        {
                            text: '네',
                            handler: () => {
                                this.refundFee=res;
                                this.doWithraw();
                            }
                        }]
                    });
               confirm.present();
          }
      },(err)=>{
          if(err=="NetworkFailure"){
                       this.translateService.get('NetworkProblem').subscribe(
                            NetworkProblem => {
                                     this.translateService.get('checkNetwork').subscribe(
                                        checkNetwork => {
                                            let alert = this.alertController.create({
                                                title: NetworkProblem,
                                                subTitle: checkNetwork,//'네트웍상태를 확인해 주시기바랍니다',
                                                buttons: ['OK']
                                            });
                                            alert.present();
                                        });
                            });
            }else if(err="checkWithrawFee"){
                        this.translateService.get('refundUnavailable').subscribe(
                            refundUnavailable => {
                                     this.translateService.get('AvailableCashLessThanTransferFee').subscribe(
                                        AvailableCashLessThanTransferFee => {
                                            let alert = this.alertController.create({
                                                title: refundUnavailable,
                                                subTitle: AvailableCashLessThanTransferFee,//'네트웍상태를 확인해 주시기바랍니다',
                                                buttons: ['OK']
                                            });
                                            alert.present();
                                        });
                            });

            }else{
                       this.translateService.get('refundFailed').subscribe(
                            refundFailed => {
                                     this.translateService.get('TryItAgainLater').subscribe(
                                        TryItAgainLater => {
                                            let alert = this.alertController.create({
                                                title: refundFailed,
                                                subTitle: TryItAgainLater,//'네트웍상태를 확인해 주시기바랍니다',
                                                buttons: ['OK']
                                            });
                                            alert.present();
                                        });
                            });
            }
      });
  }

  doWithraw(){
        //look for refund bankName. hum... I am so lazy.
        var refundBankName;
        for(var i=0;i<this.storageProvider.banklist.length;i++){
            if(this.storageProvider.banklist[i].value==this.refundBank){
                refundBankName=this.storageProvider.banklist[i].name;
            }
        }
        let body = JSON.stringify({depositorName:this.storageProvider.name,
                                bankCode:this.refundBank ,
                                bankName:refundBankName,
                                account:this.refundAccount.trim(),
                                cashId:this.storageProvider.cashId,
                                withdrawalAmount:this.refundAmount,
                                fee:this.refundFee});
      console.log("refundCash:"+body);
      this.serverProvider.post(this.storageProvider.serverAddress+"/refundCash",body).then((res:any)=>{
          console.log("refundCash res:"+JSON.stringify(res));
          if(res.result=="success"){
              //console.log("cashAmount:"+res.cashAmount);
              this.storageProvider.cashInfoUpdateEmitter.emit("cashupdate");
               let alert = this.alertController.create({
                    title: '환불요청에 성공했습니다.',
                    buttons: ['OK']
                });
                alert.present();
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
                     let alert = this.alertController.create({
                            title: '서버응답에 문제가 있습니다.',
                            buttons: ['OK']
                        });
                        alert.present();
                 }
      });
  }

  enableRefundEditable(){
      //this.refundEditable=true;
      this.refundBank="";
      this.refundAccount="";
  }

  cancelRefundEditable(){
      //this.refundEditable=false;
      this.refundBank=this.verifiedBank;
      this.refundAccount=this.verifiedAccount;
      this.refundAccountMask=this.maskAccount(this.refundAccount);
      this.showAccount=false;
  }

}
