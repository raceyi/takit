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
    amount:number;  //price*quantity+option-discount ..
    options:any;
    shopName:string;
    choice; 
    discount:number=0;
    discountPrice:number=0; //when only 1 quantity selected dicounting amount
    optionAmount:number=0;  // 
    // 갯수가 올라간 상태에서 option을 선택했을 경우 -> option이 선택될 때 그 갯수 만큼 가격이 더해져야함.
    // option이 선택된 상태에서 갯수가 올라간 경우  -> 갯수가 올라갈 때 option 가격도 *갯수 만큼 올라가야 함.
    //option이 선택된 상태에서 갯수가 적어진 경우 -> 갯수가 내려갈 때 option 가격도 *갯수 만큼 내려가야 함.


  constructor(public navCtrl: NavController, public navParams: NavParams,
              public storageProvider:StorageProvider, public alertController:AlertController) {
     console.log("param:"+JSON.stringify(navParams.get('menu')));
     this.menu=navParams.get('menu');
     this.shopName=navParams.get('shopName');
     this.discount = this.calcDiscountAmount(this.menu.price);
     this.amount = this.discountPrice=this.menu.price-this.discount;
     console.log("options:"+this.menu.options);
     console.log("options type:"+typeof this.menu.options);

     console.log("2");
     this.menu.quantity = 1;
     

     if(this.menu.options){
          console.log("hum...-1.1");
          //this.hasOptions=true; 
          
          if(typeof this.menu.options ==="string"){
            this.options=JSON.parse(this.menu.options);
          }else{
            this.options=this.menu.options;
          }
          
          this.options.forEach((option)=>{
              option.flag=false;
              if(option.hasOwnProperty("choice") && Array.isArray(option.choice)){
                //   option.choiceFlags=[];
                //   //option.disabled=[];
                  
                //   for(let i=0;i<option.choice.length;i++){
                //       option.choiceFlags.push(false);
                //     //  option.disabled.push(false);
                //   }

                  if(option.hasOwnProperty("default")){
                      console.log("default:"+option.default);
                        for(let i=0;i<option.choice.length;i++){
                            if(option.choice[i]==option.default){
                                    option.flag=true;
                            }
                        }
                  }
              }
          });
      }

      console.log("menu options1:"+this.menu.options);
     console.log("menu options:"+JSON.stringify(this.options));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuDetailPage');
  }

  calcDiscountAmount(price){
      return Math.round(price*(parseFloat(this.storageProvider.shopInfo.discountRate)/100.0));
  }

  decreaseQuantity(menu){
    if(menu.quantity <= 1){
        console.log("decreaseQuantity <=1 :"+menu.quantity);
        menu.quantity=1;
        this.amount = this.discountPrice*menu.quantity;
        this.options.forEach(option => {
            if(option.flag===true){
                console.log("option.flag true");
                this.amount+=(option.price-this.calcDiscountAmount(option.price))*menu.quantity;
            }
        });        
    }else{
        console.log("decreaseQuantity > 1 :"+menu.quantity);
        menu.quantity--;
        this.amount = this.discountPrice*menu.quantity;
        this.options.forEach(option => {
            if(option.flag===true){
                this.amount+=(option.price-this.calcDiscountAmount(option.price))*menu.quantity;
            }
        });
    }
    
  }

  increaseQuantity(menu){
              console.log("increaseQuantity :"+menu.quantity);

    menu.quantity++;
    this.amount = this.discountPrice*menu.quantity;
    this.options.forEach(option => {
        if(option.flag===true){
            console.log("option.flag true");
            console.log((option.price-this.calcDiscountAmount(option.price))*menu.quantity)
            this.amount+=(option.price-this.calcDiscountAmount(option.price))*menu.quantity;
        }
    });
  }

  checkOptionValidity(){
     return new Promise((resolve, reject)=>{
            var i;
            console.log("options:"+JSON.stringify(this.options));
            if(this.options!=undefined && this.options!=null && Array.isArray(this.options)){
                for(i=0;i<this.options.length;i++){
                        var option=this.options[i];
                        if(option.hasOwnProperty("choice") && option.flag){
                            console.log("option.selectedChoice:"+option.default);
                            
                            if(option.default === undefined || option.default === null){
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
                    amount: this.menu.price*this.menu.quantity
                    });
        cart.total=parseInt(cart.total)+this.amount;
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

  changeOption(option){
    //   if(flag && )

    console.log("flag:"+option.flag);
      if(option.flag===true){

          this.amount+= (option.price-this.calcDiscountAmount(option.price))*this.menu.quantity;
      }else{
          this.amount-= (option.price-this.calcDiscountAmount(option.price))*this.menu.quantity;
      }
  }

  enterOrder(){
        this.menu.options=this.options;
        
        this.navCtrl.push(OrderPage,{menu:this.menu,
                                    shopName:this.shopName,
                                    trigger:"order"});
  }



}
