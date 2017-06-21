import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ShopCartPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-shop-cart',
  templateUrl: 'shop-cart.html',
})
export class ShopCartPage {
    cart:any=[{"menuName":"매콤제육도시락","amount":"3000","count":"1"},
              {"menuName":"돈까스도시락","amount":"3500","count":"1"},
              {"menuName":"삼식도시락","amount":"7000","count":"2"}];
    totalAmount:number=0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopCartPage');

  }
  ionViewDidEnter(){
      this.cart.forEach(menu => {
          this.totalAmount += parseInt(menu.amount);
      });
  }

  decreaseCount(menu){
    if(menu.count <= 1){
        menu.count=1;
    }else{
        menu.count--;
    }
    
  }

  increaseCount(menu){
    menu.count++;
  }

}
