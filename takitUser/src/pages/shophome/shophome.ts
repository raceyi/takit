
import {Component,ViewChild} from '@angular/core';
import {Platform,NavController,NavParams,Content,Segment,AlertController} from 'ionic-angular';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {StorageProvider} from '../../providers/storageProvider';
import {OrderPage} from '../order/order';
import {App} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {Device} from 'ionic-native';
import {ServerProvider} from '../../providers/serverProvider';

@Component({
  selector:'page-shophome',  
  templateUrl: 'shophome.html'
})
export class ShopHomePage {
 // @ViewChild('segmentBar') segmentBarRef: Content;
 // @ViewChild('menusContent') menusContentRef: Content;
 // @ViewChild('recommendation') recommendationRef: Content;
 // @ViewChild('categorySegment') categorySegmentRef: Segment;
@ViewChild('shophomeContent') shophomeContentRef:Content;
  shopname:string;
  shopPhoneHref:string;

  categorySelected:number=1;
  categories=[];

  //isAndroid: boolean = false;
  takitId:string;

  shop;
  categoryRows=[];

  menuRows=[];
  categoryMenuRows=[];
  dummyMenuRows:number=0; // Just for android version less than 5.0

  recommendMenuNum:number;
  recommendMenu=[];

  todayMenuHideFlag=true;
  //minVersion:boolean=false;

  constructor(private app:App, private platform: Platform, private navController: NavController
      ,private navParams: NavParams,private http:Http,private storageProvider:StorageProvider
      ,private alertController:AlertController,private serverProvider:ServerProvider) {
          console.log("ShopHomePage");
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
  
  configureShopInfo(){
    // hum=> construct this.categoryRows
    this.shop.categories.forEach(category => {
        var menus=[];
        console.log("[configureShopInfo]this.shop:"+this.shop);
        this.shop.menus.forEach(menu=>{
                //console.log("menu.no:"+menu.menuNO+" index:"+menu.menuNO.indexOf(';'));
                var no:string=menu.menuNO.substr(menu.menuNO.indexOf(';')+1);
                //console.log("category.category_no:"+category.categoryNO+" no:"+no);
                if(no==category.categoryNO){
                    menu.filename=encodeURI(this.storageProvider.awsS3+menu.imagePath);
                    menu.category_no=no;
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
            this.categories.push({no:parseInt(category.categoryNO),name:category.categoryNameEn,menus:menus});
        }else // Korean
            this.categories.push({no:parseInt(category.categoryNO),name:category.categoryName,menus:menus});

        //console.log("[categories]:"+JSON.stringify(this.categories));
        //console.log("menus.length:"+menus.length);
        });
        //console.log("categories len:"+this.categories.length);
        this.categories.forEach(category => {
        //console.log("category:"+JSON.stringify(category));
        var menuRows=[];
        for(var i=0;i<category.menus.length;){
            var menus=[];
            for(var j=0;j<this.storageProvider.menusInRow && i<category.menus.length;j++,i++){
                //console.log("menus[i]:"+JSON.stringify(category.menus[i]));
                var menu=category.menus[i];
                if( !navigator.language.startsWith("ko")){
                    if(menu.menuNameEn!=undefined && menu.menuNameEn!=null){
                        menu.menuName=menu.menuNameEn;
                        if(menu.menuNameEn.indexOf("(")>0){
                            //console.log("name has (");
                            menu.menuName = menu.menuNameEn.substr(0,menu.menuNameEn.indexOf('('));
                            //console.log("menu.name:"+menu.name);
                            menu.description = menu.menuNameEn.substr(menu.menuNameEn.indexOf('('));
                            menu.descriptionHide=false;
                        }else{
                            menu.descriptionHide=true;
                        }
                    }
                    if(menu.explanationEn!=undefined && menu.explanationEn!=null){    
                        menu.explanation=menu.explanationEn;
                        if(this.storageProvider.tourMode && menu.explanation.trim().length>0){
                            var foods:string[]=menu.explanation.toString().split(",");
                            console.log(menu.menuName+" foods"+JSON.stringify(foods));
                            foods.forEach(food=>{    
                                console.log("food:"+food.trim()+" avoids:"+JSON.stringify(this.storageProvider.avoids));
                                if(this.storageProvider.avoids.indexOf(food.trim())>=0){
                                        menu.hide=true;
                                }
                            });
                        }  
                    }
                    if(menu.optionsEn!=undefined &&menu.optionsEn!=null)       
                        menu.options=menu.optionsEn;
                        
                }
                menus.push(menu);
            }
            menuRows.push({menus:menus});
        }
        this.categoryMenuRows.push(menuRows);                        
        });

        var rowNum:number=0;
        for(rowNum=0;(rowNum+1)*3<=this.categories.length;rowNum++)
            this.categoryRows.push([this.categories[rowNum*3],this.categories[rowNum*3+1],this.categories[rowNum*3+2]]);
        if(this.categories.length%3==1){
            this.categoryRows.push([this.categories[(rowNum)*3]]);
        }    
        if(this.categories.length%3==2){
            this.categoryRows.push([this.categories[(rowNum)*3],this.categories[(rowNum)*3+1]]);
        }    

        this.menuRows=this.categoryMenuRows[0];
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
        
  }

  loadShopInfo()
  {
        this.categorySelected=1;
        this.categories=[];
        this.menuRows=[];
        this.categoryMenuRows=[];
        this.recommendMenu=[];

        //var shop=this.storageProvider.shopResponse;

        console.log("[loadShopInfo]this.storageProvider.shopResponse: "+JSON.stringify(this.storageProvider.shopResponse));

        this.shop=this.storageProvider.shopResponse;
        this.shopname=this.shop.shopInfo.shopName;
        
        if(this.storageProvider.shopResponse.shopInfo.hasOwnProperty("shopPhone"))
            this.shopPhoneHref="tel:"+this.shop.shopInfo.shopPhone;

        this.storageProvider.shopInfoSet(this.shop.shopInfo);
        this.configureShopInfo();

        // update shoplist at Serve (takitId,s3key)
        var thisShop:any={takitId:this.takitId ,s3key: this.shop.shopInfo.imagePath, discountRate:this.shop.shopInfo.discountRate};
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

  categoryChange(category_no){
    console.log("[categoryChange] categorySelected:"+category_no+" previous:"+this.categorySelected);
    console.log("this.categoryMenuRows.length:"+this.categoryMenuRows.length);
    if(this.categoryMenuRows.length>0){
        //console.log("change menus");
        this.menuRows=this.categoryMenuRows[category_no-1];
        this.categorySelected=category_no; //Please check if this code is correct.
    }
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
  }

  menuSelected(category_no,menu_name){

    if(this.storageProvider.orderPageEntered)
        return;

    console.log("category:"+category_no+" menu:"+menu_name); 
    var menu;
    for(var i=0;i<this.categories[category_no-1].menus.length;i++){
         //console.log("menu:"+this.categories[category_no-1].menus[i].menuName);
         if(this.categories[category_no-1].menus[i].menuName==menu_name){
             menu=this.categories[category_no-1].menus[i];
            break;
        }
    }
    console.log("menu info:"+JSON.stringify(menu));
    this.app.getRootNav().push(OrderPage,{menu:JSON.stringify(menu), shopname:this.shopname});
    this.storageProvider.orderPageEntered=true;
  }

  swipeCategory(event){
        console.log("event.direction:"+event.direction+ "categories.length:"+this.categories.length);
        /*
        if(this.categories.length>3){
            let dimensions=this.segmentBarRef.getContentDimensions();
            if(this.categorySelected>=3 && event.direction==2){ // increase this.categorySelected
                console.log("call scrollTo with "+(dimensions.contentWidth/3)*(this.categorySelected-1));
                this.segmentBarRef.scrollTo((dimensions.contentWidth/3)*(this.categorySelected-1),0,500);
            }else if(this.categorySelected>=3 && event.direction==4){ //decrease this.categorySelected
                 console.log("call scrollTo with "+(dimensions.contentWidth/3)*(this.categorySelected-3));
                 this.segmentBarRef.scrollTo((dimensions.contentWidth/3)*(this.categorySelected-3),0,500);
            }    
        }
        */
        if(event.direction==4){ //DIRECTION_LEFT = 2
            if(this.categorySelected>1){
                this.categoryChange(this.categorySelected-1);
            }
        }else if(event.direction==2){//DIRECTION_RIGHT = 4
            if(this.categorySelected < this.categories.length){
                this.categoryChange(this.categorySelected+1);
            }
        }        
  }

    hideFlag(flag){
        return flag;
    }

    ionViewWillUnload(){
       //Please update shoplist of storageProvider...
       console.log("ionViewWillUnload-ShopHomePage");
     }
}
