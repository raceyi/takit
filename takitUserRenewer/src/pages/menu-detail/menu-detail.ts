import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storageProvider'
import { OrderPage } from '../order/order';

/**
 * Generated class for the MenuDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-menu-detail',
  templateUrl: 'menu-detail.html',
})
export class MenuDetailPage {
    menu:any;
    amount:number;
    options:any;
    shopName:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public storageProvider:StorageProvider, public alertController:AlertController) {
     console.log("param:"+JSON.stringify(navParams.get('menu')));
     this.menu=navParams.get('menu');
     this.shopName=navParams.get('shopName');
     this.amount=this.menu.price;
     this.options=JSON.parse(this.menu.options);
     this.menu.quantity = 1;
     console.log("menu options1:"+this.menu.options);
     console.log("menu options:"+JSON.stringify(this.options));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuDetailPage');
  }

  decreaseCount(menu){
    if(menu.quantity <= 1){
        menu.quantity=1;
    }else{
        menu.quantity--;
    }
    
  }

  increaseCount(menu){
    menu.quantity++;
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

    shopcart(){
        // console.log("orderPage->shopcart");
        // if(this.menu.quantity==undefined){
        //     if(this.platform.is('android'))
        //         this.focusQunatityNum.emit(true); 
        //     else if(this.platform.is('ios')){
        //      //show alert
        //  }      
        // }

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
    this.storageProvider.getCartInfo(this.storageProvider.takitId).then((result:any)=>{
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
                    console.log("options flag "+option.name+":"+"")
                    if(option.select!=undefined)
                        options.push({name:option.name,price:option.price,select:option.select});
                    else
                        options.push({name:option.name,price:option.price});
                }    
            });
        }
        var menuName=this.menu.menuName;
        // if(this.menu.hasOwnProperty("description"))
        //     menuName+=this.menu.description;

        cart.menus.push({menuNO:this.menu.menuNO,
                    menuName:menuName,
                    quantity:this.menu.quantity,
                    options: options,
                    price: this.menu.price,
                    amount: this.menu.price*this.menu.quantity,
                    discountAmount:this.menu.price-Math.round(this.menu.price*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0))
                    });
        cart.total=cart.total+this.menu.price;
        console.log("cart:"+JSON.stringify(cart));
        this.storageProvider.saveCartInfo(this.storageProvider.takitId,JSON.stringify(cart)).then(()=>{
            //this.storageProvider.shopTabRef.select(2);
            this.navCtrl.pop();
        });
    },(err)=>{
        console.log("getCartInfo error");
        // Please show error alert
    });
  }

  enterOrder(){
        this.navCtrl.push(OrderPage,{menu:this.menu, shopName:this.shopName});
  }

}
