import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { Content } from 'ionic-angular';

import {StorageProvider} from '../../providers/storageProvider';
import { ShopAboutPage } from '../shop-about/shop-about';
import { OldOrderPage } from '../old-order/old-order';
import { OrderPage } from '../order/order';

/*
  Generated class for the ShopHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-shop-home',
  templateUrl: 'shop-home.html'
})
export class ShopHomePage {
    @ViewChild('BestMenusSlides') slides: Slides;
    @ViewChild('ShopHomeContent') content: Content;
    
    shopInfo = [{"takitId":"세종대@더큰도시락","shopName":"더큰도시락", "serviceType":"도시락, 한식"},
             {"takitId":"세종대@HandelandGretel","shopName":"헨델엔그레텔", "serviceType":"커피, 디저트"},
            {"takitId":"세종대@Pandorothy","shopName":"팬도로시", "serviceType":"커피, 디저트"},
            {"takitId":"ORDER@GAROSU","shopName":"가로수그늘아래", "serviceType":"커피, 음료, 차"}];

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

    categories=[{"takitId":"세종대@더큰도시락","categoryNO":"1","categoryName":"정식도시락","categoryNameEn":"Basic"},
                {"takitId":"세종대@더큰도시락","categoryNO":"2","categoryName":"실속도시락","categoryNameEn":"Couple "},
                {"takitId":"세종대@더큰도시락","categoryNO":"3","categoryName":"마요도시락","categoryNameEn":"Mayo "},
                {"takitId":"세종대@더큰도시락","categoryNO":"4","categoryName":"반반마요도시락","categoryNameEn":"Mayo combo "},
                {"takitId":"세종대@더큰도시락","categoryNO":"5","categoryName":"매콤마요도시락","categoryNameEn":"Spicy mayo "},
                {"takitId":"세종대@더큰도시락","categoryNO":"6","categoryName":"덮밥도시락","categoryNameEn":"Rice "},
                {"takitId":"세종대@더큰도시락","categoryNO":"7","categoryName":"볶음밥도시락","categoryNameEn":"Fried rice "},
                {"takitId":"세종대@더큰도시락","categoryNO":"8","categoryName":"특선도시락","categoryNameEn":"Luxury "},
                {"takitId":"세종대@더큰도시락","categoryNO":"9","categoryName":"스페셜도시락","categoryNameEn":"Special "},
                {"takitId":"세종대@더큰도시락","categoryNO":"10","categoryName":"비빔밥도시락","categoryNameEn":"Bibimbap"},
                {"takitId":"세종대@더큰도시락","categoryNO":"11","categoryName":"카레도시락","categoryNameEn":"Curry "},
                {"takitId":"세종대@더큰도시락","categoryNO":"12","categoryName":"돈부리시리즈","categoryNameEn":"Donburi"},
                {"takitId":"세종대@더큰도시락","categoryNO":"13","categoryName":"얼큰한 국물","categoryNameEn":"Spicy Soup"},
                {"takitId":"세종대@더큰도시락","categoryNO":"14","categoryName":"이색BOX","categoryNameEn":"Fried food"},
                {"takitId":"세종대@더큰도시락","categoryNO":"15","categoryName":"분식","categoryNameEn":"Snack bar"},
                {"takitId":"세종대@더큰도시락","categoryNO":"16","categoryName":"사이드메뉴","categoryNameEn":"Side"}];

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
                public storageProvider:StorageProvider) {

                        console.log(this.categories[0].categoryName);

                }

  ionViewDidEnter() {
    console.log('ionViewDidLoad ShopHomePage');
    this.slides.lockSwipes(true);

  }

  showShopAbout(){
    this.navCtrl.push(ShopAboutPage);
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
      this.navCtrl.push(OrderPage,{menu:menu});
  }
}
