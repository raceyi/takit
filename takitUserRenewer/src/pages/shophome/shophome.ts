
import {Component,ViewChild, trigger, state, style, transition, animate, keyframes} from '@angular/core';
import {NavController,NavParams,Content,Segment,AlertController, Slides} from 'ionic-angular';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {StorageProvider} from '../../providers/storageProvider';
import {OrderPage} from '../order/order';
import {App} from 'ionic-angular';
//import {TabsPage} from '../tabs/tabs';
import {ServerProvider} from '../../providers/serverProvider';
import {ShopAboutPage} from '../shop-about/shop-about';
import {ShopCartPage} from '../shopcart/shopcart';
import {OldOrderPage} from '../old-order/old-order';
import {MenuDetailPage} from '../menu-detail/menu-detail';

@Component({
  selector:'page-shophome',  
  templateUrl: 'shophome.html',
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
 // @ViewChild('segmentBar') segmentBarRef: Content;
 // @ViewChild('menusContent') menusContentRef: Content;
 // @ViewChild('recommendation') recommendationRef: Content;
 // @ViewChild('categorySegment') categorySegmentRef: Segment;
@ViewChild('shophomeContent') shophomeContentRef:Content;
@ViewChild('BestMenusSlides') slides: Slides;
  shopName:string;
  shopPhoneHref:string;

  categorySelected:number=1;
  categories=[];

  //isAndroid: boolean = false;
  takitId:string;

  shop;

  dummyMenuRows:number=0; // Just for android version less than 5.0
  nowMenus=[];

  recommendMenuNum:number;
  recommendMenu=[];

  todayMenuHideFlag=true;
  //minVersion:boolean=false;
  menuSlideUp:boolean=false;
  slideUpState:String='down';
  slideDownState:String='up';
  slideStyle={};

  testSelected="1";

  bestMenus;

  constructor(private app:App, private navController: NavController
      ,private storageProvider:StorageProvider,private navParams:NavParams
      ,private alertController:AlertController,private serverProvider:ServerProvider) {
          console.log("ShopHomePage");
          console.log("param(takitId):"+navParams.get("takitId"));
          //Any other way to pass takitId into ShopHome page?
            this.storageProvider.takitId=navParams.get("takitId");
            this.bestMenus=navParams.get('bestMenus');
            if(!this.bestMenus){ //this.bestMenu !== null or undefined
                this.bestMenus = [];
            }

            console.log("bestMenus:"+this.bestMenus);
            
  }

  ionViewDidEnter(){ // Be careful that it should be DidEnter not Load 
      console.log("shophomePage - ionViewDidEnter"); 
        if(this.takitId==undefined){
          this.takitId=this.storageProvider.takitId;
          this.loadShopInfo();
          this.shophomeContentRef.resize();
        }
        this.storageProvider.orderPageEntered=false;
  }

//   ionViewWillUnload(){
//        console.log("ionViewWillUnload-ShopTabsPage.. "+JSON.stringify(this.storageProvider.shoplistCandidate));
//        this.storageProvider.shoplistSet(this.storageProvider.shoplistCandidate);
//   }

   showShopAbout(){
    this.navController.push(ShopAboutPage, {},{animate:true,animation: 'slide-up', direction: 'forward' });
  }
  
  configureShopInfo(){
    // hum=> construct this.categoryRows
    this.shop.categories.forEach(category => {
        let menus=[];
        console.log("[configureShopInfo]this.shop:"+this.shop);
        this.shop.menus.forEach(menu=>{
            //console.log("menu.no:"+menu.menuNO+" index:"+menu.menuNO.indexOf(';'));
            let no:string=menu.menuNO.substr(menu.menuNO.indexOf(';')+1);
            //console.log("category.category_no:"+category.categoryNO+" no:"+no);
            if(no==category.categoryNO){
                menu.filename=encodeURI(this.storageProvider.awsS3+menu.imagePath);
                menu.categoryNO=no;
                //console.log("menu.filename:"+menu.filename);

                let menu_name=menu.menuName.toString();
                //console.log("menu.name:"+menu_name);
                if(navigator.language.startsWith("ko") && menu_name.indexOf("(")>0){
                    //console.log("name has (");
                    menu.menuName = menu_name.substr(0,menu_name.indexOf('('));
                    //console.log("menu.name:"+menu.name);
                    menu.description = menu_name.substr(menu_name.indexOf('('));
                    menu.descriptionHide=false;
                }else{
                    menu.descriptionHide=true;
                }
                console.log("menu:"+JSON.stringify(menu));
                menus.push(menu);
            }
        });

        if(!navigator.language.startsWith("ko") && category.categoryNameEn!=undefined && category.categoryNameEn!=null){
            //console.log("!ko && hasEn");
            this.categories.push({sequence:parseInt(category.sequence),categoryNO:parseInt(category.categoryNO),categoryName:category.categoryNameEn,menus:menus});
        }else // Korean
            this.categories.push({sequence:parseInt(category.sequence),categoryNO:parseInt(category.categoryNO),categoryName:category.categoryName,menus:menus});

        //console.log("[categories]:"+JSON.stringify(this.categories));
        //console.log("menus.length:"+menus.length);
    });
        //console.log("categories len:"+this.categories.length);
     
        this.categorySelected=1; // hum...
        //console.log("menus for 0:"+JSON.stringify(this.menuRows));  
        //////////////////////////////////
        //todayMenus
        if(this.shop.shopInfo.hasOwnProperty("todayMenus"))
        console.log("todayMenus:"+JSON.stringify(this.shop.shopInfo.todayMenus));

        //////////////////////////////////
        // Is it correct location? Just assume that the height of recommendation area.
        //console.log("segmentBar:"+JSON.stringify(this.segmentBarRef.getDimensions()));
        //console.log("recommendation:"+JSON.stringify(this.recommendationRef.getDimensions()));
        /*
        let menusDimensions=this.menusContentRef.getContentDimensions();
        let menusHeight=this.menusContentRef.getNativeElement().parentElement.offsetHeight-menusDimensions.contentTop;
        if(this.shop.shopInfo.hasOwnProperty("todayMenu")){
            menusHeight=menusHeight-(100+20); //100: button height, 20:name,price height
        }
        console.log("pageHeight:"+this.menusContentRef.getNativeElement().parentElement.offsetHeight+"top:"+menusDimensions.contentTop+"menusHeight:"+menusHeight);
        this.menusContentRef.getScrollElement().setAttribute("style","height:"+menusHeight+"px;margin-top:0px;");
        /////////////////////////////////*/
        if(navigator.language.startsWith("ko") && this.shop.shopInfo.hasOwnProperty("notice") && this.shop.shopInfo.notice!=null){
            let alert = this.alertController.create({
                        title: this.shop.shopInfo.notice,
                        buttons: ['OK']
                    });
                    alert.present();
        }

        console.log("categories!!!!!!!!!!!!!!!!info:"+this.categories[0].menus[0].menuName);
        this.nowMenus=this.categories[0].menus;
  }

  loadShopInfo()
  {
        this.categorySelected=1;
        this.categories=[];
        this.recommendMenu=[];

        //var shop=this.storageProvider.shopResponse;

        console.log("[loadShopInfo]this.storageProvider.shopResponse: "+JSON.stringify(this.storageProvider.shopResponse));

        this.shop=this.storageProvider.shopResponse;
        this.shopName=this.shop.shopInfo.shopName;
        
        if(this.storageProvider.shopResponse.shopInfo.hasOwnProperty("shopPhone"))
            this.shopPhoneHref="tel:"+this.shop.shopInfo.shopPhone;

        this.storageProvider.shopInfoSet(this.shop.shopInfo);
        this.configureShopInfo();

        // update shoplist at Serve (takitId,s3key)
        var thisShop:any={takitId:this.takitId , 
                            shopName:this.shop.shopInfo.shopName,
                            s3key: this.shop.shopInfo.imagePath, 
                            discountRate:this.shop.shopInfo.discountRate,
                            visitedTime:new Date()};
        if(this.shop.shopInfo.imagePath.startsWith("takitId/")){

        }else{
            thisShop.filename=this.storageProvider.awsS3+this.shop.shopInfo.imagePath;
        }
        //read shop cart 
        this.storageProvider.loadCart(this.takitId);
        this.storageProvider.shoplistCandidate=this.storageProvider.shoplist;
        this.storageProvider.shoplistCandidateUpdate(thisShop);
        let body = JSON.stringify({shopList:JSON.stringify(this.storageProvider.shoplistCandidate)});
        console.log("!!shopEnter-body:",body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        if(this.storageProvider.tourMode==false){    
            this.serverProvider.post(this.storageProvider.serverAddress+"/shopEnter",body).then((res:any)=>{
                console.log("res.result:"+res.result);
                var result:string=res.result;
                if(result=="success"){

                }else{
                    
                }
            },(err)=>{
                console.log("shopEnter-http post err "+err);
                //Please give user an alert!
                if(err=="NetworkFailure"){
                let alert = this.alertController.create({
                        title: '서버와 통신에 문제가 있습니다',
                        subTitle: '네트웍상태를 확인해 주시기바랍니다',
                        buttons: ['OK']
                    });
                    alert.present();
                }
            });
        }
        /////////////////////////////////
      //this.isAndroid = this.platform.is('android');                        
  }

  categoryChange(sequence){
    console.log("[categoryChange] sequence:"+sequence+" previous:"+this.categorySelected);
    console.log("sequence type:"+typeof sequence+"categorySelected type:"+typeof this.categorySelected)
    // console.log("this.categoryMenuRows.length:"+this.categoryMenuRows.length);
    // if(this.categoryMenuRows.length>0){
        //why do need this length?
        //console.log("change menus");
        this.nowMenus=this.categories[sequence-1].menus;
        //this.categorySelected=sequence; //Please check if this code is correct.
    // }
    this.shophomeContentRef.resize();
/*
        this.shophomeContentRef.getScrollElement().setAttribute("style","height:"+menusHeight+"px;margin-top:0px;margin-bottom:0px");
    console.log("this.menuRows:"+JSON.stringify(this.menuRows));
    console.log("row num :"+this.menuRows.length+" menus:"+JSON.stringify(this.menuRows));
    ///////////////////////////////////////////////////////////////////////////////////////////
    //console.log("segmentBar:"+JSON.stringify(this.segmentBarRef.getDimensions()));
    //console.log("recommendation:"+JSON.stringify(this.recommendationRef.getDimensions()));
    let menusDimensions=this.menusContentRef.getContentDimensions();
    let menusHeight=this.menusContentRef.getNativeElement().parentElement.offsetHeight-menusDimensions.contentTop+100;
    console.log("pageHeight:"+this.menusContentRef.getNativeElement().parentElement.offsetHeight+"top:"+menusDimensions.contentTop+"menusHeight:"+menusHeight);
    this.menusContentRef.getScrollElement().setAttribute("style","height:"+menusHeight+"px;margin-top:0px;margin-bottom:0px");
    //////////////////////////////////////////////////////////*/    

    console.log("categorySelected:"+this.categorySelected);
  }

  menuSelected(menuName){

    if(this.storageProvider.orderPageEntered)
        return;

    console.log("categorySelected:"+this.categorySelected+" menu:"+menuName); 

    var menu;
    for(var i=0;i<this.categories[this.categorySelected-1].menus.length;i++){
         //console.log("menu:"+this.categories[category_no-1].menus[i].menuName);
         if(this.categories[this.categorySelected-1].menus[i].menuName==menuName){
             menu=this.categories[this.categorySelected-1].menus[i];
             //console.log(this.categories[category_no-1].menus[i].options);
            break;
        }
    }
    console.log("menu info:"+JSON.stringify(menu));
    this.navController.push(MenuDetailPage,{menu:menu, shopName:this.shopName});
    this.storageProvider.orderPageEntered=true;
  }

//   swipeCategory(event){
//         console.log("event.direction:"+event.direction+ "categories.length:"+this.categories.length);
//         /*
//         if(this.categories.length>3){
//             let dimensions=this.segmentBarRef.getContentDimensions();
//             if(this.categorySelected>=3 && event.direction==2){ // increase this.categorySelected
//                 console.log("call scrollTo with "+(dimensions.contentWidth/3)*(this.categorySelected-1));
//                 this.segmentBarRef.scrollTo((dimensions.contentWidth/3)*(this.categorySelected-1),0,500);
//             }else if(this.categorySelected>=3 && event.direction==4){ //decrease this.categorySelected
//                  console.log("call scrollTo with "+(dimensions.contentWidth/3)*(this.categorySelected-3));
//                  this.segmentBarRef.scrollTo((dimensions.contentWidth/3)*(this.categorySelected-3),0,500);
//             }    
//         }
//         */
//         if(event.direction==4){ //DIRECTION_LEFT = 2
//             if(this.categorySelected>1){
//                 this.categoryChange(this.categorySelected-1);
//             }
//         }else if(event.direction==2){//DIRECTION_RIGHT = 4
//             if(this.categorySelected < this.categories.length){
//                 this.categoryChange(this.categorySelected+1);
//             }
//         }        
//   }

    hideFlag(flag){
        return flag;
    }

    ionViewWillUnload(){
       //Please update shoplist of storageProvider...
       console.log("ionViewWillUnload-ShopHomePage");
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

  enterOldOrder(){
      this.navController.push(OldOrderPage,{takitId:"세종대@더큰도시락"});
  }

  enterCart(){
    this.navController.push(ShopCartPage);
  }

  back(){      
     this.app.getRootNav().pop();
  }

     
}
