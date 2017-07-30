import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
import {TranslateService} from 'ng2-translate/ng2-translate';

/**
 * Generated class for the SearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  identifier:string;
  brand:string;
  nearShops=[];
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
          private serverProvider:ServerProvider,public storageProvider:StorageProvider,
          private translateService:TranslateService,private alertController:AlertController) {
      console.log("searchPage");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  back(){
      this.navCtrl.pop();  
  }

  goToShop(){    
      console.log("search");
      let body=JSON.stringify({
                  serviceName: this.identifier,
                  shopName:this.brand
              });

      this.serverProvider.post(this.storageProvider.serverAddress+"/searchTakitId",body).then((res:any)=>{
            if(res.result=="success"){
                        if(res.shopInfos.length==0){
                                
                        }else{


                        }

            }else{
                        let alert = this.alertController.create({
                            title: '서버로부터의 잘못된 응답을 받았습니다. 잠시후 다시 시도해주시기 바랍니다',
                            subTitle: res.error,
                            buttons: ['OK']
                        });
                        alert.present();
            }
      },(error)=>{
          if(error=="NetworkFailure"){
                      this.translateService.get('NetworkProblem').subscribe(
                      NetworkProblem => {
                              this.translateService.get('checkNetwork').subscribe(
                                  checkNetwork => {
                                      let alert = this.alertController.create({
                                          title: NetworkProblem,
                                          subTitle: checkNetwork,//'네트웍상태를 확인해 주시기바랍니다',
                                          buttons: ['OK']
                                      });
                                      alert.present();
                                  });
                      });

          }else{
                        let alert = this.alertController.create({
                            title: '서버로부터의 응답이 없습니다. 잠시후 다시 시도해주시기 바랍니다',
                            buttons: ['OK']
                        });
                        alert.present();
          }
      });
  }
}
