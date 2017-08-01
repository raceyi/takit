import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ModalController } from 'ionic-angular';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
//import {AlertPage} from '../alert/alert';
import { Clipboard } from '@ionic-native/clipboard';
import { ToastController } from 'ionic-angular';

declare var moment:any;

/**
 * Generated class for the CashDepositPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-cash-deposit',
  templateUrl: 'cash-deposit.html',
})
export class CashDepositPage {
  manualCheckHidden:boolean=true;
  transferDate;
  //depositBank;
  depositMemo:string;
  cashId:string;
  depositAmount:number=0;

  cashInEnable = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
        public translateService: TranslateService,public serverProvider:ServerProvider,
        public storageProvider:StorageProvider,private alertController:AlertController,
        public modalCtrl: ModalController,private clipboard: Clipboard,
        public toastCtrl: ToastController,public ngZone:NgZone) {
          
    this.cashId=this.storageProvider.cashId;
    this.depositMemo=this.storageProvider.name;
    this.defaultTransferDate();
  }

  defaultTransferDate(){
    let d = new Date();

    let mm = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1); // getMonth() is zero-based
    let dd  = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
    let hh = d.getHours() <10? "0"+d.getHours(): d.getHours();
    let dString=d.getFullYear()+'-'+(mm)+'-'+dd+'T'+hh+":00"+moment().format("Z");

    this.transferDate=dString;          
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CashDepositPage');
  }

  manualCheckOpen(){
      this.manualCheckHidden=!this.manualCheckHidden;
  }

  back(){
    this.navCtrl.pop({animate:true,animation: 'slide-up', direction:'back' });
  }

  manualCheckClose(){
      this.ngZone.run(()=>{
          //  this.transferDate=this.defaultTransferDate();
            this.depositMemo=this.storageProvider.name;
            this.depositAmount=0;
         //   this.storageProvider.depositBank=undefined;
            this.manualCheckHidden=true;
      });
  }


  cashInComplete(){

    if(this.cashInEnable){
        this.cashInEnable=false;
        if(this.storageProvider.tourMode){
              let alert = this.alertController.create({
                  title: '둘러보기모드입니다.',
                  buttons: ['OK']
              });
              alert.present();
              return;
        }

        if(this.depositAmount==undefined){
                            this.translateService.get('inputDepositAmount').subscribe(
                                inputDepositAmount => {
                                    let alert = this.alertController.create({
                                        title: inputDepositAmount,
                                        buttons: ['OK']
                                    });
                                    alert.present();
                                    this.cashInEnable = true;
                                }
                            );
                  return;
        }

        if(this.storageProvider.depositBank==undefined){
            this.translateService.get('inputDepositBank').subscribe(
                        inputDepositBank => {
                            let alert = this.alertController.create({
                                title: inputDepositBank,
                                buttons: ['OK']
                            });
                            alert.present();
                            this.cashInEnable = true;
                        }
                    );
            return;
        }

      if(this.depositMemo==undefined || this.depositMemo.trim().length==0){
             this.depositMemo=this.storageProvider.name;
      }

      var transferHour=new Date(this.transferDate);
      let body;

      console.log("this.transferDate:"+this.transferDate);
      console.log("depositDate:"+transferHour.toISOString());

      body = {
                depositTime:transferHour.toISOString(),
                amount: this.depositAmount,
                bankCode: this.storageProvider.depositBank,
                depositMemo:this.depositMemo,
                cashId:this.storageProvider.cashId
            };

      console.log("body:"+JSON.stringify(body));

      this.serverProvider.post(this.storageProvider.serverAddress+"/checkCashUserself",JSON.stringify(body)).then((res:any)=>{
                                    console.log("res:"+JSON.stringify(res));
                                    if(res.result=="success"){
                                            this.manualCheckHidden=true;

                                            let toast = this.toastCtrl.create({
                                                message: '입금 확인을 요청했습니다. 5초 이내로 응답이 없을 경우 내지갑->거래내역 선택->충전 확인을 클릭 하시면 충전 확인 메시지를 보실수 있습니다.',
                                                duration: 5000
                                                });
                                                toast.present();

                                            this.cashInEnable = true;
                                            this.manualCheckClose();
                                    }else if(res.result=="failure" && res.error=="gcm:400"){
                                                this.manualCheckHidden=true;
                                                this.translateService.get('confirmDepositInHistory').subscribe(
                                                    confirmDepositInHistory => {
                                                        let alert = this.alertController.create({
                                                            title: confirmDepositInHistory,
                                                            buttons: ['OK']
                                                        });
                                                        alert.present();
                                                        this.cashInEnable = true;
                                                    }
                                                );
                                    }else if(res.result=="failure" && res.error=="incorrect depositor"){
                                                this.translateService.get('checkDepositInput').subscribe( checkDepositInput=>{
                                                this.translateService.get('LimitedThreeTrials').subscribe(
                                                            LimitedThreeTrials => {
                                                                let alert = this.alertController.create({
                                                                    title: checkDepositInput,
                                                                    subTitle:LimitedThreeTrials,
                                                                    buttons: ['OK']
                                                                });
                                                                alert.present();
                                                                this.cashInEnable = true;
                                                            });
                                            });
                                   }else if(res.result=="failure" && res.error=="no service time"){
                                            this.translateService.get('serviceUnavailableInspectionPeriod').subscribe( serviceUnavailableInspectionPeriod=>{
                                                this.translateService.get('tryAgainAfterLimit').subscribe(
                                                            tryAgainAfterLimit => {
                                                                let alert = this.alertController.create({
                                                                    title: serviceUnavailableInspectionPeriod,
                                                                    subTitle:tryAgainAfterLimit,
                                                                    buttons: ['OK']
                                                                });
                                                                alert.present();
                                                                this.cashInEnable = true;
                                                            });
                                            });
                                    }else{
                                        let alert;
                                        if(res.error=="count excess"){
                                                this.manualCheckHidden=true;
                                                alert = this.alertController.create({
                                                    title: '3회 연속 오류로 수동확인이 불가능합니다.',
                                                    subTitle: '고객센터(help@takit.biz,0505-170-3636)에 연락하여 주시기바랍니다.',
                                                    buttons: ['OK']
                                                });
                                                alert.present();
                                                this.cashInEnable = true;
                                        }else{
                                            this.translateService.get('failedRequest').subscribe( failedRequest=>{
                                                this.translateService.get('TryItAgainLater').subscribe(
                                                            TryItAgainLater => {
                                                                let alert = this.alertController.create({
                                                                    title: failedRequest,
                                                                    subTitle:TryItAgainLater,
                                                                    buttons: ['OK']
                                                                });
                                                                alert.present();
                                                                this.cashInEnable = true;
                                                            });
                                            });
                                        }
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
                                                                this.cashInEnable = true;
                                                            });
                                                });
                                            }else{
                                                this.translateService.get('failedRequest').subscribe( failedRequest=>{
                                                this.translateService.get('TryItAgainLater').subscribe(
                                                            TryItAgainLater => {
                                                                let alert = this.alertController.create({
                                                                    title: failedRequest,
                                                                    subTitle:TryItAgainLater,
                                                                    buttons: ['OK']
                                                                });
                                                                alert.present();
                                                                this.cashInEnable = true;
                                                            });
                                                });
                                        

                                            }
                                });
      }
    }

  copyAccountInfo(){
    console.log("copyAccountInfo");
    var account = "3012424363621";
    this.clipboard.copy(account);
    this.translateService.get('AccountNumberClipbaordCopy').subscribe(
        value => {
            let alert = this.alertController.create({
                title: value,
                buttons: ['OK']
            });
            alert.present();
        }
    );
  }
    
}
