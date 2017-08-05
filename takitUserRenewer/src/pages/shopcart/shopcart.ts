import {Component,ViewChild,ElementRef,NgZone} from "@angular/core";
import {NavController,NavParams,Content,AlertController,App} from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import {Http,Headers} from '@angular/http';
//import 'rxjs/add/operator/map';
import {ServerProvider} from '../../providers/serverProvider';
//import { Keyboard } from '@ionic-native/keyboard';
import {CashPassword} from '../cash-password/cash-password';
import { OrderPage } from '../order/order';
//declare var cordova:any;

@Component({
    selector:'page-shopcart',
    templateUrl: 'shopcart.html'
})

export class ShopCartPage{
    @ViewChild('shopcartPage') cartPageRef: Content;
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


     constructor(private app:App,private navController: NavController
                ,public storageProvider:StorageProvider
                ,private alertController:AlertController
                ,private ngZone:NgZone){
	      console.log("ShopCartPage constructor");

        //Just for testing
        //this.storageProvider.shopInfo.freeDelivery="0";
        //this.storageProvider.shopInfo.deliveryArea="세종대학교내 예)00관 101호";
        ///////////////////////////////

        this.shopname=this.storageProvider.currentShopname();
        this.cart=this.storageProvider.cart;

        // if(this.storageProvider.receiptIssue){
        //     this.receiptIdMask=this.storageProvider.receiptId.substr(0,3)+"****"+this.storageProvider.receiptId.substr(7,this.storageProvider.receiptId.length-7);
        //     console.log("recpitIdMask:"+this.receiptIdMask);
        // }
        // if(this.storageProvider.shopResponse.shopInfo.hasOwnProperty("shopPhone"))
        //     this.shopPhoneHref="tel:"+this.storageProvider.shopResponse.shopInfo.shopPhone;

        if(this.cart!=undefined){
            //this.price=parseInt(this.cart.total);
            //this.discount=Math.round(this.cart.total*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0));
            this.amount=parseInt(this.cart.total);
            if(this.delivery==true && this.amount<this.storageProvider.shopInfo.freeDelivery){
                this.delivery=false;
                this.takeout=false;
                this.here=true;
            }
        }

        //console.log(this.totalAmount);
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

    


    ionViewWillEnter(){
        //console.log("shopcartPage-ionViewWillEnter");
        
    }

    calcDiscountAmount(price){
      return Math.round(price*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0));
    }

     emptyCart(){
        //console.log("return "+(this.cart.menus==undefined || this.cart.menus.length==0));
        return(this.cart.menus==undefined || this.cart.menus.length==0);
     }

     nonEmptyCart(){
       return(this.cart.menus!=undefined && this.cart.menus.length>0);
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
      cart.total-=(menu.price-this.calcDiscountAmount(menu.price))*menu.quantity;
      menu.options.forEach(option => {
          cart.total-=(option.price-this.calcDiscountAmount(option.price))*menu.quantity;
      });    
      var index = cart.menus.indexOf(menu);
      if(index!=-1){
          cart.menus.splice(index, 1); //removes 1 element from index
      }
      this.storageProvider.saveCartInfo(this.storageProvider.takitId,JSON.stringify(cart)).then(()=>{
          this.cart=this.storageProvider.cart;
        //   this.price=this.cart.total;
        //   this.discount=Math.round(this.cart.total*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0));
          this.amount=this.cart.total;
          if(this.delivery==true && this.amount<this.storageProvider.shopInfo.freeDelivery){
                this.delivery=false;
                this.takeout=false;
                this.here=true;
          }
      });
      //this.checkTakeoutAvailable();
    }

    deleteAll(){
      var cart={menus:[],total:0};
      this.storageProvider.saveCartInfo(this.storageProvider.takitId,JSON.stringify(cart)).then(()=>{
          this.cart=this.storageProvider.cart;
          //this.price=this.cart.total;
          this.discount=Math.round(this.cart.total*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0));
          this.amount=this.cart.total;
          if(this.delivery==true && this.amount<this.storageProvider.shopInfo.freeDelivery){
                this.delivery=false;
                this.takeout=false;
                this.here=true;
          }
      });
    }

    decreaseCount(menu){
        if(menu.quantity <= 1){
            menu.quantity=1;
        }else{
            menu.quantity--;
            this.amount -= (menu.price-this.calcDiscountAmount(menu.price));
            menu.options.forEach(option => {
                if(option.flag===true){
                    console.log("option.flag true");
                    this.amount-= (option.price-this.calcDiscountAmount(option.price));
                }
            });        
        }
        
    }

    increaseCount(menu){
        menu.quantity++;
        this.amount += (menu.price-this.calcDiscountAmount(menu.price))
        menu.options.forEach(option => {
            if(option.flag===true){
                console.log("option.flag true");
                this.amount+=(option.price-this.calcDiscountAmount(option.price));
            }
        });    
    }


    enterOrder(){        
        this.cart.total = this.amount;
        this.navController.push(OrderPage,{cart:this.cart,
                                    shopName:this.storageProvider.shopInfo.shopName,
                                    trigger:"cart"});
    }


}
