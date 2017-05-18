import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';
import { AlertController, Content} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import {ServerProvider} from '../../providers/serverProvider';
import {StorageProvider} from '../../providers/storageProvider';


/**
 * Generated class for the MenuMoalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-menu-modal-page',
  templateUrl: 'menu-modal-page.html',
})
export class MenuModalPage {
@ViewChild('menuContent') menuContentRef:Content;

    menu;
 
    options=[];
    optionsEn=[];
    //addFlag=true;
    flags = {"add":false, "options":true, "imageUpload":false};
    //choice = [null,null,null,null];
    imageURI;

    choices;

  constructor(public params:NavParams, public viewCtrl: ViewController, 
              public navCtrl: NavController, private alertController:AlertController,
              private camera: Camera, private file: File,
              public serverProvider:ServerProvider, public storageProvider:StorageProvider) {
      console.log("menu modal constructor:"+params.get('menu'));

      if(params.get('menu').menuName === undefined ){
        console.log("menu add modal");
        this.flags.add=true;
        // this.menu = {"menuName":null,"menuNameEn":null,"price":null,"imagePath":"",
        //     "takeout":true,"explanation":null,"explanationEn":null,"ingredient":null,
        //     "ingredientEn":null,"options":[{"name":null,"price":null,"choice":[null,null,null,null]}],
        //     "optionsEn":[{"name":null,"price":null,"choice":[null,null,null,null]}]};
        this.menu=params.get('menu');

      }else{
        this.menu=params.get('menu');
        this.menu.oldMenuName = this.menu.menuName;
      }
      console.log("construct menu:"+JSON.stringify(this.menu));
      console.log("flags"+JSON.stringify(this.flags));


  }

  ionViewDidEnter(){
      this.menuContentRef.resize(); //scroll resize
  }


  takePicture(){
   let cameraOptions = {
      quality: 100,
      targetWidth :100,
      targetHeight :100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(cameraOptions).then((imageURI) => {
        this.imageURI = imageURI;
        let tmpURI = imageURI.split('/')
        this.menu.imagePath = this.storageProvider.myshop.takitId+"_"+tmpURI[tmpURI.length-1];

      //this.serverProvider.fileTransferFunc(imageURI);
    }, (err) => {
    // Handle error
    });
  }

  pickPicture(){
    let options = {
      quality: 100,
      targetWidth :100,
      targetHeight :100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
      

    };
    this.camera.getPicture(options).then((imageURI) => {
        this.imageURI = imageURI;
        let tmpURI = imageURI.split('/')
        this.menu.imagePath = this.storageProvider.myshop.takitId+"_"+tmpURI[tmpURI.length-1];
        //this.serverProvider.fileTransferFunc(imageURI);
       }, (err) => {
           console.log("err:"+JSON.stringify(err)); 
       });        
  }

  uploadMenuImage(){

      //set upload flag
    console.log(this.imageURI)
    this.serverProvider.fileTransferFunc(this.imageURI).then((res:any)=>{
        console.log("uploadMenuImage:"+res);
        if(res.result === "success"){
            this.flags.imageUpload =true;
            console.log(this.flags.imageUpload);
            let alert = this.alertController.create({
                        title : "사진 업로드를 완료 하였습니다.",
                        buttons : [{text:'확인',
                                    handler : ()=>{
                                        this.flags.imageUpload =true;
                                        console.log(this.flags.imageUpload);
                                    }}]
                    });
            alert.present();
        }else if(res.result === "failure"){
            console.log(res.error);
            let alert = this.alertController.create({
                title : "사진 업로드에 실패하였습니다.",
                buttons : ['확인']
            });
            alert.present();
        }
        
    },err=>{
        if(err==="exist same image"){
            let alert = this.alertController.create({
                title : "다른 메뉴에서 같은 이름의 사진을 사용중입니다.",
                subTitle : "사진 이름을 변경하세요.",
                buttons : ['확인']
            });
            alert.present();
        }else{
            console.log(err);
            let alert = this.alertController.create({
                title : "사진 업로드에 실패하였습니다.",
                buttons : ['확인']
            });
            alert.present();
        }
    });
  }

  modifyMenuInfo(){
    console.log(this.menu);

    if(this.menu.options !== undefined){
        for(let i=0; i<this.menu.options.length; i++){
            this.menu.options[i]= JSON.stringify(this.menu.options[i]);
        }
    }else{
        
    }
    // if(this.menu.optionsEn !== undefined){
    //     for(let i=0; i<this.menu.options.length; i++){
    //         this.menu.optionsEn[i]= JSON.stringify(this.menu.optionsEn[i]);
    //     }
    // }

    if(!this.isNull(this.menu.menuName) && 
        !this.isNull(this.menu.price) && 
        !this.isNull(this.menu.imagePath)){
        this.serverProvider.modifyMenuInfo(this.menu)
        .then((res)=>{
            let alert = this.alertController.create({
                            title: "메뉴가 수정 되었습니다.",
                            subTitle: '다시 로드 하면 화면에 보여집니다.',
                            buttons: ['OK']
                        });
            alert.present();
                    
        },(err)=>{
            let alert = this.alertController.create({
                            title: "메뉴 수정에 실패 하였습니다.",
                            subTitle: '다시 시도해주세요.',
                            buttons: ['OK']
                        });
            alert.present();
        });
    }else{
        let alert = this.alertController.create({
                        title: "메뉴 정보를 정확히 입력해주세요.",
                        subTitle: '메뉴 이름,가격,사진은 필수입니다.',
                        buttons: ['OK']
                    });
        alert.present();
    }
  }

  addMenuInfo(){

    console.log(this.menu);
    console.log(this.flags.imageUpload);
    //필수 정보 확인
    if(!this.isNull(this.menu.menuName) && 
        !this.isNull(this.menu.price)){
    
        if(!this.isNull(this.menu.imagePath) && !this.flags.imageUpload){
            let alert = this.alertController.create({
                        title: "사진을 업로드 해주세요.",
                        buttons: ['확인']
                    });
            alert.present();
        }else{
            let optionFlags = true;

            if(this.menu.options !== undefined){
                for(let i=0; i<this.menu.options.length-1; i++){
                    if(this.menu.options[i].name === null || this.menu.options[i].price === null){
                        optionFlags=false;
                        break;
                    }
                    if(this.menu.options[i].choice !== undefined){
                        for(let j=0; i<this.menu.options[i].choice-1; j++){
                            if(this.menu.options[i].choice[j]===null){
                                optionFlags=false;
                                break;
                            }
                        }
                    }
                    this.menu.options[i]= JSON.stringify(this.menu.options[i]);
                }
            }

            if(optionFlags === true){
                let nowThis = this;
                this.serverProvider.addMenuInfo(this.menu)
                .then((res)=>{
                    let alert = this.alertController.create({
                                    title: "메뉴가 추가 되었습니다.",
                                    subTitle: '화면을 새로고침 해주세요',
                                    buttons: [ {text: '예',
                                                handler: ()=>{
                                                    this.viewCtrl.dismiss();
                                                }
                                            }]
                                });
                    alert.present();
                
                },(err)=>{
                    let alert = this.alertController.create({
                                    title: "메뉴 추가에 실패 하였습니다.",
                                    buttons: ['확인']
                                });
                    alert.present();
                    
                });
            }else{
                let alert = this.alertController.create({
                                title: "옵션을 정확히 입력해주세요.",
                                buttons: ['확인']
                            });
                alert.present();
            }
            //else{
            //     let optionsFlags

            //     for(let i=0; i<this.menu.options.length; i++){
            //         if(this.menu.options[i].name === null){
            //             break;
            //         }
            //         if(this.menu.options[i].choice !== undefined){

            //         }
            //     }
            // }
            // console.log(this.menu.options);
            // if(this.menu.options !== undefined && this.menu.options[0] !== null && this.menu.options[0].name !== null){
            //     
            // }
            // if(this.menu.optionsEn !== undefined && this.menu.optionsEn[0] !== null && this.menu.options[0].name !== null){
            //     for(let i=0; i<this.menu.options.length; i++){
            //         this.menu.optionsEn[i]= JSON.stringify(this.menu.optionsEn[i]);
            //     }
            // }

            //this.menu.menuNO = 
            
        }
    }else{
        this.showAlert({title:"메뉴 정보를 정확히 입력해주세요.",
                        subTitle:"이름,가격은 필수입니다.",
                        buttons : ["확인"]});
    }
  }


  isNull(data){
    if(data === null || data === undefined || data === ""){
        return true;
    }else{
        return false;
    }
  }

  addOption(){
     //this.flags.options = false;
     //console.log(option.choice);
     //console.log("addOption menu:"+JSON.stringify(this.menu));
     
     if(this.menu.options === undefined){
         this.menu.options = [];
     }

     for(let option of this.menu.options){
        this.options.push(option);
     }

     this.menu.options.push({"name":null,"price":null});
     //this.menu.options.push({"name":"","price":"","choice":[]});
     //this.menu.optionsEn.push({"name":"","price":"","choice":[]});

    //  console.log(this.menu.options.length-1);
    // // this.menu.options[this.menu.options.length-1].choice=this.choice;
    //  console.log(this.menu.options[0].choice);
    //  let selectCount = 4;
    //  for(let i=0; i<selectCount; i++){
    //     console.log(i);
    //     //console.log(typeof this.menu.options.choice);
    //     this.menu.options[this.menu.options.length-1].choice.push(null);
    //    // this.menu.optionsEn[this.menu.options.length-1].choice.push(null);
    //  }
     console.log(this.menu.options);
     console.log(JSON.stringify(this.menu.options));
     this.menuContentRef.resize();
  }

  removeOption(optionIdx){
      console.log(optionIdx);
    if(this.menu.options.length===1){
        delete this.menu.options;
    }else{
        for(let i=optionIdx; i<this.menu.options.length-1; i++){
            this.menu.options[i]=this.menu.options[i+1];          
        }

      //last option pop
      this.menu.options.pop();
    //delete this.menu.options[i];
    }
    this.menuContentRef.resize();
  }

  removeOptionEn(optionIdx){
    if(this.menu.optionsEn.length===1){
        delete this.menu.optionsEn;
    }else{   
        for(let i=optionIdx; i<this.menu.optionsEn.length-1; i++){
            this.menu.optionsEn[i]=this.menu.optionsEn[i+1];          
        }
        //last option pop
        this.menu.optionsEn.pop();
    }
    //delete this.menu.optionsEn[i];
    this.menuContentRef.resize();
  }


  addSelectMenu(optionIdx){
    //   console.log(choiceIdx);
    //   if(choiceIdx<4){
    //       if(this.menu.options[optionIdx].choice === undefined){
    //         this.menu.options[optionIdx].choice =[];
    //       }

    //       this.menu.options[optionIdx].choice.push("");
    //   }else{
    
    //first add
    


    if(this.menu.options[optionIdx].choice === undefined){
        this.menu.options[optionIdx].choice =[];
        this.menu.options[optionIdx].choice.push(null);
    }else{
        if(this.menu.options[optionIdx].choice.length === 4){
            let alert = this.alertController.create({
                        title: "선택항목은 4개까지만 추가 가능합니다.",
                        buttons: ['확인']
                });
            alert.present();
        }else{
            this.menu.options[optionIdx].choice.push("");
        }
    }
    this.menuContentRef.resize();
  }

  removeSelectMenu(optionIdx,choiceIdx){
    //선택항목이 하나일 경우 choice 완전히 삭제
    console.log("optionIdx"+optionIdx);
    console.log("choiceIdx"+choiceIdx);
    console.log("choice"+this.menu.options[optionIdx].choice[choiceIdx]);
    console.log("option:"+this.menu.options[optionIdx]);

    if(this.menu.options[optionIdx].choice.length===1){
        delete this.menu.options[optionIdx].choice;   
    }else{    
        for(let i=choiceIdx; i<this.menu.options[optionIdx].choice.length-1; i++){
          this.menu.options[optionIdx].choice[i]=this.menu.options[optionIdx].choice[i+1];          
        }

        //last option pop
        this.menu.options[optionIdx].choice.pop();
    }
    // this.menu.options[optionIdx].choice[choiceIdx];
    this.menuContentRef.resize();

  }


  cancell(){
    console.log("cancell clicked");
    let alert = this.alertController.create({
                    title: "메뉴 추가를 취소 하시겠습니까?",
                    buttons: [{ text: '아니오',
                                handler: () => {
                                    console.log("cancell is cancell")
                                }
                            },
                            {   text: '예',
                                handler: () => {
                                    this.viewCtrl.dismiss();
                                }
                            }]
    });
    alert.present();
  }

  close(){
        //this.viewCtrl.dismiss(data);  //root 화면으로 돌아감
        this.viewCtrl.dismiss();
  }

  showAlert(contents){
    let alert = this.alertController.create({
                        title: contents.title,
                        subTitle: contents.subTitle,
                        buttons: contents.buttons
                    });
        alert.present();
  }

}
