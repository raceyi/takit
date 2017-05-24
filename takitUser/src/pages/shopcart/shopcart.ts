import {Component,NgZone,ViewChild,ElementRef} from "@angular/core";
import {NavController,NavParams,Content,AlertController,Tabs,App} from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {ServerProvider} from '../../providers/serverProvider';
import { Keyboard } from '@ionic-native/keyboard';
import {CashPassword} from '../cash-password/cash-password';

declare var cordova:any;

@Component({
    selector:'page-shopcart',
    templateUrl: 'shopcart.html'
})

export class ShopCartPage{
    @ViewChild('shopcartPage') orderPageRef: Content;
    @ViewChild('takeoutDiv') takeoutDivElementRef:ElementRef;

    shopname:string;
    userNotiHidden:boolean =false;
    price:number=0;    //total price
    discount:number=0; //total discount
    amount:number=0;   //total amount. acutual price with discount
    cart:any={};
    takeoutAvailable:boolean=false;
    takeout:boolean=false;

    delivery:boolean=false;
    deliveryAddress:string="";
    here:boolean=true;

    hasOptions:boolean=false;

    cashPassword="";
    receiptIdMask:string;

    iOSOrderButtonHide=true;

    shopPhoneHref:string;

    orderInProgress=false;


     constructor(private app:App,private navController: NavController,private http:Http,
            private navParams: NavParams,public storageProvider:StorageProvider,
            private alertController:AlertController,private serverProvider:ServerProvider,
            private ngZone:NgZone,private keyboard:Keyboard){
	      console.log("ShopCartPage constructor");

        //Just for testing
        //this.storageProvider.shopInfo.freeDelivery="0";
        //this.storageProvider.shopInfo.deliveryArea="세종대학교내 예)00관 101호";
        ///////////////////////////////

        this.shopname=this.storageProvider.currentShopname();
        this.cart=this.storageProvider.cart;

        if(this.storageProvider.receiptIssue){
            this.receiptIdMask=this.storageProvider.receiptId.substr(0,3)+"****"+this.storageProvider.receiptId.substr(7,this.storageProvider.receiptId.length-7);
            console.log("recpitIdMask:"+this.receiptIdMask);
        }
        if(this.storageProvider.shopResponse.shopInfo.hasOwnProperty("shopPhone"))
            this.shopPhoneHref="tel:"+this.storageProvider.shopResponse.shopInfo.shopPhone;

        if(this.cart!=undefined){
            this.price=this.cart.total;
            this.discount=Math.round(this.cart.total*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0));
            this.amount=this.price-this.amount;
            if(this.delivery==true && this.amount<this.storageProvider.shopInfo.freeDelivery){
                this.delivery=false;
                this.takeout=false;
                this.here=true;
            }
        }
        /*
        if(!this.storageProvider.isAndroid && !this.storageProvider.keyboardHandlerRegistered){ //ios
            this.storageProvider.keyboardHandlerRegistered=true;
            this.keyboard.onKeyboardShow().subscribe((e)=>{
                console.log("keyboard show");
                this.ngZone.run(()=>{
                    this.iOSOrderButtonHide=false;
                });
            });
            this.keyboard.onKeyboardHide().subscribe((e)=>{
                console.log("keyboard hide");
                 setTimeout(() => {
                    this.ngZone.run(()=>{
                        this.iOSOrderButtonHide=true;
                    });
                  }, 1000); 
            });
        }
        */
     }

    cashPasswordFocus(){
        console.log("cashPasswordFocus-dimensions:"+JSON.stringify(this.orderPageRef.getContentDimensions()));
        this.orderPageRef.scrollToBottom();
        if(!this.storageProvider.isAndroid){ 
            this.ngZone.run(()=>{
                this.iOSOrderButtonHide=false;       
            });
        }
    }

    cashPasswordBlur(){
        console.log("cashPasswordBlur- Why it happens?");
        if(!this.storageProvider.isAndroid){ 
            setTimeout(() => {
                        this.ngZone.run(()=>{
                            this.iOSOrderButtonHide=true;   
                        });
                    }, 1000);
        }
    }
    
    checkTakeoutAvailable(){
        console.log("checkTakeoutAvailable-begin");
        if(this.cart.hasOwnProperty("menus")){
          var i;
          var takeoutAvailable=true;
          for(i=0;i<this.cart.menus.length;i++){
              if( !this.cart.menus[i].hasOwnProperty("takeout") || 
                  (this.cart.menus[i].takeout==null) || 
                  (this.cart.menus[i].takeout==false)){ // humm... please add takeout field into all menus...
                     takeoutAvailable=false;
                     break; 
              }
          }
          this.takeoutAvailable=takeoutAvailable;
        }
        //console.log("checkTakeoutAvailable-end");
    }


    ionViewWillEnter(){
        //console.log("shopcartPage-ionViewWillEnter");
        this.cart=this.storageProvider.cart;        
        this.price=this.cart.total;
        this.discount=Math.round(this.cart.total*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0));
        this.amount=this.price-this.discount;
        if(this.delivery==true && this.amount<this.storageProvider.shopInfo.freeDelivery){
            this.delivery=false;
            this.takeout=false;
            this.here=true;
        }
        this.checkTakeoutAvailable();
        //console.log("takeoutAvailable:"+this.takeoutAvailable);
        if(this.takeoutAvailable==false){
            this.takeoutDivElementRef.nativeElement.style.border="none";
            //console.log(".."+this.takeoutDivElementRef.nativeElement.style.border);
        }
    }

     emptyCart(){
        //console.log("return "+(this.cart.menus==undefined || this.cart.menus.length==0));
        return(this.cart.menus==undefined || this.cart.menus.length==0);
     }

     nonEmptyCart(){
       return(this.cart.menus!=undefined && this.cart.menus.length>0);
     }

     order(){
         if(!this.orderInProgress){
                this.orderInProgress=true;
                if(this.storageProvider.tourMode){
                    let alert = this.alertController.create({
                        title: '둘러보기 모드에서는 주문이 불가능합니다.',
                        subTitle: '로그인후 사용해주시기 바랍니다.',
                        buttons: ['OK']
                    });
                    alert.present();
                    this.orderInProgress=false;
                    return;
                }

                if(this.storageProvider.cashId==undefined ||
                            this.storageProvider.cashId.length<5){
                    let alert = this.alertController.create({
                        title:'캐쉬아이디를 설정해 주시기 바랍니다.',
                        subTitle: '캐쉬 충전 화면으로 이동하시겠습니까?',
                        buttons:
                        [{
                        text: '아니오',
                        handler: () => {
                            console.log('Disagree clicked');
                            return;
                        }
                        },
                        {
                        text: '네',
                        handler: () => {
                            console.log("move into cash tab");
                            this.storageProvider.tabRef.select(2);
                            this.storageProvider.cashMenu="cashIn";
                            this.app.getRootNav().pop(); // pop order page
                            this.app.getRootNav().pop(); // pop shop tab page
                            return;
                            }
                        }]
                    });
                    alert.present();
                    this.orderInProgress=false;
                    return;               
                }
                /*
                if(this.cashPassword.length<6){
                    let alert = this.alertController.create({
                        subTitle: '캐쉬비밀번호(6자리)를 입력해 주시기 바랍니다.',
                        buttons: ['OK']
                    });
                    alert.present();
                    this.orderInProgress=false;
                    return;               
                } */        
                if(this.storageProvider.cashAmount<this.amount){
                    let alert = this.alertController.create({
                        subTitle: '캐쉬잔액이 부족합니다.',
                        buttons: ['OK']
                    });
                    alert.present();
                    this.orderInProgress=false;
                    return;
                }
            if(this.storageProvider.tourMode==false){  
                    console.log("order ");
                    ////////////////////////////////////////////////////
                    var takeout;
                    if(this.takeout==true){
                        takeout=1;
                    }else if(this.delivery==true){
                        takeout=2;
                    }else
                        takeout=0;

                    let receiptIssueVal;
                    if(this.storageProvider.receiptIssue){
                            receiptIssueVal=1;
                    }else{
                            receiptIssueVal=0;
                    }    
                    let body = {paymethod:"cash",
                                                takitId:this.storageProvider.takitId,
                                                orderList:JSON.stringify(this.cart), 
                                                orderName:this.cart.menus[0].menuName+"이외"+ this.cart.menus.length+"종",
                                                amount:this.amount,
                                                takeout: takeout, // takeout:0(inStore) , 1(takeout), 2(delivery) 
                                                deliveryAddress: this.deliveryAddress,
                                                orderedTime:new Date().toISOString(),
                                                cashId:this.storageProvider.cashId,
                                                //password:this.cashPassword,
                                                receiptIssu:receiptIssueVal,
                                                receiptId:this.storageProvider.receiptId,
                                                receiptType:this.storageProvider.receiptType};

                    console.log("order:"+JSON.stringify(body));
                    this.navController.push(CashPassword, {body:body,trigger:"cart"});
                    this.orderInProgress=false;
                    this.cashPassword="";
/*
                    let headers = new Headers();
                    headers.append('Content-Type', 'application/json');
                    console.log("server:"+ this.storageProvider.serverAddress);
                        this.serverProvider.saveOrder(body).then((res:any)=>{
                        this.orderInProgress=false;
                        console.log(res); 
                        this.cashPassword="";  
                        var result:string=res.result;
                        if(result=="success"){
                            this.storageProvider.messageEmitter.emit(res.order);
                            this.storageProvider.cashInfoUpdateEmitter.emit("all");
                            var cart={menus:[],total:0};
                            this.storageProvider.saveCartInfo(this.storageProvider.takitId,JSON.stringify(cart)).then(()=>{
                                
                            },()=>{
                                    //move into shophome
                                    let alert = this.alertController.create({
                                            title: '장바구니 정보 업데이트에 실패했습니다',
                                            buttons: ['OK']
                                        });
                                        alert.present();
                            });
                            console.log("storageProvider.run_in_background: "+this.storageProvider.run_in_background);
                            if(this.storageProvider.run_in_background==false){
                                let confirm = this.alertController.create({
                                    title: '주문에 성공하였습니다.'+'주문번호['+res.order.orderNO+']',
                                    message: '[주의]앱을 종료하시면 주문알림을 못받을수 있습니다. 주문알림을 받기 위해 앱을 계속 실행하시겠습니까?',
                                    buttons: [
                                    {
                                        text: '아니오',
                                        handler: () => {
                                            console.log('Disagree clicked');
                                            // report it to tabs page
                                            this.storageProvider.tabMessageEmitter.emit("stopEnsureNoti"); 
                                            //move into shophome
                +                           this.storageProvider.shopTabRef.select(3);
                                            return;
                                        }
                                    },
                                    {
                                        text: '네',
                                        handler: () => {
                                            console.log('cordova.plugins.backgroundMode.enable');
                                            this.storageProvider.tabMessageEmitter.emit("backgroundEnable");
                                            cordova.plugins.backgroundMode.enable(); 
                +                           this.storageProvider.shopTabRef.select(3);
                                            return;
                                        }
                                    }
                                    ]
                                });
                                confirm.present();
                            }else{
                                let alert = this.alertController.create({
                                        title: '주문에 성공하였습니다.'+'주문번호['+res.order.orderNO+']',
                                        subTitle: '[주의]앱을 종료하시면 주문알림을 못받을수 있습니다.' ,
                                        buttons: ['OK']
                                });
                                alert.present().then(()=>{
                                    this.storageProvider.shopTabRef.select(3);
                                });  
                            }
                        }else{
                            let alert = this.alertController.create({
                                title: '주문에 실패하였습니다.',
                                subTitle: '다시 주문해주시기 바랍니다.',
                                buttons: ['OK']
                            });
                            alert.present();
                        }
                    },(error)=>{
                        this.orderInProgress=false;
                        console.log("saveOrder err "+error);
                        this.cashPassword="";                  
                        if(error=="NetworkFailure"){
                            let alert = this.alertController.create({
                                    title: '서버와 통신에 문제가 있습니다',
                                    subTitle: '네트웍상태를 확인해 주시기바랍니다',
                                    buttons: ['OK']
                                });
                                alert.present();
                        }else if(error=="shop's off"){
                            let alert = this.alertController.create({
                                    title: '상점이 문을 열지 않았습니다.',
                                    buttons: ['OK']
                                });
                                alert.present();
                        }else if(error=="invalid cash password"){
                            let alert = this.alertController.create({
                                    title: '비밀번호가 일치하지 않습니다.',
                                    buttons: ['OK']
                                });
                                alert.present();
                        }else{
                            let alert = this.alertController.create({
                                    title: '주문에 실패했습니다.',
                                    buttons: ['OK']
                                });
                                alert.present();                     
                        }
                    });*/
            }
        }
     }

     collapse($event){
     console.log("collpase");
     this.userNotiHidden=true;
    }

    expand($event){
      console.log("expand");
      this.userNotiHidden=false;
    }

    deleteMenu(menu){
      console.log("delete Menu "+JSON.stringify(menu));
      var cart=this.cart;
      cart.total=cart.total-menu.amount;     
      var index = cart.menus.indexOf(menu);
      if(index!=-1){
          cart.menus.splice(index, 1);
      }
      this.storageProvider.saveCartInfo(this.storageProvider.takitId,JSON.stringify(cart)).then(()=>{
          this.cart=this.storageProvider.cart;
          this.price=this.cart.total;
          this.discount=Math.round(this.cart.total*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0));
          this.amount=this.price-this.discount;
          if(this.delivery==true && this.amount<this.storageProvider.shopInfo.freeDelivery){
                this.delivery=false;
                this.takeout=false;
                this.here=true;
          }
      });
      this.checkTakeoutAvailable();
    }

    deleteAll(){
      var cart={menus:[],total:0};
      this.storageProvider.saveCartInfo(this.storageProvider.takitId,JSON.stringify(cart)).then(()=>{
          this.cart=this.storageProvider.cart;
          this.price=this.cart.total;
          this.discount=Math.round(this.cart.total*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0));
          this.amount=this.price-this.discount;
          if(this.delivery==true && this.amount<this.storageProvider.shopInfo.freeDelivery){
                this.delivery=false;
                this.takeout=false;
                this.here=true;
          }
      });
    }

     onFocusPassword(event){
         if(!this.storageProvider.isAndroid){
            console.log("onFocusPassword");
            let dimensions = this.orderPageRef.getContentDimensions();
            console.log("dimensions:"+JSON.stringify(dimensions));
            this.orderPageRef.scrollTo(0, dimensions.contentHeight);
         }
    }

changeTakeout(takeoutOption:number){
     console.log("changeTakeout:"+takeoutOption);
     console.log("here:"+this.here+"takeout:"+this.takeout+"delivery:"+this.delivery);
     if(this.here==false && this.takeout==false && this.delivery==false){
         //give user an alert. Please choose other one.
         this.ngZone.run(()=>{
             console.log("set here true");
             this.here=true;
         });
         return;
     }
    if(takeoutOption==0){
        if(this.here==true){ //here become true
            this.takeout=false;
            this.delivery=false;
        }
    }else if(takeoutOption==1){
        if(this.takeout==true){
            this.here=false;
            this.delivery=false;
        }
    }else if(takeoutOption==2){
        if(this.delivery==true){
            this.here=false;
            this.takeout=false;
        }
    }else{
        console.log("changeTakeout: unknown value "+takeoutOption);
    }
 }

}
