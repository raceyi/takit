import { Component, NgZone, ViewChild ,trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { NavController, NavParams, Slides ,App} from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import { ShopAboutPage } from '../shop-about/shop-about';
import { Content } from 'ionic-angular';

import { OldOrderPage } from '../old-order/old-order';
import { MenuDetailPage } from '../menu-detail/menu-detail';
import { ShopCartPage } from '../shop-cart/shop-cart';
/*
  Generated class for the ShopHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-shop-home',
  templateUrl: 'shop-home.html',
  animations: [
    trigger('slideUp', [
      state('down', style({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)' // x,y,z
      })),
      state('up', style({
        opacity: 1,
        transform: 'translate3d(0, -60vh, 0)'
      })),
      transition('down => up', animate('200ms')),
      transition('up => down', animate('200ms'))
    ])
  ]
})
export class ShopHomePage {
    @ViewChild('BestMenusSlides') slides: Slides;
    @ViewChild('ShopHomeContent') content: Content;
    pos:String='-60vh';

    menuSlideUp:boolean=false;
    slideUpState:String='down';
    slideDownState:String='up';
    nowCategory;

    shopInfo = [{"takitId":"세종대@더큰도시락","shopName":"더큰도시락", "serviceType":"도시락 / 한식"},
             {"takitId":"세종대@HandelandGretel","shopName":"헨델엔그레텔", "serviceType":"커피 / 디저트"},
            {"takitId":"세종대@Pandorothy","shopName":"팬도로시", "serviceType":"커피 / 디저트"},
            {"takitId":"ORDER@GAROSU","shopName":"가로수그늘아래", "serviceType":"커피 / 음료 / 차"}];

    //이미지 찾기
    bestMenus = [{"menuName":"수제등심돈까스", "price":"5500", "imagePath":"세종대@더큰도시락;1_수제등심돈까스"},
                  {"menuName":"대왕참치마요", "price":"3500", "imagePath":"세종대@더큰도시락;3_대왕참치마요"},
                  {"menuName":"삼식스페셜", "price":"3500", "imagePath":"세종대@더큰도시락;9_삼식스페셜"},
                  {"menuName":"매콤규동", "price":"3500", "imagePath":"세종대@더큰도시락;13_매콤규동"}];

                //   {"takitId":"세종대@HandelandGretel", "menus":[{"menuName":"수제등심돈까스", "price":"5500", "imagePath":"세종대@더큰도시락;1_수제등심돈까스"},
                //   {"menuName":"대왕참치마요", "price":"3500", "imagePath":"세종대@더큰도시락;3_대왕참치마요"},
                //   {"menuName":"삼식스페셜", "price":"3500", "imagePath":"세종대@더큰도시락;9_삼식스페셜"},
                //   {"menuName":"매콤규동", "price":"3500", "imagePath":"세종대@더큰도시락;13_매콤규동"}]},
                  
                //   {"takitId":"세종대@Pandorothy", "menus":[{"menuName":"수제등심돈까스", "price":"5500", "imagePath":"세종대@더큰도시락;1_수제등심돈까스"},
                //   {"menuName":"대왕참치마요", "price":"3500", "imagePath":"세종대@더큰도시락;3_대왕참치마요"},
                //   {"menuName":"삼식스페셜", "price":"3500", "imagePath":"세종대@더큰도시락;9_삼식스페셜"},
                //   {"menuName":"매콤규동", "price":"3500", "imagePath":"세종대@더큰도시락;13_매콤규동"}]},
                  
                //   {"takitId":"ORDER@GAROSU", "menus":[{"menuName":"수제등심돈까스", "price":"5500", "imagePath":"세종대@더큰도시락;1_수제등심돈까스"},
                //   {"menuName":"대왕참치마요", "price":"3500", "imagePath":"세종대@더큰도시락;3_대왕참치마요"},
                //   {"menuName":"삼식스페셜", "price":"3500", "imagePath":"세종대@더큰도시락;9_삼식스페셜"},
                //   {"menuName":"매콤규동", "price":"3500", "imagePath":"세종대@더큰도시락;13_매콤규동"}]}]

    categories=[{"takitId":"세종대@더큰도시락","categoryNO":"1","categoryName":"정식도시락","categoryNameEn":"Basic",sequence:1 ,menus:[]},
                {"takitId":"세종대@더큰도시락","categoryNO":"2","categoryName":"실속도시락","categoryNameEn":"Couple ",sequence:2,menus:[]},
                {"takitId":"세종대@더큰도시락","categoryNO":"3","categoryName":"마요도시락","categoryNameEn":"Mayo ",sequence:3,menus:[]},
                {"takitId":"세종대@더큰도시락","categoryNO":"4","categoryName":"반반마요도시락","categoryNameEn":"Mayo combo ",sequence:4,menus:[]},
                {"takitId":"세종대@더큰도시락","categoryNO":"5","categoryName":"매콤마요도시락","categoryNameEn":"Spicy mayo ",sequence:5,menus:[]},
                {"takitId":"세종대@더큰도시락","categoryNO":"6","categoryName":"덮밥도시락","categoryNameEn":"Rice ",sequence:6,menus:[]},
                {"takitId":"세종대@더큰도시락","categoryNO":"7","categoryName":"볶음밥도시락","categoryNameEn":"Fried rice ",sequence:7,menus:[]},
                {"takitId":"세종대@더큰도시락","categoryNO":"8","categoryName":"특선도시락","categoryNameEn":"Luxury ",sequence:8,menus:[]},
                {"takitId":"세종대@더큰도시락","categoryNO":"9","categoryName":"스페셜도시락","categoryNameEn":"Special ",sequence:9,menus:[]},
                {"takitId":"세종대@더큰도시락","categoryNO":"10","categoryName":"비빔밥도시락","categoryNameEn":"Bibimbap",sequence:10,menus:[]},
                {"takitId":"세종대@더큰도시락","categoryNO":"11","categoryName":"카레도시락","categoryNameEn":"Curry ",sequence:11,menus:[]},
                {"takitId":"세종대@더큰도시락","categoryNO":"12","categoryName":"돈부리시리즈","categoryNameEn":"Donburi",sequence:12,menus:[]},
                {"takitId":"세종대@더큰도시락","categoryNO":"13","categoryName":"얼큰한 국물","categoryNameEn":"Spicy Soup",sequence:13,menus:[]},
                {"takitId":"세종대@더큰도시락","categoryNO":"14","categoryName":"이색BOX","categoryNameEn":"Fried food",sequence:14,menus:[]},
                {"takitId":"세종대@더큰도시락","categoryNO":"15","categoryName":"분식","categoryNameEn":"Snack bar",sequence:15,menus:[]},
                {"takitId":"세종대@더큰도시락","categoryNO":"16","categoryName":"사이드메뉴","categoryNameEn":"Side",sequence:16,menus:[]}];

    menus=[{"menuNO":"세종대@더큰도시락;1","menuName":"데리치킨도시락","explanation":"","price":"3600","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;1_데리치킨도시락","requiredTime":null,"menuNameEn":"Teriyaki chicken ","explanationEn":"chicken","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"},
            {"menuNO":"세종대@더큰도시락;1","menuName":"돈까스도시락","explanation":"","price":"3400","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;1_돈까스도시락","requiredTime":null,"menuNameEn":"Katsu ","explanationEn":"pork","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"},
            {"menuNO":"세종대@더큰도시락;1","menuName":"버섯불고기도시락","explanation":"","price":"3800","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;1_버섯불고기도시락","requiredTime":null,"menuNameEn":"Mushroom bulgogi ","explanationEn":"beef","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"},
            {"menuNO":"세종대@더큰도시락;1","menuName":"삼식도시락","explanation":"돈까스, 치킨, 숯불바베큐(돈까스소스)","price":"3700","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;1_삼식도시락","requiredTime":null,"menuNameEn":"Samsik ","explanationEn":"pork, chicken","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"},
            {"menuNO":"세종대@더큰도시락;1","menuName":"삼치도시락","explanation":"","price":"3800","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;1_삼치도시락","requiredTime":null,"menuNameEn":"Cero ","explanationEn":"cero","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"},
            {"menuNO":"세종대@더큰도시락;1","menuName":"양념치킨도시락","explanation":"","price":"3400","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;1_양념치킨도시락","requiredTime":null,"menuNameEn":"Spicy fried chicken ","explanationEn":"chicken","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"},
            {"menuNO":"세종대@더큰도시락;1","menuName":"제육볶음도시락","explanation":"","price":"3200","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;1_제육볶음도시락","requiredTime":null,"menuNameEn":"Spicy pork ","explanationEn":"pork","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"},
            {"menuNO":"세종대@더큰도시락;1","menuName":"치킨도시락","explanation":"","price":"3300","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;1_치킨도시락","requiredTime":null,"menuNameEn":"Fried chicken ","explanationEn":"chicken","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"},
            {"menuNO":"세종대@더큰도시락;1","menuName":"칠리탕수육도시락","explanation":"칠리소스(매콤한맛)","price":"3300","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;1_칠리탕수육도시락","requiredTime":null,"menuNameEn":"Chili fried pork ","explanationEn":"pork","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"},
            {"menuNO":"세종대@더큰도시락;1","menuName":"칠리포크도시락","explanation":"돈까스, 탕수육, 숯불바베큐(칠리소스)","price":"3700","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;1_칠리포크도시락","requiredTime":null,"menuNameEn":"Chili pork ","explanationEn":"pork","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"},
            {"menuNO":"세종대@더큰도시락;10","menuName":"버섯불고기비빔밥","explanation":"","price":"3500","options":"[{\"name\":\"밥곱빼기\",\"price\":\"500\"},{\"name\":\"계란후라이\",\"choice\":[\"반숙\",\"완숙\"],\"default\":\"반숙\",\"price\":\"0\"}]","takeout":"1","imagePath":"세종대@더큰도시락;10_버섯불고기비빔밥","requiredTime":null,"menuNameEn":"Mushroom bulgogi","explanationEn":"beef","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"500\"},{\"name\":\"Fried egg type\",\"choice\":[\"sunny side up\",\"over hard\"],\"default\":\"sunny side up\",\"price\":\"0\"}]"},
            {"menuNO":"세종대@더큰도시락;10","menuName":"새콤달콤회덮밥","explanation":"","price":"3500","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;10_새콤달콤회덮밥","requiredTime":null,"menuNameEn":"Raw fish","explanationEn":"fish","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"},
            {"menuNO":"세종대@더큰도시락;10","menuName":"오채참치비빔밥","explanation":"","price":"3500","options":"[{\"name\":\"밥곱빼기\",\"price\":\"500\"},{\"name\":\"계란후라이\",\"choice\":[\"반숙\",\"완숙\"],\"default\":\"반숙\",\"price\":\"0\"}]","takeout":"1","imagePath":"세종대@더큰도시락;10_오채참치비빔밥","requiredTime":null,"menuNameEn":"Vegetable tuna","explanationEn":"tuna","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"500\"},{\"name\":\"Fried egg type\",\"choice\":[\"sunny side up\",\"over hard\"],\"default\":\"sunny side up\",\"price\":\"0\"}]"},
            {"menuNO":"세종대@더큰도시락;11","menuName":"돈까스카레","explanation":"","price":"3800","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;11_돈까스카레","requiredTime":null,"menuNameEn":"Katsu ","explanationEn":"pork","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"},
            {"menuNO":"세종대@더큰도시락;11","menuName":"치킨카레","explanation":"","price":"3800","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;11_치킨카레","requiredTime":null,"menuNameEn":"Fried chicken ","explanationEn":"chicken, pork","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"},
            {"menuNO":"세종대@더큰도시락;11","menuName":"카레라이스","explanation":"","price":"2900","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;11_카레라이스","requiredTime":null,"menuNameEn":"Basic","explanationEn":"pork","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"},
            {"menuNO":"세종대@더큰도시락;12","menuName":"김치돈까스돈부리덮밥","explanation":"","price":"3500","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;12_김치돈까스돈부리덮밥","requiredTime":null,"menuNameEn":"Kimchi Katsu","explanationEn":"pork, kimchi","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"},
            {"menuNO":"세종대@더큰도시락;12","menuName":"돈까스돈부리덮밥","explanation":"","price":"3300","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;12_돈까스돈부리덮밥","requiredTime":null,"menuNameEn":"Katsu","explanationEn":"pork","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"},
            {"menuNO":"세종대@더큰도시락;12","menuName":"매콤돈까스돈부리덮밥","explanation":"","price":"3500","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;12_매콤돈까스돈부리덮밥","requiredTime":null,"menuNameEn":"Spicy Katsu","explanationEn":"pork","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"},
            {"menuNO":"세종대@더큰도시락;12","menuName":"청양돈까스돈부리덮밥","explanation":"","price":"3500","options":"[{\"name\":\"밥곱빼기\",\"price\":\"200\"}]","takeout":"1","imagePath":"세종대@더큰도시락;12_청양돈까스돈부리덮밥","requiredTime":null,"menuNameEn":"Very spicy katsu","explanationEn":"pork","optionsEn":"[{\"name\":\"Extra rice\",\"price\":\"200\"}]"}];

    slideStyle={};

    categorySelected=1;

  constructor(public navCtrl: NavController, public navParams: NavParams,
                public storageProvider:StorageProvider,private app: App,
               private ngZone:NgZone) {

                        console.log(this.categories[0].categoryName);

                        for(let i=0; i<this.categories.length; i++){
                            this.categories[i].menus=this.menus;
                        }

                        console.log(this.categories);

                }

  ionViewDidEnter() {
    console.log('ionViewDidLoad ShopHomePage');
    this.slides.lockSwipes(true);

  }

  showShopAbout(){
    this.navCtrl.push(ShopAboutPage, {},{animate:true,animation: 'slide-up', direction: 'forward' });
  }


  showLeftBest(){
    console.log("showLeftBest start");
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  showRightBest(){
    console.log("showRightBest start");
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  showBestMenus(){
    console.log("showBestMenus");
  }

  enterOldOrder(){
      this.navCtrl.push(OldOrderPage,{takitId:"세종대@더큰도시락"});
  }

  enterOrder(menu){
      this.navCtrl.push(MenuDetailPage,{menu:menu});
  }

  back(){
     this.app.getRootNav().pop({animate:true,animation: 'md-transition', direction: 'back' });
  }

  clickMenuArea(){
    console.log("clickMenuArea "+this.menuSlideUp);
    if(!this.menuSlideUp){
      this.slideUpState='up'; //up으로 이동하기 
      setTimeout(() => {
         this.menuSlideUp=true;
         console.log("slide up");
       }, 200);     
    }
  }

  slidePressed(){
    console.log("slidePressed "+this.menuSlideUp);
    if(this.menuSlideUp){
      this.menuSlideUp=false;
      this.slideUpState='down';
       setTimeout(() => {
          console.log("slide down");
       }, 200);
    }
  }

  enterCart(){
    this.navCtrl.push(ShopCartPage);
  }

  goHome(){
      this.navCtrl.parent.select(0);
  }
}
