import {Component,EventEmitter,ViewChild,ElementRef,NgZone} from '@angular/core';
import {NavController,NavParams,TextInput,Content} from 'ionic-angular';
import {Http,Headers} from '@angular/http';
import {Platform,App,AlertController} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {StorageProvider} from '../../providers/storageProvider';
//import {ServerProvider} from '../../providers/serverProvider';
//import { Keyboard } from '@ionic-native/keyboard';
import {CashPassword} from '../cash-password/cash-password';

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
  quantityInputType:string;

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
  myCoupon:string="1";


  constructor(private app:App,private navController: NavController,
        private navParams:NavParams,private ngZone:NgZone,
        private alertController:AlertController, 
        private platform:Platform,public storageProvider:StorageProvider,) {
      
        //Just for testing
        //this.storageProvider.shopInfo.freeDelivery="0";
        //this.storageProvider.shopInfo.deliveryArea="세종대학교내 예)00관 101호";
        ///////////////////////////////

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
      this.menu=navParams.get("menu");
      this.shopName=navParams.get("shopName");
      console.log("OrderPage-param(menu):"+navParams.get("menu"));
      console.log("OrderPage-param(shopName):"+navParams.get("shopName"));
      var splits=this.menu.menuNO.split(";");
      this.takitId=splits[0];
      console.log("takitId:"+this.takitId);

      this.price=this.menu.price*1;
      this.takitDiscount=Math.round(this.price*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0));
      
      this.amount=this.menu.price*this.menu.quantity
      this.totalDiscount=this.takitDiscount+this.couponDiscount;
      this.totalAmount=this.price-this.totalDiscount; //? 할인된 금액이 만원이 넘어야 하는 것인가?

      if(this.delivery==true && this.amount<this.storageProvider.shopInfo.freeDelivery){
            this.delivery=false;
            this.takeout=false;
            this.here=true;
      }
      console.log(" ["+this.menu.hasOwnProperty("takeout")+"][ "+(this.menu.takeout!=null) +"] ["+ (this.menu.takeout!=false)+"]");
      if(this.menu.hasOwnProperty("takeout") && (this.menu.takeout!=null) && (this.menu.takeout!=false)){ // humm... please add takeout field into all menus...
         this.takeoutAvailable=true;
         this.takeout=false;
      }
      console.log("hum....--1");
      if(this.menu.hasOwnProperty("options") 
      //&& Array.isArray(this.menu.options)
      && this.menu.options!=null && this.menu.options.length>0){
          console.log("hum...-1.1");
          this.hasOptions=true;         
          this.options=JSON.parse(this.menu.options);
          
          this.options.forEach((option)=>{
              if(option.hasOwnProperty("choice") && Array.isArray(option.choice)){
                  option.flag=false;
                  option.flags=[];
                  option.disabled=[];
                  var i;
                  for(i=0;i<option.choice.length;i++){
                      option.flags.push(false);
                      option.disabled.push(false);
                  }
                  if(option.hasOwnProperty("default")){
                      console.log("default:"+option.default);
                        for(i=0;i<option.choice.length;i++){
                            if(option.choice[i]==option.default){
                                    option.flags[i]=true;
                                    option.flag=true;
                            }
                        }
                  }
              }
          });
      }
      console.log("hum....--2");

      this.quantityInputType="select";
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
             let receiptIssueVal;
              if(this.storageProvider.receiptIssue){
                    receiptIssueVal=1;
              }else{
                    receiptIssueVal=0;
              }
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
              let body = {              paymethod:"cash",
                                        takitId:this.takitId,
                                        orderList:JSON.stringify(cart), 
                                        orderName:menuName+"("+this.quantity+")",
                                        amount:this.totalAmount,
                                        takeout: takeout, // takeout:0(inStore) , 1(takeout), 2(delivery) 
                                        deliveryAddress: this.deliveryAddress,
                                        orderedTime:new Date().toISOString(),
                                        cashId: this.storageProvider.cashId,
                                        //password:this.cashPassword,
                                        receiptIssu:receiptIssueVal,
                                        receiptId:this.storageProvider.receiptId,
                                        receiptType:this.storageProvider.receiptType
                         };
              console.log("sendOrder:"+JSON.stringify(body));                          
              let headers = new Headers();
              headers.append('Content-Type', 'application/json');
              console.log("server:"+ this.storageProvider.serverAddress);
              this.navController.push(CashPassword, {body:body,trigger:"order"});
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
           var cart={menus:[],total:0};
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
           var menuName=this.menu.menuName;
           if(this.menu.hasOwnProperty("description"))
                menuName+=this.menu.description;

           cart.menus.push({menuNO:this.menu.menuNO,
                            menuName:menuName,
                            quantity:this.quantity,
                            options: options,
                            price: this.amount});
           cart.total=this.amount;
           
           this.sendSaveOrder(cart,menuName);         
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

  shopcart(){
        console.log("orderPage->shopcart");
        if(this.quantity==undefined){
            if(this.platform.is('android'))
                this.focusQunatityNum.emit(true); 
            else if(this.platform.is('ios')){
             //show alert
         }      
        }

        this.checkOptionValidity().then(()=>{
        this.saveShopcart();
    },(name)=>{
        console.log("option.select is undefined");
        let alert = this.alertController.create({
            subTitle: name+'을 선택해주십시오',
            buttons: ['OK']
        });
        console.log("hum...");
        alert.present().then(()=>{
            console.log("alert done");
            return;
        });
    });

  }

  saveShopcart(){    
    this.cashPassword="";  
    this.storageProvider.getCartInfo(this.takitId).then((result:any)=>{
        var cart;
        if(Array.isArray(result) && result.length==1){
            cart=JSON.parse(result[0].cart);
        }else{
            console.log("no cart info");
            cart={menus:[],total:0};
        }
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
        var menuName=this.menu.menuName;
        if(this.menu.hasOwnProperty("description"))
            menuName+=this.menu.description;

        cart.menus.push({menuNO:this.menu.menuNO,
                    menuName:menuName,
                    quantity:this.quantity,
                    options: options,
                    price: this.menu.price,
                    amount: this.price,
                    discountAmount:this.price-Math.round(this.price*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0)),
                    takeout:this.takeoutAvailable});
        cart.total=cart.total+this.price;
        console.log("cart:"+JSON.stringify(cart));
        this.storageProvider.saveCartInfo(this.takitId,JSON.stringify(cart)).then(()=>{
            this.storageProvider.shopTabRef.select(2);
            this.navController.pop()
        });
    },(err)=>{
        console.log("getCartInfo error");
        // Please show error alert
    });
  }

 ionViewWillEnter(){
     //console.log("orderPage-ionViewWillEnter");
     
     if(this.hasOptions==false){
        //console.log(".."+this.optionDivElementRef.nativeElement.style.border);
        this.optionDivElementRef.nativeElement.style.border="none";
     }
     if(this.takeoutAvailable==false){
        //console.log(".."+this.takeoutDivElementRef.nativeElement.style.border);
        this.takeoutDivElementRef.nativeElement.style.border="none";
     }
 }


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

  computeAmount(option){
      console.log("[computeAmount]flag:"+option.flag);
      if(option.flag==true){
          this.price=this.price+option.price*this.quantity;    
      }else{
          this.price=this.price-option.price*this.quantity;
          console.log("option.select:"+option.select);
          if(option.hasOwnProperty("choice")){
              option.select=undefined;
              console.log("set false to choice flags");              
                var i;
                for(i=0;i<option.flags.length;i++){
                        //console.log("choice:"+option.choice[i]+"flags:"+option.flags[i]);
                        option.flags[i]=false;
                }
          }
      }
      this.discount=Math.round(this.price*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0));
      this.amount=this.price-this.discount;
      if(this.delivery==true && this.amount<this.storageProvider.shopInfo.freeDelivery){
            this.delivery=false;
            this.takeout=false;
            this.here=true;
      }
  }

    choiceChange(option,idx,flag){
        var prevOptionFlag=option.flag;
        console.log("prevOptionFlag:"+prevOptionFlag);
        this.ngZone.run(()=>{
            if(flag==true && Array.isArray(option.flags)){
                option.select=option.choice[idx];
                option.flag=true;
                if(prevOptionFlag==false){
                    console.log("compute amount again(add)");
                    this.computeAmount(option);
                }
                // other flags become false
                let i;
                for(i=0;i<option.flags.length;i++){
                    if(i!=idx){
                        option.flags[i]=false;
                    }else{
                        option.flags[i]=true;
                    }
                }
            }else{
                option.select=undefined;
                let i;
                for(i=0;i<option.flags.length;i++){
                    if(option.flags[i]==true)
                        break;
                }
                if(i==option.flags.length){
                    option.flag=false;
                    if(prevOptionFlag==true){
                        this.computeAmount(option);            
                        console.log("compute amount again(remove)");
                    }
                }

            }
        });
    }

  optionChange(option){
      console.log("flag:"+option.flag);
      if(option.flag==true){
          this.price=this.price+option.price*this.quantity;    
      }else{
          this.price=this.price-option.price*this.quantity;
          console.log("option.select:"+option.select);
      }
      this.discount=Math.round(this.price*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0));
      this.amount=this.price-this.discount;
      if(this.delivery==true && this.amount<this.storageProvider.shopInfo.freeDelivery){
            this.delivery=false;
            this.takeout=false;
            this.here=true;
      }

  }

  quantityInput(flag){
    // console.log("flag:"+flag+" quantityInputType:"+this.quantityInputType);
     if(flag){ // number selection
        if(this.quantityInputType=="select"){
          return false;
        }else  
          return true;   
     }else{ //text input
        if(this.quantityInputType=="select"){
          return true;
        }else{
          return false;   
        }
     }
   }

  onBlur($event){
      console.log("onBlur this.quantity:"+this.quantity);
    if(this.quantity==undefined || this.quantity==0 || this.quantity.toString().length==0){
        this.focusQunatityNum.emit(true);  
        /*
           let alert = this.alertController.create({
                    title: '수량을 입력해주시기바랍니다.',
                    buttons: ['OK']
                    });
                    alert.present().then(()=>{
                        console.log("alert done");
                        //this.focusQunatityNum.emit(true);  
                    });
           */         
    }else{
        var unitPrice=this.menu.price;
        this.options.forEach(option=>{
            if(option.flag){
                unitPrice+=option.price;
            }
        });
        console.log("unitPrice:"+unitPrice);
          this.price=unitPrice*this.quantity;
          this.discount=Math.round(this.price*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0));
          this.amount=this.price-this.discount;
        if(this.delivery==true && this.amount<this.storageProvider.shopInfo.freeDelivery){
                this.delivery=false;
                this.takeout=false;
                this.here=true;
        }
    }      
  }

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

    hasChoice(option){
        //console.log("option:"+option.hasOwnProperty("choice"));
        if(option.hasOwnProperty("choice")==true && Array.isArray(option.choice)){
            return option.choice.length;
        }
        return 0;
    }

    optionSelect(option){
        if(option.select!=undefined)
            option.flag=true;    
    }
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
    }
}

