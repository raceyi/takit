import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams , AlertController, App, ViewController,Events} from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {ServerProvider} from '../../providers/serverProvider';

/**
 * Generated class for the OrderCompletePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-complete',
  templateUrl: 'order-complete.html',
})
export class OrderCompletePage {


     shopname:string;
     shopInfo;
     //items = [];
     messageEmitterSubscription;
     infiniteScroll:any;

     //shopPhoneHref:string;

     order;
     orderList;

     amount:number=0;
     totalDiscount:number=0;
     trigger:string="order";


     inProgress=false;

     constructor(private http:Http, private navController: NavController, 
          public storageProvider:StorageProvider,public navParams:NavParams,
          private alertController:AlertController, private ngZone:NgZone,
          private serverProvider:ServerProvider, public appCtrl:App,
          private viewCtrl:ViewController,public events: Events){
	      console.log("OrderCompletePage constructor");
        
        //this.shopname=this.storageProvider.currentShopname(); //mytakit에서 바로 들어올 경우, 없음.
        console.log("order:"+navParams.get('order'));
        this.order=navParams.get('order');
        if(typeof this.order.orderList==='string'){
            
        }

        this.storageProvider.orderAddInProgress(this.order,this.viewCtrl); // call this function at the begin of constructor
        
        this.orderList=JSON.parse(this.order.orderList);
        this.trigger = navParams.get('trigger');
        console.log("orderList:"+JSON.stringify(this.orderList));
        
        
        this.orderList.menus.forEach(menu => {
            if(menu.options && typeof menu.options==="string"){
                console.log("option parsing");
                menu.options=JSON.parse(menu.options);
            }

        });


        if(this.orderList.taktiDiscount){
            this.totalDiscount += this.orderList.taktiDiscount;
            console.log("orderList takitdiscount is true"+this.totalDiscount);
        } 

        if(this.orderList.couponDiscount){
            this.totalDiscount += this.orderList.couponDiscount;
            console.log("orderList couponDiscount is true"+this.totalDiscount);
        }

        // if(this.storageProvider.shopResponse.shopInfo.hasOwnProperty("shopPhone"))
        //     this.shopPhoneHref="tel:"+this.storageProvider.shopResponse.shopInfo.shopPhone;
        

        // this.orderList.forEach(menu => {
        //     this.amount+=menu.price*menu.quantity;
        //     menu.options.forEach(option => {
        //         this.amount+=option.price*menu.quantity;
        //     });
        // });

        //this.totalDiscount=this.order.taktiDiscount+this.order.couponDiscount;
        events.subscribe('push:order', (custom) => {
            // user and time are the same arguments passed in `events.publish(user, time)`
            console.log("order:"+JSON.stringify(custom));
            if(custom.orderId==this.order.orderId){
                this.ngZone.run(()=>{
                    this.order.orderStatus=custom.orderStatus;
                });
            }
        });
        
     }

    ionViewDidEnter(){
        
    }


 dismiss() {
    this.removeDuplicate();
    this.viewCtrl.dismiss();
  }

  removeDuplicate(){
       this.storageProvider.orderRemoveInProgress(this.order.orderId,this.viewCtrl);
       //hum... just remove one? yes. Workaround code 
       for(var i=0;i<this.storageProvider.orderInProgress.length;i++){
            console.log("removeDuplicate "+i);
            if(this.storageProvider.orderInProgress[i].order.orderId == this.order.orderId){
                //console.log("0.removeView-hum..."+this.app.getRootNav().getViews().length);
                //console.log("1.removeView-hum..."+this.navController.getViews().length);
                //console.log("removeView "+this.customStr);
                this.navController.removeView(this.storageProvider.orderInProgress[i].viewController);
                this.storageProvider.orderInProgress.splice(i,1);
                 console.log("call splice with "+i);
                break;                                            
           }
       }
  }

      getStatusString(orderStatus){
        console.log("orderStatus:"+orderStatus);
        if(orderStatus=="paid"){
              return "결제";
        }else if(orderStatus=="cancelled"){
              return "취소";
        }else if(orderStatus=="checked"){
              return "접수";
        }else if(orderStatus=="completed"){
              return "완료";
        }else{
          console.log("invalid orderStatus:"+orderStatus);
          return "미정";
        }
      }

    cancelOrder(){
        console.log("cancel order:"+JSON.stringify(this.order));
        // alert dialog
        let confirm = this.alertController.create({
                title: '주문을 취소하시겠습니까?',
                buttons: [{
                            text: '아니오',
                            handler: () => {
                              console.log('Disagree clicked');
                            }
                          },
                          {
                            text: '네',
                            handler: () => {
                                    let headers = new Headers();
                                    headers.append('Content-Type', 'application/json');
                                    console.log("server:"+ this.storageProvider.serverAddress);
                                    let body  = JSON.stringify({ orderId:this.order.orderId,
                                                                cancelReason:"고객접수취소",
                                                                cashId:this.storageProvider.cashId});
                                    
                                    this.serverProvider.post(this.storageProvider.serverAddress+"/cancelOrder",body).then((res:any)=>{
                                        console.log("cancelOrder-res:"+JSON.stringify(res));
                                        var result:string=res.result;
                                        if(result==="success"){
                                            //this.storageProvider.cashInfoUpdateEmitter.emit("all");
                                            this.storageProvider.cashInfoUpdateEmitter.emit("cashupdate");
                                            let alert = this.alertController.create({
                                                title: '주문 취소가 정상 처리 되었습니다.',
                                                buttons: ['확인']
                                            });
                                            alert.present();
                                        //update order status
                                            this.ngZone.run(()=>{
                                                // var i;
                                                // for(i=0;i<this.orders.length;i++){
                                                //     if(this.orders[i].orderId==order.orderId){
                                                        this.order.orderStatus="cancelled";  
                                                        this.order.statusString=this.getStatusString("cancelled");
                                                //         break;
                                                //     }
                                                // }
                                            });
                                            this.serverProvider.orderNoti().then((orders:any)=>{
                                                    if(orders==undefined || orders==null || orders.length==0){
                                                    // off run_in_background 
                                                    console.log("no more order in progress within 24 hours");
                                                    this.storageProvider.order_in_progress_24hours=false;   
                                                    this.storageProvider.tabMessageEmitter.emit("stopEnsureNoti");                         
                                                    this.storageProvider.cashInfoUpdateEmitter.emit("cashAmountUpdate");
                                                }
                                            },(err)=>{
                                                if(err=="NetworkFailure"){
                                                    let alert = this.alertController.create({
                                                                title: "서버와 통신에 문제가 있습니다.",
                                                                buttons: ['OK']
                                                            });
                                                            alert.present();
                                                }else{
                                                    console.log("orderNotiMode error");
                                                } 
                                            });

                                        }else{
                                            //Please give user a notification
                                            let alert = this.alertController.create({
                                                title: '주문취소에 실패했습니다.',
                                                subTitle: '주문 상태를 확인해 주시기바랍니다',
                                                buttons: ['OK']
                                            });
                                            alert.present();
                                        }
                                    },(err)=>{
                                    let alert = this.alertController.create({
                                            title: '서버와 통신에 문제가 있습니다',
                                            subTitle: '네트웍상태를 확인해 주시기바랍니다',
                                            buttons: ['OK']
                                        });
                                        alert.present();
                                    });
                            }
                      }]});
        confirm.present();        
      }


    back(){
        if(this.trigger==="order"){
            this.removeDuplicate();
            this.navController.popToRoot();

        }else if(this.trigger==="history"){
            this.removeDuplicate();
            this.navController.pop({animate:true,animation: 'slide-up', direction:'back' });
        }else{ //(this.trigger==="gcm")
            this.dismiss()
        }
        
        //this.appCtrl.goToRoot();
    }
}
