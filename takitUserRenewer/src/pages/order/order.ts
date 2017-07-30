import {Component,EventEmitter,ViewChild,ElementRef,NgZone} from '@angular/core';
import {NavController,NavParams,TextInput,Content} from 'ionic-angular';
import {Http,Headers} from '@angular/http';
import {Platform,App,AlertController} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
//import { Keyboard } from '@ionic-native/keyboard';
import {CashPassword} from '../cash-password/cash-password';
import {SearchCouponPage} from '../search-coupon/search-coupon';

//declare var cordova:any;

@Component({
  selector:'page-order',  
  templateUrl: 'order.html',
})
export class OrderPage {
  @ViewChild('orderPage') orderPageRef: Content;
  @ViewChild('optionDiv')  optionDivElementRef:ElementRef;
  @ViewChild('takeoutDiv') takeoutDivElementRef:ElementRef;

  userNotiHidden:boolean=false;
  shopName:string;
  menu:any;
  takitId;
  options;

  takeoutAvailable:boolean=false;
  takeout:boolean=false;

  delivery:boolean=false;
  deliveryAddress:string="";
  here:boolean=true;

  hasOptions:boolean=false;

  quantity:number=1;

  discount:number;
  amount:number; //price*quantity
  price:number;
  receiptIdMask:string;

  couponDiscount:number=0; //coupon discount amount
  takitDiscount:number=0; //takit discount amount
  totalDiscount:number=0; //
  totalAmount:number; //amount-couponDiscount-takitDiscount 
                        //finally paying amount

  cashPassword:string="";

  focusQunatityNum= new EventEmitter();
  iOSOrderButtonHide=true;

  lang;

  orderInProgress=false;

  @ViewChild('quantityNum') inputNumRef: TextInput;

  keyboardHeight;
  scrollHeight=0;

  takeoutType:string="here";
  payType:string="cash";
  //myCouponName:string;
  selectedCoupon={};
  coupons=[];

  trigger:string;
  cart;

  userMSG:string;

  receiptChecked=1;

  constructor(private app:App,private navController: NavController,
        private navParams:NavParams,private ngZone:NgZone,
        private alertController:AlertController, public serverProvider:ServerProvider,
        private platform:Platform,public storageProvider:StorageProvider,) {
      
        //Just for testing
        //this.storageProvider.shopInfo.freeDelivery="0";
        //this.storageProvider.shopInfo.deliveryArea="세종대학교내 예)00관 101호";
        ///////////////////////////////
        this.trigger=navParams.get('trigger');
      if(!navigator.language.startsWith("ko")){
          this.lang="en";
      }else{
          this.lang="ko";
      }
      console.log("receiptIssue:"+this.storageProvider.receiptIssue);
      
      if(this.storageProvider.receiptIssue){
            this.receiptIdMask=this.storageProvider.receiptId.substr(0,3)+"****"+this.storageProvider.receiptId.substr(7,this.storageProvider.receiptId.length-7);
            console.log("recpitIdMask:"+this.receiptIdMask);
      }
      console.log("trigger:"+this.trigger);
      if(this.trigger==="order"){
        console.log("menudetail page->order page");
        this.menu=navParams.get("menu");
        this.shopName=navParams.get("shopName");
        console.log("OrderPage-param(menu):"+navParams.get("menu"));
        console.log("OrderPage-param(shopName):"+navParams.get("shopName"));
        var splits=this.menu.menuNO.split(";");
        this.takitId=splits[0];
        console.log("takitId:"+this.takitId);

        this.price=this.menu.price*1;

        this.takitDiscount= this.menu.quantity*this.calcDiscountAmount(this.menu.price);
        let optionAmount:number=0;
        let optionDiscount:number=0;
            this.menu.options.forEach(option => {
                if(option.flag===true){
                    console.log("OrderPage constructor option.flag true");
                    
                    // !!! orderpage 계산 다시
                    // !!! 장바구니 선택한 options 들어가게
                    // !!! 주문확인
                    // !!! 주문내역


                    optionDiscount=this.calcDiscountAmount(option.price)*this.menu.quantity;
                    this.takitDiscount+=optionDiscount;
                    optionAmount+=parseInt(option.price);
                }
            });

         console.log("optionAmount:"+optionAmount);
        console.log("optionDiscount:"+optionDiscount);
        
        this.amount=(parseInt(this.menu.price)+optionAmount)*this.menu.quantity;
        console.log("amount:"+this.amount);
        
        this.totalDiscount=this.takitDiscount+this.couponDiscount;
        this.totalAmount=this.amount-this.totalDiscount; //? 할인된 금액이 만원이 넘어야 하는 것인가?

        console.log(" ["+this.menu.hasOwnProperty("takeout")+"][ "+(this.menu.takeout!=null) +"] ["+ (this.menu.takeout!=false)+"]");
        if(this.menu.hasOwnProperty("takeout") && (this.menu.takeout!=null) && (this.menu.takeout!=false)){ // humm... please add takeout field into all menus...
            this.takeoutAvailable=true;
            this.takeout=false;
        }

      }else if(this.trigger==="cart"){
          console.log("cart page->order page");
        this.cart=navParams.get('cart');

        console.log("cart:"+JSON.stringify(this.cart));

        this.cart.menus.forEach(menu => {
            this.amount+=parseInt(menu.price)*parseInt(menu.quantity);
            this.takitDiscount+=menu.quantity*this.calcDiscountAmount(menu.price);
            this.totalDiscount=this.takitDiscount+this.couponDiscount;
            menu.options.forEach(option => {
                this.amount+=parseInt(option.price);
                this.takitDiscount+=menu.quantity*this.calcDiscountAmount(option.price);
            });

            if(menu.hasOwnProperty("takeout") && (menu.takeout!=null)){ // humm... please add takeout field into all menus...
                this.takeoutAvailable=menu.takeout; //menu.takeout 값을 넣어서 모두 true이면 true, 하나라도 false이면 false
                this.takeout=false;
            }
        });
        this.totalAmount=this.cart.total;
      }

      this.storageProvider.shopInfo.freeDelivery=parseInt(this.storageProvider.shopInfo.freeDelivery);

      if(this.delivery==true && this.amount<this.storageProvider.shopInfo.freeDelivery){
            this.delivery=false;
            this.takeout=false;
            this.here=true;
      }

      console.log(this.takeoutAvailable);
      console.log(this.storageProvider.shopInfo.freeDelivery);      
        //this.autoCompleteCoupon.couponNO="";
      ///get user's couponList 에 해당하는 coupon 정보 가져오기
      

    //   if(storageProvider.couponList.length > 0 && storageProvider.nowCoupons.length === 0){
    //     let option={takitId:storageProvider.takitId,
    //               couponList:storageProvider.couponList};
    //     serverProvider.getCoupons(option).then((res:any)=>{
    //         console.log("getCoupons result:"+JSON.stringify(res));
    //         if(res.result==="success"){
    //             for(let i=0; i<res.coupons.length; i++){
    //                 if(res.coupons[i].hasOwnProperty("availMenus")){ //coupon db에 쿠폰사용가능메뉴 field가 있고,
    //                     if(!res.coupons[i].availMenus.includes(this.menu.menuNO)){ //해당 메뉴가 포함 되어 있을때
    //                         res.coupons.splice(i,0);
    //                     }
    //                 }

    //                 if(res.coupons[i].hasOwnProperty("availCategories")){ //coupon db에 쿠폰사용가능카테고리 field가 있고,
    //                     if(!res.coupons[i].availCategories.includes(this.menu.categoryNO)){//해당 카테고리가 포함 되어 있을때
    //                         res.coupons.splice(i,1);
    //                     }
    //                 }

    //                 if(res.coupons[i].hasOwnProperty("exceptMenu")){ //coupon db에 쿠폰사용제외 field가 있고,
    //                     if(res.coupons[i].exceptMenu.includes(this.menu.menuNO)){
    //                         res.coupons.splice(i,1);
    //                     }
    //                 }
    //             }
    //         }
    //         //this.coupons=res.coupons;
    //         storageProvider.nowCoupons = res.coupons;
            
    //         ///coupon auto complete
            
            

    //     },err=>{
    //         console.log("getCoupons error:"+JSON.stringify(err));
    //     }).catch(err=>{
    //         console.error(err);
    //     });
    //   }
      
    //     console.log("delivery flags:"+this.menu.takeout);
    //     console.log(this.storageProvider.shopInfo.freeDelivery,typeof this.storageProvider.shopInfo.freeDelivery);
    //     console.log(this.takeoutAvailable && (this.storageProvider.shopInfo.freeDelivery!=null) &&  (this.storageProvider.shopInfo.freeDelivery!=undefined) );
        
    //     if(this.storageProvider.shopInfo.freeDelivery===null){
    //         console.log("1");
    //     }
    //     //console.log(this.storageProvider.shopInfo.freeDelivery);
    //     if(this.storageProvider.shopInfo.freeDelivery){
    //         console.log("2");
    //     }

    //     if(!this.storageProvider.shopInfo.freeDelivery){
    //         console.log("3");
    //     }

    if(storageProvider.receiptIssue){
        this.receiptChecked=1;
    }else{
        this.receiptChecked=0;
    }
 }


 ionViewWillEnter(){
     console.log("orderPage-ionViewWillEnter");

    // if(this.storageProvider.nowCoupons.length > 0 && this.storageProvider.nowCoupons[0].takitId===this.takitId){
    //     this.coupons=this.storageProvider.nowCoupons;

    //     if(this.coupons.length > 0){
    //         let discountCoupon=null;
    //         let addCoupon=null;

    //         for(let i=0; i<this.coupons.length-1; i++){
    //             if(this.coupons[i].type==="discount"){
    //                 if(discountCoupon===null){
    //                     discountCoupon=this.coupons[i].couponName;
    //                 }else{
    //                     if(parseInt(discountCoupon.discountRate.replace("%","")) 
    //                         < parseInt(this.coupons[i].discountRate.replace("%",""))){
    //                         discountCoupon=this.coupons[i];
    //                     }
    //                 }
    //             }
    //             if(this.coupons[i].type==="add" && addCoupon===null){
    //                 addCoupon=this.coupons[i];
    //             }
    //         }
    //         if(discountCoupon!==null){
    //             this.selectedCoupon = discountCoupon;
    //             this.couponDiscount=Math.round(this.amount*(parseInt(discountCoupon.discountRate.replace("%",""))/100.0));
    //             this.amount -= this.couponDiscount;
    //         }else if(addCoupon!==null){
    //             this.selectedCoupon = addCoupon;
    //         }
                                
    //     }
    //}

    if(this.hasOptions==false){
    //console.log(".."+this.optionDivElementRef.nativeElement.style.border);
    this.optionDivElementRef.nativeElement.style.border="none";

    }
    if(this.takeoutAvailable==false){
        //console.log(".."+this.takeoutDivElementRef.nativeElement.style.border);
        this.takeoutDivElementRef.nativeElement.style.border="none";
    }

 }


 ionViewDidEnter(){ // Be careful that it should be DidEnter not Load 
        this.orderPageRef.resize();

       
        /*
        if(!this.storageProvider.isAndroid && !this.storageProvider.keyboardHandlerRegistered){ //ios
            this.storageProvider.keyboardHandlerRegistered=true;
            this.keyboard.onKeyboardShow().subscribe((e)=>{
                console.log("keyboard show "+this.orderPageRef.contentHeight);
                console.log("dimensions:"+JSON.stringify(this.orderPageRef.getContentDimensions()));
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
      // kalen's test 2017.05.17
      /*
        this.keyboard.onKeyboardShow().subscribe((e)=>{
            console.log("keyboard height:"+e.keyboardHeight);
            this.keyboardHeight=e.keyboardHeight;
            if(this.storageProvider.isAndroid){  // workaround solution
                if(this.scrollHeight==0){
                    this.scrollHeight=this.orderPageRef.getContentDimensions().scrollHeight-this.keyboardHeight-20;
                }
                console.log("dimensions:"+JSON.stringify(this.orderPageRef.getContentDimensions()));
                console.log("scrollTo:"+this.scrollHeight);
                this.orderPageRef.scrollTo(0,this.scrollHeight);
            }
        });
        */
 }
 calcDiscountAmount(price){
      return Math.round(price*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0));
  }

cashPasswordFocus(){
    if(!this.storageProvider.isAndroid){  // workaround solution
        this.orderPageRef.scrollToBottom();
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
  sendSaveOrder(cart,menuName){
      if(this.storageProvider.tourMode==false){
             //check if cash and cashpassword exist             
            var takeout;
            if(this.takeout==true){
                takeout=1;
            }else if(this.delivery==true){
                takeout=2;
            }else
            takeout=0;
            /*
            let body = JSON.stringify({paymethod:"cash",
                                    takitId:this.takitId,
                                    orderList:JSON.stringify(cart), 
                                    orderName:menuName+"("+this.quantity+")",
                                    amount:this.amount,
                                    takeout: takeout, // takeout:0(inStore) , 1(takeout), 2(delivery) 
                                    orderedTime:new Date().toISOString(),
                                    cashId: this.storageProvider.cashId,
                                    //password:this.cashPassword,
                                    receiptIssu:receiptIssueVal,
                                    receiptId:this.storageProvider.receiptId,
                                    receiptType:this.storageProvider.receiptType
                                });
            */
            let orderName;
            
            if(this.trigger==="order"){
                orderName=menuName+"("+this.menu.quantity+")";
            }else if(this.trigger==="cart"){
                orderName=cart.menus[0].menuName+"이외"+ cart.menus.length+"종";            
            }

            let body = {    paymethod:"cash",
                            takitId:this.takitId,
                            orderList:JSON.stringify(cart), 
                            orderName:orderName,
                            amount:this.totalAmount,
                            takeout: takeout, // takeout:0(inStore) , 1(takeout), 2(delivery) 
                            deliveryAddress: this.deliveryAddress,
                            orderedTime:new Date().toISOString(),
                            cashId: this.storageProvider.cashId,
                            //password:this.cashPassword,
                            receiptIssue:this.receiptChecked,
                            receiptId:this.storageProvider.receiptId,
                            receiptType:this.storageProvider.receiptType,
                            //couponNO:this.selectedCoupon.couponName,
                            shopName:this.shopName,
                            userMSG:this.userMSG
                        };

            console.log("sendOrder:"+JSON.stringify(body));                          
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            console.log("server:"+ this.storageProvider.serverAddress);
            this.navController.push(CashPassword, {body:body,trigger:this.trigger});
            this.orderInProgress=false;
            this.cashPassword="";
/*
             this.serverProvider.saveOrder(body).then((res)=>{    
                 resolve(res);
             },(err)=>{
                 reject(err);
             });                
  */            
      }
  }

 changeTakeout(takeoutOption:string){
     console.log("changeTakeout:"+takeoutOption);
     //console.log("here:"+this.here+"takeout:"+this.takeout+"delivery:"+this.delivery);
    //  if(this.here==false && this.takeout==false && this.delivery==false){
    //      //give user an alert. Please choose other one.
    //      this.ngZone.run(()=>{
    //          console.log("set here true");
    //          this.here=true;
    //      });
    //      return;
    //  }
    if(takeoutOption=="here"){
        // if(this.here==true){ //here become true
            this.here = true;
            this.takeout=false;
            this.delivery=false;
        //}
    }else if(takeoutOption=="takeout"){
        // if(this.takeout==true){
            this.takeout=true;
            this.here=false;
            this.delivery=false;
        //}
    }else if(takeoutOption=="delivery"){
        // if(this.delivery==true){
            this.delivery=true;
            this.here=false;
            this.takeout=false;
        //ß}
    }else{
        console.log("changeTakeout: unknown value "+takeoutOption);
        this.here = true;
        this.takeout=false;
        this.delivery=false;
    }
 }

  sendOrder(){
    // check cash password
           var cart={menus:[],total:0,prevAmount:0,takitDiscount:0,couponDiscount:0};
           var options=[];
           if(this.options!=undefined){
                this.options.forEach((option)=>{
                    if (option.flag==true){
                        if(option.select!=undefined)
                            options.push({name:option.name,price:option.price,select:option.select});
                        else
                            options.push({name:option.name,price:option.price});
                    }    
                });
           }
        //    var menuName=this.menu.menuName;
        //    if(this.menu.hasOwnProperty("description"))
        //         menuName+=this.menu.description;
            
           if(this.trigger==="order"){
               //orderList
                cart.menus.push({menuNO:this.menu.menuNO,
                                menuName:this.menu.menuName,
                                quantity:this.menu.quantity,
                                options: options,
                                price: this.menu.price, //menu's original price
                                amount:this.amount});   //menu's discount price
                cart.total=this.totalAmount;
                cart.prevAmount=this.amount;
                cart.couponDiscount=this.couponDiscount;
                cart.takitDiscount=this.takitDiscount;
                this.sendSaveOrder(cart,this.menu.menuName); 
           }else if(this.trigger==="cart"){
                this.storageProvider.cart.prevAmount=this.amount;
                this.storageProvider.cart.couponDiscount= this.couponDiscount;
                this.storageProvider.cart.takitDiscount=this.takitDiscount;
                this.storageProvider.cart.total = this.totalAmount;
                this.sendSaveOrder(this.storageProvider.cart,undefined); 
           }
           
           
                   
  }  

 checkOptionValidity(){
     return new Promise((resolve, reject)=>{
            var i;
            console.log("options:"+JSON.stringify(this.options));
            if(this.options!=undefined && this.options!=null && Array.isArray(this.options)){
                for(i=0;i<this.options.length;i++){
                        var option=this.options[i];
                        if(option.hasOwnProperty("choice")==true && option.flag){
                            console.log("option.select:"+option.select);
                            if(option.select==undefined && option.name!=undefined){
                                reject(option.name);
                            }
                        }
                }
            }
            resolve();
     });
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

        console.log("order comes... "); 
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
                    //['OK']
                    this.app.getRootNav().pop();
                    this.storageProvider.tabRef.select(2);
                    this.storageProvider.cashMenu="cashIn";
                    this.app.getRootNav().pop(); // pop order page
                    this.app.getRootNav().pop(); // pop shop tab page
                    console.log("move into cash tab");
                    // move into cash page
                    //this.storageProvider.tabMessageEmitter.emit("moveCashConfiguration");
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
        }
        */
        if(this.quantity==undefined){
            let alert = this.alertController.create({
                subTitle: '수량을 입력해주시기 바랍니다',
                buttons: ['OK']
            });
            console.log("hum...");
            alert.present().then(()=>{
                console.log("alert done");
            });
            this.orderInProgress=false;
            return;
        }
        if(this.delivery==true && this.deliveryAddress.trim().length==0){
            let alert = this.alertController.create({
                subTitle: '배달주소를 입력해주시기 바랍니다',
                buttons: ['OK']
            });
            console.log("hum...");
            alert.present().then(()=>{
                console.log("alert done");
            });
            this.orderInProgress=false;
            return;
        }
        // check options
        this.checkOptionValidity().then(()=>{
            if(this.storageProvider.cashAmount >= this.amount){
                this.sendOrder();
            }else{
                let alert = this.alertController.create({
                    subTitle: '캐쉬잔액이 부족합니다.',
                    buttons: ['OK']
                });
                this.orderInProgress=false;
                alert.present();
                return;
            }
        },(name)=>{
            console.log("option.select is undefined");
            let alert = this.alertController.create({
                subTitle: name+'을 선택해주십시오',
                buttons: ['OK']
            });
            this.orderInProgress=false;
            alert.present();
            return;
        });
    }
  }

//   shopcart(){
//         console.log("orderPage->shopcart");
//         if(this.quantity==undefined){
//             if(this.platform.is('android'))
//                 this.focusQunatityNum.emit(true); 
//             else if(this.platform.is('ios')){
//              //show alert
//          }      
//         }

//         this.checkOptionValidity().then(()=>{
//         this.saveShopcart();
//     },(name)=>{
//         console.log("option.select is undefined");
//         let alert = this.alertController.create({
//             subTitle: name+'을 선택해주십시오',
//             buttons: ['OK']
//         });
//         console.log("hum...");
//         alert.present().then(()=>{
//             console.log("alert done");
//             return;
//         });
//     });

//   }

//   saveShopcart(){    
//     this.cashPassword="";  
//     this.storageProvider.getCartInfo(this.takitId).then((result:any)=>{
//         var cart;
//         if(Array.isArray(result) && result.length==1){
//             cart=JSON.parse(result[0].cart);
//         }else{
//             console.log("no cart info");
//             cart={menus:[],total:0};
//         }
//         var options=[];
//         if(this.options!=undefined){
//             this.options.forEach((option)=>{
//                 if (option.flag==true){
//                     if(option.select!=undefined)
//                         options.push({name:option.name,price:option.price,select:option.select});
//                     else
//                         options.push({name:option.name,price:option.price});
//                 }    
//             });
//         }
//         var menuName=this.menu.menuName;
//         if(this.menu.hasOwnProperty("description"))
//             menuName+=this.menu.description;

//         cart.menus.push({menuNO:this.menu.menuNO,
//                     menuName:menuName,
//                     quantity:this.quantity,
//                     options: options,
//                     price: this.menu.price,
//                     amount: this.price,
//                     discountAmount:this.price-Math.round(this.price*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0)),
//                     takeout:this.takeoutAvailable});
//         cart.total=cart.total+this.price;
//         console.log("cart:"+JSON.stringify(cart));
//         this.storageProvider.saveCartInfo(this.takitId,JSON.stringify(cart)).then(()=>{
//             this.storageProvider.shopTabRef.select(2);
//             this.navController.pop()
//         });
//     },(err)=>{
//         console.log("getCartInfo error");
//         // Please show error alert
//     });
//   }


//   getQuantity(quantity){
//       console.log("quantity change:"+quantity);

//       if(quantity==6){ // show text input box 
//           this.quantityInputType="input";
//           //this.quantity=undefined;
//           this.quantity=1; //keypad doesn't work for password if quantity is undefined.
//           if(this.platform.is('android') || this.platform.is('ios'))
//             this.focusQunatityNum.emit(true);           
//       }else{
//           this.quantityInputType="select";
//           this.price=this.menu.price*quantity;
//           this.discount=Math.round(this.price*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0));
//           this.amount=this.price-this.discount;
//           if(this.delivery==true && this.amount<this.storageProvider.shopInfo.freeDelivery){
//             this.delivery=false;
//             this.takeout=false;
//             this.here=true;
//          }
//       }
//   }

//   computeAmount(option){
//       console.log("[computeAmount]flag:"+option.flag);
//       if(option.flag==true){
//           this.price=this.price+option.price*this.quantity;    
//       }else{
//           this.price=this.price-option.price*this.quantity;
//           console.log("option.select:"+option.select);
//           if(option.hasOwnProperty("choice")){
//               option.select=undefined;
//               console.log("set false to choice flags");              
//                 var i;
//                 for(i=0;i<option.flags.length;i++){
//                         //console.log("choice:"+option.choice[i]+"flags:"+option.flags[i]);
//                         option.flags[i]=false;
//                 }
//           }
//       }
//       this.discount=Math.round(this.price*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0));
//       this.amount=this.price-this.discount;
//       if(this.delivery==true && this.amount<this.storageProvider.shopInfo.freeDelivery){
//             this.delivery=false;
//             this.takeout=false;
//             this.here=true;
//       }
//   }

//     choiceChange(option,idx,flag){
//         var prevOptionFlag=option.flag;
//         console.log("prevOptionFlag:"+prevOptionFlag);
//         this.ngZone.run(()=>{
//             if(flag==true && Array.isArray(option.flags)){
//                 option.select=option.choice[idx];
//                 option.flag=true;
//                 if(prevOptionFlag==false){
//                     console.log("compute amount again(add)");
//                     this.computeAmount(option);
//                 }
//                 // other flags become false
//                 let i;
//                 for(i=0;i<option.flags.length;i++){
//                     if(i!=idx){
//                         option.flags[i]=false;
//                     }else{
//                         option.flags[i]=true;
//                     }
//                 }
//             }else{
//                 option.select=undefined;
//                 let i;
//                 for(i=0;i<option.flags.length;i++){
//                     if(option.flags[i]==true)
//                         break;
//                 }
//                 if(i==option.flags.length){
//                     option.flag=false;
//                     if(prevOptionFlag==true){
//                         this.computeAmount(option);            
//                         console.log("compute amount again(remove)");
//                     }
//                 }

//             }
//         });
//     }

//   optionChange(option){
//       console.log("flag:"+option.flag);
//       if(option.flag==true){
//           this.price=this.price+option.price*this.quantity;    
//       }else{
//           this.price=this.price-option.price*this.quantity;
//           console.log("option.select:"+option.select);
//       }
//       this.discount=Math.round(this.price*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0));
//       this.amount=this.price-this.discount;
//       if(this.delivery==true && this.amount<this.storageProvider.shopInfo.freeDelivery){
//             this.delivery=false;
//             this.takeout=false;
//             this.here=true;
//       }

//   }

//   quantityInput(flag){
//     // console.log("flag:"+flag+" quantityInputType:"+this.quantityInputType);
//      if(flag){ // number selection
//         if(this.quantityInputType=="select"){
//           return false;
//         }else  
//           return true;   
//      }else{ //text input
//         if(this.quantityInputType=="select"){
//           return true;
//         }else{
//           return false;   
//         }
//      }
//    }

//   onBlur($event){
//       console.log("onBlur this.quantity:"+this.quantity);
//     if(this.quantity==undefined || this.quantity==0 || this.quantity.toString().length==0){
//         this.focusQunatityNum.emit(true);  
//         /*
//            let alert = this.alertController.create({
//                     title: '수량을 입력해주시기바랍니다.',
//                     buttons: ['OK']
//                     });
//                     alert.present().then(()=>{
//                         console.log("alert done");
//                         //this.focusQunatityNum.emit(true);  
//                     });
//            */         
//     }else{
//         var unitPrice=this.menu.price;
//         this.options.forEach(option=>{
//             if(option.flag){
//                 unitPrice+=option.price;
//             }
//         });
//         console.log("unitPrice:"+unitPrice);
//           this.price=unitPrice*this.quantity;
//           this.discount=this.calcDiscountAmount(this.price);
//           this.amount=this.price-this.discount;
//         if(this.delivery==true && this.amount<this.storageProvider.shopInfo.freeDelivery){
//                 this.delivery=false;
//                 this.takeout=false;
//                 this.here=true;
//         }
//     }      
//   }

  closePage(event){
      console.log("close Order Page");
      //this.navController.pop();
     // this.app.getRootNav(); 
     this.app.getRootNav().pop();
  }

  collapse($event){
     //console.log("collpase");
     this.userNotiHidden=true;
  }

  expand($event){
     //console.log("expand");
     this.userNotiHidden=false;
  }

    // hasChoice(option){
    //     //console.log("option:"+option.hasOwnProperty("choice"));
    //     if(option.hasOwnProperty("choice")==true && Array.isArray(option.choice)){
    //         return option.choice.length;
    //     }
    //     return 0;
    // }

    // optionSelect(option){
    //     if(option.select!=undefined)
    //         option.flag=true;    
    // }
/*
     onFocusPassword(event){
         if(!this.storageProvider.isAndroid){
            console.log("onFocusPassword");
            let dimensions = this.orderPageRef.getContentDimensions();
            console.log("dimensions:"+JSON.stringify(dimensions));
            this.orderPageRef.scrollTo(0, dimensions.contentHeight);
         }
    }
*/

    searchCoupon(){
        console.log("searchCoupon func start");

        this.navController.push(SearchCouponPage,{takitId:this.takitId, 
                                                  menuNO:this.menu.menuNO,
                                                  categoryNO:this.menu.categoryNO});

        //searchCoupon눌렀을때는 새창 뜨고 자동 검색 된 후, 다운로드 가능해야함.


    }
}

