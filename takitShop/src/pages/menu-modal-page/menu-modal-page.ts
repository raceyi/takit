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
    flags = {"add":false, "options":true, "imageUpload":true, "segment": false};
    imageURI;
    menuSelected=1;


  constructor(public params:NavParams, public viewCtrl: ViewController, 
              public navCtrl: NavController, private alertController:AlertController,
              private camera: Camera, private file: File,
              public serverProvider:ServerProvider, public storageProvider:StorageProvider) {
      console.log("menu modal constructor:"+params.get('menu'));

      if(params.get('menu').hasOwnProperty('menuName')){
        this.menu=params.get('menu');
        this.menu.oldMenuName = this.menu.menuName;
      }else{
         console.log("menu add modal");
        this.flags.add=true;
        this.menu=params.get('menu');
      }

    //   if(params.get('menu').imagePath === undefined || params.get('menu').imagePath === null){
    //     //   this.flags.imageUpload = false;
    //   }else{
        //   this.flags.imageUpload = true;
      if(params.get('menu').hasOwnProperty('imagePath') && params.get('menu').imagePath !== null){
          console.log(this.menu.imagePath);
          this.menu.imagePath= this.menu.imagePath.substr(this.menu.imagePath.indexOf('_') + 1);
      }
      

      if(params.get('menu').hasOwnProperty('takeout') && params.get('menu').takeout === '1'){
        this.menu.takeout = true;
      }else if(params.get('menu').hasOwnProperty('takeout') && params.get('menu').takeout === '2'){
          this.menu.takeout = true;
          this.menu.delivery = true;
      }
      console.log("construct menu:"+JSON.stringify(this.menu));
      console.log("flags"+JSON.stringify(this.flags));
  }

  ionViewDidEnter(){
      //this.menuContentRef.resize(); //scroll resize
  }


  segmentChange(){
      console.log("segmentChange");
      console.log("menuSelected:"+this.menuSelected);
      if(this.menuSelected === 1){
        this.flags.segment = false;
      }else if(this.menuSelected === 2){
        this.flags.segment = true;
      }
      console.log(this.flags.segment);
  }

  takePicture(){
   let cameraOptions = {
      quality: 100,
      targetWidth :500,
      targetHeight :500,
      saveToPhotoAlbum : true,
      allowEdit:true,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
      
    }

    this.camera.getPicture(cameraOptions).then((imageURI) => {
        this.imageURI = imageURI;
        let tmpURI = imageURI.split('/')
        this.menu.imagePath = tmpURI[tmpURI.length-1];

      //this.serverProvider.fileTransferFunc(imageURI);
    }, (err) => {
    // Handle error
        console.log("err:"+JSON.stringify(err)); 
    });
  }

  pickPicture(){
    let options = {
      quality: 100,
      targetWidth :500,
      targetHeight :500,
      allowEdit:true,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    this.camera.getPicture(options).then((imageURI) => {
        this.imageURI = imageURI;
        let tmpURI = imageURI.split('/')
        this.menu.imagePath = tmpURI[tmpURI.length-1];
        //this.serverProvider.fileTransferFunc(imageURI);
       }, (err) => {
           console.log("err:"+JSON.stringify(err)); 
       });        
  }

  uploadMenuImage(){

      //set upload flag
    console.log(this.imageURI);
    this.serverProvider.fileTransferFunc(this.imageURI,this.menu).then((res:any)=>{
        console.log("uploadMenuImage:"+res);
        if(res.result === "success"){
            this.flags.imageUpload =true;
            console.log(this.flags.imageUpload);
            let alert = this.alertController.create({
                        title : "사진 업로드를 완료 하였습니다.",
                        buttons : ['확인']
                    });
            alert.present();
        }else if(res.result === "failure"){
            if(res.error === "exist same image"){
                let alert = this.alertController.create({
                    title : "다른 메뉴에서 같은 이름의 사진을 사용중입니다.",
                    subTitle : "사진 이름을 변경하세요.",
                    buttons : ['확인']
                });
                alert.present();
            }else{
                console.log(res.error);
                let alert = this.alertController.create({
                    title : "사진 업로드에 실패하였습니다.",
                    buttons : ['확인']
                });
                alert.present();
            }            
        }
        
    },err=>{
        console.log(err);
        let alert = this.alertController.create({
            title : "사진 업로드에 실패하였습니다.",
            buttons : ['확인']
        });
        alert.present();
    });
  }

  modifyMenuInfo(){
    console.log("modifyMenuInfo"+this.menu);
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

            if(this.menu.options !== undefined && this.menu.options !== null){
                console.log("options not undefined");
                for(let i=0; i<this.menu.options.length; i++){
                    if(this.isNull(this.menu.options[i].name) || this.isNull(this.menu.options[i].price)){
                        // console.log("i:"+i)
                        // console.log("flags:"+optionFlags);
                        // console.log("options"+this.menu.options[i].name+ " "+this.menu.options[i].price);
                        optionFlags=false;
                        //console.log("flags:"+optionFlags);
                        break;
                    }
                    if(this.menu.options[i].choice !== undefined){
                        for(let j=0; i<this.menu.options[i].choice; j++){
                            if(this.isNull(this.menu.options[i].choice[j])){
                                // console.log("j:"+j)
                                // console.log("flags:"+optionFlags);
                                // console.log("options"+this.menu.options[i].choice[j]);

                                optionFlags=false;
                                //console.log("flags:"+optionFlags);
                                break;
                            }
                        }
                    }
                    
                }
                //console.log("after for :"+this.menu.options);
            }

            if(this.menu.optionsEn!== undefined && this.menu.optionsEn !== null){
                console.log("options not undefined");
                for(let i=0; i<this.menu.optionsEn.length; i++){
                    if(this.isNull(this.menu.optionsEn[i].name) || this.isNull(this.menu.optionsEn[i].price)){
                        console.log("i:"+i)
                        console.log("flags:"+optionFlags);
                        console.log("options"+this.menu.optionsEn[i].name+ " "+this.menu.optionsEn[i].price);
                        optionFlags=false;
                        console.log("flags:"+optionFlags);
                        break;
                    }
                    if(this.menu.optionsEn[i].choice !== undefined){
                        for(let j=0; i<this.menu.optionsEn[i].choice; j++){
                            if(this.isNull(this.menu.optionsEn[i].choice[j])){
                                console.log("j:"+j)
                                console.log("flags:"+optionFlags);
                                console.log("options"+this.menu.optionsEn[i].choice[j]);

                                optionFlags=false;
                                console.log("flags:"+optionFlags);
                                break;
                            }
                        }
                    }
                    
                }
                console.log("after for :"+this.menu.options);
            }

            console.log("flags:"+optionFlags);

            if(optionFlags === true){

                // stringify 하면 이 순간에 error!!!!!!!!! 
                // if(this.menu.options !== undefined){
                //     this.menu.options= JSON.stringify(this.menu.options);
                // }

                if(this.menu.takeout ===null || this.menu.takeout === false){
                    this.menu.takeout = 0;
                }else if(this.menu.takeout === true){
                    this.menu.takeout = 1;
                }

                if(this.menu.delivery === true){
                    this.menu.takeout = 2;
                }

                if(!this.isNull(this.menu.imagePath)){
                    this.menu.imagePath = this.storageProvider.myshop.takitId+"_"+this.menu.imagePath;
                }

                this.serverProvider.modifyMenuInfo(this.menu)
                .then((res:any)=>{
                    if(res.result === "success"){
                        let alert = this.alertController.create({
                                        title: "메뉴가 수정 되었습니다.",
                                        subTitle: '다시 로드 하면 화면에 보여집니다.',
                                        buttons: [ {text: '확인',
                                                    handler: ()=>{
                                                        this.viewCtrl.dismiss();
                                                    }
                                                }]
                                    });
                        alert.present();
                    }else{
                        console.log("modifyMenuInfo failure:"+JSON.stringify(res.error));
                        let alert = this.alertController.create({
                                    title: "메뉴 수정에 실패 하였습니다.",
                                    subTitle: '다시 시도해주세요.',
                                    buttons: [ {text: '확인',
                                                handler: ()=>{
                                                    this.viewCtrl.dismiss();
                                                }
                                            }]
                                });
                        alert.present();
                    }
                },(err)=>{
                    console.log("modifyMenuInfo failure:"+JSON.stringify(err));
                    let alert = this.alertController.create({
                                    title: "메뉴 수정에 실패 하였습니다.",
                                    subTitle: '다시 시도해주세요.',
                                    buttons: [ {text: '확인',
                                                handler: ()=>{
                                                    this.viewCtrl.dismiss();
                                                }
                                            }]
                                });
                    alert.present();
                });
            }else{
                let alert = this.alertController.create({
                                title: "옵션을 정확히 입력해주세요.",
                                buttons: ['OK']
                            });
                alert.present();
            }
        }
    }else{
        let alert = this.alertController.create({
                                title: "메뉴 정보를 정확히 입력해주세요.",
                                subTitle: '메뉴 이름,가격은 필수입니다.',
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
    
        if(!this.flags.imageUpload){
        // if(!this.isNull(this.menu.imagePath) && !this.flags.imageUpload){
            let alert = this.alertController.create({
                        title: "사진을 업로드 해주세요.",
                        buttons: ['확인']
                    });
            alert.present();
        }else{
            let optionFlags = true;

            if(this.menu.options !== undefined){
                console.log("options not undefined");
                for(let i=0; i<this.menu.options.length; i++){
                    if(this.isNull(this.menu.options[i].name) || this.isNull(this.menu.options[i].price)){
                        console.log("options"+this.menu.options[i].name+ " "+this.menu.options[i].price);
                        optionFlags=false;
                        console.log("flags:"+optionFlags);
                        break;
                    }
                    if(this.menu.options[i].choice !== undefined){
                        for(let j=0; i<this.menu.options[i].choice; j++){
                            if(this.isNull(this.menu.options[i].choice[j])){
                                console.log("options"+this.menu.options[i].choice[j]);

                                optionFlags=false;
                                console.log("flags:"+optionFlags);
                                break;
                            }
                        }
                    }
                    
                }
                console.log("after for :"+this.menu.options);
            }

            if(this.menu.optionsEn !== undefined){
                console.log("optionsEn not undefined");
                for(let i=0; i<this.menu.optionsEn.length; i++){
                    if(this.isNull(this.menu.optionsEn[i].name) || this.isNull(this.menu.optionsEn[i].price)){
                        console.log("options"+this.menu.optionsEn[i].name+ " "+this.menu.optionsEn[i].price);
                        optionFlags=false;
                        console.log("flags:"+optionFlags);
                        break;
                    }
                    if(this.menu.optionsEn[i].choice !== undefined){
                        for(let j=0; i<this.menu.optionsEn[i].choice; j++){
                            if(this.isNull(this.menu.optionsEn[i].choice[j])){
                                console.log("options"+this.menu.optionsEn[i].choice[j]);

                                optionFlags=false;
                                console.log("flags:"+optionFlags);
                                break;
                            }
                        }
                    }
                    
                }
                console.log("after for :"+this.menu.optionsEn);
            }

            console.log("flags:"+optionFlags);

            if(optionFlags === true){

                // stringify 하면 이 순간에 error!!!!!!!!! 
                // if(this.menu.options !== undefined){
                //     this.menu.options= JSON.stringify(this.menu.options);
                // }
                
                if(this.menu.takeout ===null || this.menu.takeout === false){
                    this.menu.takeout = 0;
                }else if(this.menu.takeout === true){
                    this.menu.takeout = 1;
                }

                if(this.menu.delivery === true){
                    this.menu.takeout = 2;
                }

                if(!this.isNull(this.menu.imagePath)){
                    this.menu.imagePath = this.storageProvider.myshop.takitId+"_"+this.menu.imagePath;
                }

                this.serverProvider.addMenuInfo(this.menu)
                .then((res:any)=>{
                    if(res.result === "success"){
                        let alert = this.alertController.create({
                                        title: "메뉴가 추가 되었습니다.",
                                        subTitle: '화면을 새로고침 해주세요',
                                        buttons: [ {text: '확인',
                                                    handler: ()=>{
                                                        this.viewCtrl.dismiss();
                                                    }
                                                }]
                                    });
                        alert.present();
                    }else{
                        console.log("addMenuInfo failure:"+JSON.stringify(res.error));
                        let alert = this.alertController.create({
                                    title: "메뉴 추가에 실패 하였습니다.",
                                    buttons: [ {text: '확인',
                                                    handler: ()=>{
                                                        this.viewCtrl.dismiss();
                                                    }
                                                }]
                                });
                        alert.present();
                    }
                },(err)=>{
                    console.log("addMenuInfo failure:"+JSON.stringify(err));
                    let alert = this.alertController.create({
                                    title: "메뉴 추가에 실패 하였습니다.",
                                    buttons: [ {text: '확인',
                                                    handler: ()=>{
                                                        this.viewCtrl.dismiss();
                                                    }
                                                }]
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

  deliveryClick(){
      this.menu.takeout = true;
  }

  imageInput(ev){
      if(this.menu.imagePath !== null && this.menu.imagePath !==""){
        console.log("imageInput event");
        this.flags.imageUpload = false;
      }else{ //이미지 url이 입력되지 않은 상태로 업로드 할 필요 없음.
          this.flags.imageUpload=true;
      }
  }

  addOption(){
     //this.flags.options = false;
     //console.log(option.choice);
     //console.log("addOption menu:"+JSON.stringify(this.menu));
     
     if(this.menu.options === undefined || this.menu.options === null){
         this.menu.options = [];
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
     console.log("options type"+ typeof this.menu.options);
     console.log(JSON.stringify(this.menu.options));
     console.log(this.menu);
     this.menuContentRef.resize();
  }

  addOptionEn(){
     //this.flags.options = false;
     //console.log(option.choice);
     //console.log("addOption menu:"+JSON.stringify(this.menu));
     
     if(this.menu.optionsEn === undefined || this.menu.optionsEn === null){
         this.menu.optionsEn = [];
     }

     this.menu.optionsEn.push({"name":null,"price":null});
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
     console.log("options type"+ typeof this.menu.optionsEn);
     console.log(JSON.stringify(this.menu.optionsEn));
     console.log(this.menu);
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
            this.menu.options[optionIdx].choice.push(null);
        }
    }
    this.menuContentRef.resize();
  }

  addSelectMenuEn(optionEn){
    if(optionEn.choice === undefined){
        optionEn.choice =[];
        optionEn.choice.push(null);
    }else{
        if(optionEn.choice.length === 4){
            let alert = this.alertController.create({
                        title: "선택항목은 4개까지만 추가 가능합니다.",
                        buttons: ['확인']
                });
            alert.present();
        }else{
            optionEn.choice.push(null);
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

  removeSelectMenuEn(optionEn, choiceIdx){
    //선택항목이 하나일 경우 choice 완전히 삭제
    console.log("optionIdx"+optionEn);
    //console.log("choiceIdx"+choiceIdx);
    console.log("choice"+optionEn.choice[choiceIdx]);

    if(optionEn.choice.length===1){
        delete optionEn.choice;   
    }else{    
        for(let i=choiceIdx; i<optionEn.choice.length-1; i++){
          optionEn.choice[i]=optionEn.choice[i+1];          
        }
        //last option pop
        optionEn.choice.pop();
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
