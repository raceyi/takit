import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component,ViewChild } from '@angular/core';
import { AlertController, Content} from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';
import {Http,Headers} from '@angular/http';
import {MenuModalPage} from '../menu-modal-page/menu-modal-page';
import {ServerProvider} from '../../providers/serverProvider';
import {StorageProvider} from '../../providers/storageProvider';
/**
 * Generated class for the EditMenuPage page. 
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-edit-menu-page',
  templateUrl: 'edit-menu-page.html',
})
export class EditMenuPage {

  @ViewChild('addMenuContent') addMenuContentRef:Content;

    shopname:string;
    takitId;

    shop;

    categorySelected:number=1;
    nowCategory={};
    categories=[];

    menuRows=[];
    categoryRows=[];
    categoryMenuRows=[];

    options;
    optionsEn;

    flags ={"categoryName":true, "addCategory":true}

    inputCategory={"sequence":"","categoryName":"","categoryNameEn":""};

  constructor(public navCtrl: NavController,private alertController:AlertController,
              public modalCtrl: ModalController, public serverProvider:ServerProvider,
              private http:Http, public storageProvider:StorageProvider) {
                console.log("addMenu page"); 
                //this.loadShopInfo();
  }

  ionViewDidEnter(){ // Be careful that it should be DidEnter not Load 
      console.log("add menu page - ionViewDidEnter"); 
      
          this.loadShopInfo();
          this.addMenuContentRef.resize();
       // this.storageProvider.orderPageEntered=false;
  }

  categoryChange(categoryNO){
    console.log("[categoryChange] categorySelected:"+categoryNO+" previous:"+this.categorySelected);
    console.log("this.categoryMenuRows.length:"+this.categoryMenuRows.length);
    if(this.categoryMenuRows.length>0){
        //console.log("change menus");
        this.menuRows=this.categoryMenuRows[categoryNO-1];
        this.categorySelected=categoryNO; //Please check if this code is correct.
        this.nowCategory=this.categories[categoryNO-1];
    }
    this.addMenuContentRef.resize();

  }

  loadShopInfo()
  {
        this.categorySelected=1;
        this.categories=[];
        this.menuRows=[];
        this.categoryMenuRows=[];
        //this.recommendMenu=[];

        //var shop=this.storageProvider.shopResponse;

        //console.log("[loadShopInfo]this.storageProvider.shopResponse: "+JSON.stringify(this.storageProvider.shopResponse));

        this.shop=this.storageProvider.shop;
        
        console.log(this.shop);
        //this.storageProvider.shopInfoSet(this.shop.shopInfo);
        this.configureShopInfo();
        /////////////////////////////////
      //this.isAndroid = this.platform.is('android');                        
  }

    configureShopInfo(){
    // hum=> construct this.categoryRows
    this.shop.categories.forEach(category => {
        var menus=[];
        let options;
        let optionsEn;
        console.log("[configureShopInfo]this.shop:"+this.shop);
            this.shop.menus.forEach(menu=>{
                //console.log("menu.no:"+menu.menuNO+" index:"+menu.menuNO.indexOf(';'));
                var no:string=menu.menuNO.substr(menu.menuNO.indexOf(';')+1);
                //console.log("category.category_no:"+category.categoryNO+" no:"+no);
                if(no==category.categoryNO){
                    menu.filename=encodeURI(this.storageProvider.awsS3+menu.imagePath);
                    menu.categoryNO=no;

                    if(menu.options!==null)
                        menu.options=JSON.parse(menu.options);

                    if(menu.optionsEn!==null)
                        menu.optionsEn=JSON.parse(menu.optionsEn);
                    //menu.options=options[0];
                    //menu.optionsEn=optionsEn[0];
                    //console.log("menu.filename:"+menu.filename);

                    //let menu_name=menu.menuName.toString();
                    //console.log("menu.name:"+menu_name);
                    console.log("name has:"+menu.optionsEn);
                    //if(menu_name.indexOf("(")>0){
                    //menu.menuName = menu_name.substr(0,menu_name.indexOf('('));
                    //console.log("menu.name:"+menu.name);
                    //menu.description = menu_name.substr(menu_name.indexOf('('));
                    //menu.descriptionHide=false;
                    //}
                    //else{
                        //menu.descriptionHide=true;
                    //}
                    console.log("menu:"+JSON.stringify(menu));
                    menus.push(menu);
                }
            });

        
        this.categories.push({categoryNO:parseInt(category.categoryNO), categoryName:category.categoryName,categoryNameEn:category.categoryNameEn,menus:menus});


        //console.log("[categories]:"+JSON.stringify(this.categories));
        //console.log("menus.length:"+menus.length);
        });
        //console.log("categories len:"+JSON.stringify(this.categories));
        console.log("category:"+this.categories[0].menus.length);
        this.categories.forEach(category => {
        
            var menuRows=[];
            for(var i=0;i<category.menus.length;){
                var menus=[];
                for(var j=0;j<2 && i<category.menus.length;j++,i++){
                    //console.log("menus[i]:"+JSON.stringify(category.menus[i]));
                    var menu=category.menus[i];
                        
                    menus.push(menu);
                }
                menuRows.push({menus:menus});  
            }
            this.categoryMenuRows.push(menuRows);                        
        });

        //console.log(JSON.stringify(this.categoryMenuRows));

        var rowNum:number=0;
        for(rowNum=0;(rowNum+1)*3<=this.categories.length; rowNum++)
            this.categoryRows.push([this.categories[rowNum*3],this.categories[rowNum*3+1],this.categories[rowNum*3+2]]);

        if(this.categories.length%3==1){
            this.categoryRows.push([this.categories[(rowNum)*3]]);
        }    
        if(this.categories.length%3==2){
            this.categoryRows.push([this.categories[(rowNum)*3],this.categories[(rowNum)*3+1]]);
        }    

        this.menuRows=this.categoryMenuRows[0];
        this.nowCategory=this.categories[0];

  }
    addCategory(){
        this.flags.addCategory=false;
    }

    addCategoryComplete(){
        // this.serverProvider.addCategory(this.inputCategory)
        // .then(()=>{
        //     let alert = this.alertController.create({
        //                     title: "새 카테고리가 추가 되었습니다.",
        //                     subTitle: '다시 로드 하면 화면에 보여집니다.',
        //                     buttons: ['OK']
        //                 });
        //     alert.present();
        //     this.flags.addCategory=true;
        // },(err)=>{
        //     let alert = this.alertController.create({
        //                     title: '카테고리 추가에 실패하였습니다.',
        //                     subTitle: '다시 시도 하시거나 문의 해주세요.',
        //                     buttons: ['OK']
        //                 });
        //     alert.present();
        //     this.flags.addCategory=true;
        // });
    }

    editCategory(){
        this.flags.categoryName=false;

    }

    completeEditCategory(){
        this.flags.categoryName=true;
        //서버에 전송?!
        
    }

    removeMenu(){
        let alert = this.alertController.create({
                        title: "해당 메뉴를 삭제 하시겠습니까?",
                        buttons: ['취소','확인']
                    });
        alert.present();
    }

    presentContactModal() {
        let contactModal = this.modalCtrl.create(MenuModalPage);
        contactModal.present();
    }

    menuModal(categoryNO,menuName) {
        var menu;
            for(var i=0;i<this.categories[categoryNO-1].menus.length;i++){
                //console.log("menu:"+this.categories[category_no-1].menus[i].menuName);
                if(this.categories[categoryNO-1].menus[i].menuName==menuName){
                    menu=this.categories[categoryNO-1].menus[i];
                break;
            }
        }

        if(menu.takeout==="1"){
            menu.takeout=true;
        }else{
            menu.takeout=false;
        }

        let menuModal = this.modalCtrl.create(MenuModalPage,{menu:menu});
        menuModal.onDidDismiss(data => {
            console.log(data);
        });
        menuModal.present();
    }

    addMenu(){
        let menuModal = this.modalCtrl.create(MenuModalPage,{menu:[]});
        menuModal.onDidDismiss(data => {
            console.log(data);
        });
        menuModal.present();
    }
}
