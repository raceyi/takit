import { Component ,NgZone,ViewChild} from '@angular/core';
import { NavController, NavParams,AlertController,ModalController,InfiniteScroll } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {CashConfirmPage} from '../cashconfirm/cashconfirm';
import { Events } from 'ionic-angular';

declare var moment:any;

/**
 * Generated class for the TransactionHistoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-transaction-history',
  templateUrl: 'transaction-history.html',
})
export class TransactionHistoryPage {
   //@ViewChild('infiniteScroll') infiniteScrollRef: InfiniteScroll;
    public lastTuno:number=-1;
    //private seq:number=0;
/*
    transactions=[
      {"style":{'background-color':'yellow','height':'50px'},"transactionType":"deposit","type":"캐쉬충전", "confirm":"0","date":"2017-06-12","bankName":"우리","amount":"5000","nowBalance":"5000"},
      {"style":{'background-color':'white','height':'50px'},"transactionType":"deposit","type":"캐쉬충전", "confirm":"1","date":"2017-06-12","bankCode":"032","amount":"5000","nowBalance":"10000"},
      {"style":{'background-color':'white','height':'100px'},"transactionType":"payment","type":"캐쉬구매","date":"2017-06-12","amount":"3000","nowBalance":"7000","takitId":"세종대@더큰도시락", "orderName":"매콤 제육 볶음 외 2개................................."},
      {"style":{'background-color':'white','height':'100px'},"transactionType":"payment","type":"캐쉬구매","date":"2017-06-12","amount":"3000","nowBalance":"4000","takitId":"세종대@더큰도시락", "orderName":"돈까스 외 2개"},
      {"style":{'background-color':'white','height':'100px'},"transactionType":"cancel","type":"캐쉬구매취소","date":"2017-06-12","amount":"1193000","nowBalance":"7000","takitId":"세종대@더큰도시락", "orderName":"돈까스 외 2개"},
      {"style":{'background-color':'white','height':'100px'},"transactionType":"refund","type":"캐쉬환불","date":"2017-06-12","amount":"3000","nowBalance":"4000","bankName":"우리", "accountMask":"1002-xxxx-3434"},
      {"style":{'background-color':'white','height':'100px'},"transactionType":"refund","type":"캐쉬환불","date":"2017-06-12","amount":"3000","nowBalance":"1000","bankName":"022", "fee":"400","accountMask":"1002-xxxx-3434"}];
*/
  lang;
  public transactions=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,private ngZone:NgZone
              ,private alertCtrl:AlertController,public translateService: TranslateService
              ,public storageProvider:StorageProvider,public serverProvider:ServerProvider
              ,public modalCtrl: ModalController,public events: Events) {
    if(navigator.language.startsWith("ko"))
        this.lang="ko";
    else
        this.lang="en";   

    this.storageProvider.cashInfoUpdateEmitter.subscribe((option) => {
        console.log("[TransactionHistoryPage]cashupdate comes");
        if(option=="cashupdate")
            this.updateTransactionHistory();
    });
/*
    events.subscribe('app:foreground',()=>{
        console.log('[TransactionHistoryPage] foreground');
        this.updateTransactionHistory();
    });
*/    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionHistoryPage...');
    this.updateTransactionHistory();
  }

/*
  ionViewDidEnter(){
    console.log('ionViewDidEnter TransactionHistoryPage');
  }
*/
  updateTransactionHistory(){
      console.log("updateTransactionHistory");
      this.lastTuno=-1;
      this.transactions=[];
       this.getTransactions(this.lastTuno,true).then((res:any)=>{
        console.log("updateTransactionHistory-res:"+JSON.stringify(res));
        if(res.cashList=="0"){

        }else{
            this.updateTransaction(res.cashList);
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
                }else{
                    this.translateService.get('failedGetCashHistory').subscribe(
                                        failedGetCashHistory => {
                                            let alert = this.alertCtrl.create({
                                                title: failedGetCashHistory, //'캐쉬 내역을 가져오지 못했습니다.',
                                                buttons: ['OK']
                                            });
                                            alert.present();
                                        });
                }
    });
  }

  doInfinite(infiniteScroll){
    this.getTransactions(this.lastTuno,true).then((res:any)=>{
        //console.log("res:"+JSON.stringify(res));
        if(res.cashList=="0"){
            //console.log("res:"+JSON.stringify(res));
            infiniteScroll.enable(false);
        }else{
            infiniteScroll.enable(true); //?? 
            this.updateTransaction(res.cashList);
            console.log("call complete");
            infiniteScroll.complete();
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
                }else{
                    this.translateService.get('failedGetCashHistory').subscribe(
                                        failedGetCashHistory => {
                                            let alert = this.alertCtrl.create({
                                                title: failedGetCashHistory, //'캐쉬 내역을 가져오지 못했습니다.',
                                                buttons: ['OK']
                                            });
                                            alert.present();
                                        });
                }
    });
    

  }

      getTransactions(lastTuno,lastTunoUpdate){
        return new Promise((resolve, reject)=>{
            let body = JSON.stringify({cashId:this.storageProvider.cashId,
                                lastTuno: lastTuno,
                                limit: this.storageProvider.TransactionsInPage});
            console.log("getCashList:"+body+"lastTunoUpdate:"+lastTunoUpdate);
            this.serverProvider.post( this.storageProvider.serverAddress+"/getCashList",body).then((res:any)=>{
                if(res.result=="success"){
                    //console.log("res:"+JSON.stringify(res));
                    if(lastTunoUpdate==true)
                        this.lastTuno=res.cashList[res.cashList.length-1].cashTuno;
                     resolve(res);
                }else{
                     reject("serverFailure");
                }
            },(err)=>{
                    reject(err);
            });
        });
    }

  convertType(type){
      if(this.lang=="ko"){
        if(type=='deposit'){
            return '캐쉬충전';
        }else if(type=='payment'){
            return '캐쉬구매';
        }else if(type=='refund'){
            return '캐쉬환불';
        }else if(type=='cancel'){
            return '캐쉬구매취소';
        }else{
            console.log("convertType invalid type:"+type);
            return '알수 없음';
        }
      }else{
        if(type=='deposit'){
            return 'deposit';
        }else if(type=='payment'){
            return 'payment';
        }else if(type=='refund'){
            return 'withdrawal';
        }else if(type=='interest'){
            return 'interest';
        }else if(type=='cancel'){
            return 'refund';
        }else{
            console.log("convertType invalid type:"+type);
            return 'unknown';
        }
      }
  }

  addStyle(tr:any){
    if(tr.transactionType=="deposit"){
        if(tr.confirm=="0"){
        tr.style={'background-color':'yellow'};
        }
        tr.borderStyle={"border-image": "url('assets/cash_history_2.png') 12 round",
                        "border-image-outset": "0px 100px 0px 0px",
                        "border-image-width": "8px"}
    }else if(tr.transactionType=="cancel"){
        tr.borderStyle={"border-image": "url('assets/cash_history_2.png') 12 round",
                        "border-image-outset": "0px 100px 0px 0px",
                        "border-image-width": "8px"}
    }else{
        tr.borderStyle={"border-image": "url('assets/cash_history_1.png') 12 round",
                        "border-image-outset": "0px 100px 0px 0px",
                        "border-image-width": "8px"}
    }
  } 
  

  updateTransaction(cashList){
            cashList.forEach((transaction)=>{
                var tr:any={};
                tr=transaction;
                tr.type=this.convertType(tr.transactionType);
                this.addStyle(tr);
                if(tr.transactionType=='refund'){
                    tr.accountMask=this.maskAccount(tr.account);
                }
                //if(tr.confirm==1){
                    // convert GMT time into local time
                    var trTime:Date=moment.utc(tr.transactionTime).toDate();
                    var mm = trTime.getMonth() < 9 ? "0" + (trTime.getMonth() + 1) : (trTime.getMonth() + 1); // getMonth() is zero-based
                    var dd  = trTime.getDate() < 10 ? "0" + trTime.getDate() : trTime.getDate();
                    var dString=trTime.getFullYear()+'-'+(mm)+'-'+dd;
                    tr.date=dString;
                //}else{
                //    tr.date=tr.transactionTime.substr(0,10);
                //}
                tr.hide=true; //default value
                //console.log("tr:"+JSON.stringify(tr));
                this.transactions.push(tr);
            });

            console.log("before sort transactions:"+JSON.stringify(this.transactions));
  
            // sort last transactions with transactionTime
  
            var len,startIdx;
            if(this.storageProvider.TransactionsInPage*2<this.transactions.length){
                len=this.transactions.length*2 ;
                startIdx=this.transactions.length-len;
            }else{
                len=this.transactions.length;
                startIdx=0;
            }
            //console.log("startIdx:"+startIdx+" len:"+len);
            var subtransactions=this.transactions.slice(startIdx,len);
            this.sortByKey(subtransactions);
            if(startIdx>0)
                this.transactions=this.transactions.slice(0,startIdx);
            else
                this.transactions=[];
            this.transactions=this.transactions.concat(subtransactions);
            
            console.log("after sort transactions:"+JSON.stringify(this.transactions));
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

   sortByKey(array) {
    return array.sort(function(a, b) {
        var x = moment.utc(a.transactionTime).toDate().getTime();
        var y = moment.utc(b.transactionTime).toDate().getTime();
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
   }

    addCash(transaction){
      let custom:any={};

      custom.amount=transaction.amount.toString();
      custom.cashId=transaction.cashId;
      custom.transactionTime=transaction.transactionTime;
      custom.cashTuno=transaction.cashTuno;
      custom.bankName=transaction.bankName;
      if(transaction.hasOwnProperty("depositDate") && transaction.depositDate!=null){
          console.log("addCash-depositDate, depositHour");
          custom.depositDate=transaction.depositDate;
          custom.depositHour=transaction.depositHour;
      }
      if(transaction.branchName!=undefined)
          custom.branchName=transaction.branchName;
      else
          custom.branchCode=transaction.branchCode;
        //console.log("addCash:"+JSON.stringify(transaction));
        let cashConfirmModal= this.modalCtrl.create(CashConfirmPage, { custom: custom});
        cashConfirmModal.present();
  }

  back(){
        
        this.navCtrl.pop({animate:true,animation: 'slide-up', direction:'back' });
        
        
        //this.appCtrl.goToRoot();
    }
}
