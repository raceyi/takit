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

    flags ={"categoryName":true, "addCategory":true, "removeMenu":true}

    inputAddCategory={"sequence":null,
                        "categoryName":null,
                        "categoryNameEn":null,
                        "categoryNO":null};

    inputModifyCategory={"oldSequence":"",
                        "newSequence":"",
                        "categoryName":"",
                        "categoryNameEn":"",
                        "categoryNO":0};

  constructor(public navCtrl: NavController,private alertController:AlertController,
              public modalCtrl: ModalController, public serverProvider:ServerProvider,
              private http:Http, public storageProvider:StorageProvider) {
                console.log("addMenu page"); 
                //this.loadShopInfo();
  }

  ionViewDidEnter(){ // Be careful that it should be DidEnter not Load 
    console.log("add menu page - ionViewWillEnter"); 
        

    this.loadShopInfo();
    this.addMenuContentRef.resize();
       // this.storageProvider.orderPageEntered=false;
  }

  categoryChange(categoryNO,sequence){

    console.log("[categoryChange] "+JSON.stringify(this.categories));

    console.log("[categoryChange] categorySelected:"+sequence+" previous:"+this.categorySelected);
    console.log("this.categoryMenuRows.length:"+this.categoryMenuRows.length);
    this.flags.addCategory=true;
    this.flags.categoryName=true;

    if(this.categoryMenuRows.length>0){
        //console.log("change menus");
        this.menuRows=this.categoryMenuRows[sequence-1];
        this.categorySelected=sequence; //Please check if this code is correct.
        this.nowCategory=this.categories[sequence-1];
    }
    this.addMenuContentRef.resize();

  }

  loadShopInfo(){
        this.categorySelected=1;
        this.categories=[];
        this.menuRows=[];
        this.categoryMenuRows=[];
        //this.recommendMenu=[];

        //var shop=this.storageProvider.shopResponse;

        //console.log("[loadShopInfo]this.storageProvider.shopResponse: "+JSON.stringify(this.storageProvider.shopResponse));

        this.serverProvider.getShopInfo(this.storageProvider.myshop.takitId).then((res:any)=>{
              console.log("shopInfo:"+JSON.stringify(res));
              this.storageProvider.shopInfoSet(res.shopInfo);
              this.storageProvider.shop = res;
              
          });
        this.shop=this.storageProvider.shop;
        
        console.log("edit-menu-page:"+this.shop);
        //this.storageProvider.shopInfoSet(this.shop.shopInfo);
        this.configureShopInfo();
        /////////////////////////////////
      //this.isAndroid = this.platform.is('android');                        
  }

    configureShopInfo(){
    // hum=> construct this.categoryRows
    this.shop.categories.forEach(category => {
        let menus=[];
        let options;
        let optionsEn;
        console.log("[configureShopInfo]this.shop:"+this.shop);
            this.shop.menus.forEach(menu=>{
                //console.log("menu.no:"+menu.menuNO+" index:"+menu.menuNO.indexOf(';'));
                let no:string=menu.menuNO.substr(menu.menuNO.indexOf(';')+1);
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

        
        this.categories.push({categoryNO:parseInt(category.categoryNO), 
                              categoryName:category.categoryName,
                              categoryNameEn:category.categoryNameEn,
                              sequence:parseInt(category.sequence),
                              menus:menus
                              });


        //console.log("[categories]:"+JSON.stringify(this.categories));
        //console.log("menus.length:"+menus.length);
        });
        //console.log("categories len:"+JSON.stringify(this.categories));
        console.log("category:"+this.categories[0].menus.length);
        this.categories.forEach(category => {
        
            let menuRows=[];
            for(let i=0;i<category.menus.length;){
                let menus=[];
                for(let j=0;j<2 && i<category.menus.length;j++,i++){
                    //console.log("menus[i]:"+JSON.stringify(category.menus[i]));
                    var menu=category.menus[i];
                        
                    menus.push(menu);
                }
                menuRows.push({menus:menus});  
            }
            this.categoryMenuRows.push(menuRows);                        
        });

        //console.log(JSON.stringify(this.categoryMenuRows));

        let rowNum:number=0;
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
        if(this.inputAddCategory.sequence === null){
            this.inputAddCategory.sequence = this.categories.length+1;
        }
        console.log("addCategoryComplete start");
         console.log("inputAddCategory:"+JSON.stringify(this.inputAddCategory));
        if(this.inputAddCategory.sequence !== null && this.inputAddCategory.categoryName !== null){
                this.inputAddCategory.categoryNO = this.categories.length+1;
                console.log("inputAddCategory:"+JSON.stringify(this.inputAddCategory));
                this.serverProvider.addCategory(this.inputAddCategory)
                .then(()=>{
                    let alert = this.alertController.create({
                                    title: "새 카테고리가 추가 되었습니다.",
                                    subTitle: '다시 로드 하면 화면에 보여집니다.',
                                    buttons: ['OK']
                                });
                    alert.present();
                    this.flags.addCategory=true;
                },(err)=>{
                    let alert = this.alertController.create({
                                    title: '카테고리 추가에 실패하였습니다.',
                                    subTitle: '다시 시도 하시거나 문의 해주세요.',
                                    buttons: ['OK']
                                });
                    alert.present();
                    this.flags.addCategory=true;
                });
        }else{
           let alert = this.alertController.create({
                            title: "카테고리 정보를 모두 입력 해주세요.",
                            subTitle: "올바른 정보를 입력하세요.",
                            buttons: ['OK']
                        });
                        alert.present();
        }
       
    }

    modifyCategory(){
        this.flags.categoryName=false;
        console.log("[categoryChange] "+JSON.stringify(this.categories));
        console.log("modifyCategory flag:"+this.flags.categoryName);
        console.log("modifyCategory select value:"+this.categorySelected);
    }

    modifyCategoryComplete(){
        console.log("modifyCategoryComplete flag:"+this.flags.categoryName);
        console.log("modifyCategoryComplete select value:"+this.categorySelected);

 
        this.inputModifyCategory.oldSequence = this.categories[this.categorySelected-1].sequence;
        this.inputModifyCategory.categoryNO = this.categories[this.categorySelected-1].categoryNO;

        if(this.inputModifyCategory.newSequence === null){
            this.inputModifyCategory.newSequence = this.inputModifyCategory.oldSequence;
        }

        this.serverProvider.modifyCategory(this.inputModifyCategory)
        .then(()=>{
            let alert = this.alertController.create({
                            title: "카테고리가 수정되었습니다.",
                            subTitle: '다시 로드 하면 화면에 보여집니다.',
                            buttons: ['OK']
                        });
            alert.present();
            this.flags.categoryName=true;
        },(err)=>{
            let alert = this.alertController.create({
                            title: '카테고리 수정에 실패하였습니다.',
                            subTitle: '다시 시도 하시거나 문의 해주세요.',
                            buttons: ['OK']
                        });
            alert.present();
            this.flags.categoryName=true;
        });
        
    }

    removeMenu(menu){
        this.flags.removeMenu = false;

        let alert = this.alertController.create({
                        title: "해당 메뉴를 삭제 하시겠습니까?",
                        buttons: [{ text: '아니오'},
                                  { text:'예',
                                    handler : ()=>{
                                        this.serverProvider.removeMenu(menu)
                                        .then((result:any)=>{
                                            if(result.result==="success"){
                                                let alert = this.alertController.create({
                                                                title: "메뉴가 삭제 되었습니다.",
                                                                subTitle: '새로고침 하면 화면에 보여집니다.',
                                                                buttons: ['OK']
                                                            });
                                                alert.present();
                                            }else{
                                                let alert = this.alertController.create({
                                                                title: "메뉴가 삭제에 실패 하였습니다.",
                                                                subTitle: '다시 시도해 주세요.',
                                                                buttons: ['OK']
                                                            });
                                                alert.present();
                                            }
                                            
                                        });
                                    }
                                  }]
                    });
        alert.present();
    }

    presentContactModal() {
        let contactModal = this.modalCtrl.create(MenuModalPage);
        contactModal.present();
    }

    menuModal(menuName) {
        console.log("menuModal function");
        let menu;
            for(let i=0;i<this.categories[this.categorySelected-1].menus.length;i++){
                console.log(this.categories[this.categorySelected-1].menus[i]);
                //console.log("menu:"+this.categories[category_no-1].menus[i].menuName);
                if(this.categories[this.categorySelected-1].menus[i].menuName===menuName){
                    menu=this.categories[this.categorySelected-1].menus[i];
                    console.log(menu);
                break;
            }
        }

         console.log("menu:"+menu);

        if(menu.takeout==="1"){
            menu.takeout=true;
        }else{
            menu.takeout=false;
        }

        console.log("menu:"+menu);

        menu.menuNO = this.storageProvider.myshop.takitId+";"+this.categories[this.categorySelected-1].categoryNO;
        let menuModal = this.modalCtrl.create(MenuModalPage,{menu:menu});

        menuModal.onDidDismiss(data => {
            console.log(data);
        });
        menuModal.present();
    }

    addMenu(){
        let menuNO = this.storageProvider.myshop.takitId+";"+this.categories[this.categorySelected-1].categoryNO;
        console.log("addMenu menuNO : "+menuNO);
        let menuModal = this.modalCtrl.create(MenuModalPage,{menu:{"menuNO":menuNO}});
        menuModal.onDidDismiss(data => {
            console.log(data);
        });
        menuModal.present();
    }
}
