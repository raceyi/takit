import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
/*
  Generated class for the SalesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-sales-page',
  templateUrl: 'sales-page.html'
})
export class SalesPage {
  Option="today";
  startDate;
  endDate;
  statistics=[];
  sales=0;

  constructor(public navCtrl: NavController, public navParams: NavParams,private alertController:AlertController,
        private serverProvider:ServerProvider,public storageProvider:StorageProvider) {
    var date=new Date();
    var month=date.getMonth()+1;

    this.startDate=this.getTodayString();
    this.endDate=this.getTodayString();
    this.changeValue('today');
  }

  getTodayString(){
    var d = new Date();
    var mm = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1); // getMonth() is zero-based
    var dd  = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
    var dString=d.getFullYear()+'-'+(mm)+'-'+dd;
    return dString;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SalesPagePage');
  }
  
  startPicker(startDate){

  }

  endPicker(endDate){

  }

   sortBySales(array) {
    return array.sort(function(a, b) {       
        return ((parseInt(a.menuSales) > parseInt(b.menuSales)) ? -1 : ((parseInt(a.menuSales) < parseInt(b.menuSales)) ? 1 : 0));
    });
   }

  searchPeriod(){
   if(this.startDate==undefined || this.endDate==undefined){
      // 시작일과 종료일을 설정해 주시기 바랍니다. 
      let alert = this.alertController.create({
                    title: '시작일과 종료일을 설정해 주시기 바랍니다',
                    buttons: ['OK']
                });
                alert.present();
      return;
    }
    //check the validity of startDate and endDate
    var startDate=new Date(this.startDate);
    var endDate=new Date(this.endDate);
    var currDate=new Date(); 
    console.log(startDate.getTime());
    console.log(endDate.getTime());
    if(startDate.getTime()>endDate.getTime()){
         // 시작일은 종료일보다 늦을수 없습니다.  
          let alert = this.alertController.create({
              title: '시작일은 종료일보다 늦을수 없습니다',
              buttons: ['OK']
          });
          alert.present();
         return;
    }
    if(endDate.getTime()>currDate.getTime()){
         // 시작일은 종료일보다 늦을수 없습니다.  
          let alert = this.alertController.create({
              title: '종료일은 현재시점보다 늦을수 없습니다.',
              buttons: ['OK']
          });
          alert.present();
         return;
         // 종료일은 현재시점보다 늦을수 없습니다.
    }
    // send getOrders request and update orders
     let body  = JSON.stringify({  takitId:this.storageProvider.myshop.takitId,option:"period",
                                   startTime:startDate.toISOString(), 
                                   endTime:endDate.toISOString()
                              });
      this.serverProvider.post("/shop/getSalesAndSatas",body).then((res:any)=>{
            if(res.result=="success"){
                  // show sales info
                   this.sales=res.sales;
                   let stats=[];
                   for(var i=0;i<res.stats.length;i++)
                        if(res.stats[i].menuSales!=undefined && res.stats[i].menuSales!=null && res.stats[i].menuSales!='0'){
                            stats.push(res.stats[i]);
                        }
                   this.statistics=this.sortBySales(stats);
            }else{
                  let alert = this.alertController.create({
                      title: '상점의 매출 정보를 알수 없습니다.',
                      subTitle: '상점 매출 정보를 읽어오는데 실패했습니다.',
                      buttons: ['OK']
                  });
                  alert.present();
            }
        },(err)=>{
              if(err=="NetworkFailure"){
                console.log("/shop/getSalesAndSatas error"+body);
                  let alert = this.alertController.create({
                                    title: '서버와 통신에 문제가 있습니다',
                                    subTitle: '네트웍상태를 확인해 주시기바랍니다',
                                    buttons: ['OK']
                                });
                  alert.present();
              }else{
                  let alert = this.alertController.create({
                                    title: '상점의 매출 정보를 알수 없습니다.',
                                    subTitle: '상점 매출 정보를 읽어오는데 실패했습니다.',
                                    buttons: ['OK']
                                });
                  alert.present();
              }
        });                              
  }

  changeValue(option){
    console.log("changeValue:"+option);
    if(option!="period"){
        //request getSalesAndSatas
        let body=JSON.stringify({takitId:this.storageProvider.myshop.takitId,option:option});
        this.serverProvider.post("/shop/getSalesAndSatas",body).then((res:any)=>{
            if(res.result=="success"){
                  // show sales info
                   this.sales=res.sales;
                   let stats=[];
                   for(var i=0;i<res.stats.length;i++)
                        if(res.stats[i].menuSales!=undefined && res.stats[i].menuSales!=null && res.stats[i].menuSales!='0'){
                            stats.push(res.stats[i]);
                        }
//                   console.log("stats:"+JSON.stringify(stats));
                   this.statistics=this.sortBySales(stats);
//                   console.log("statistics:"+JSON.stringify(this.statistics));
            }else{
                  let alert = this.alertController.create({
                      title: '상점의 매출 정보를 알수 없습니다.',
                      subTitle: '상점 매출 정보를 읽어오는데 실패했습니다.',
                      buttons: ['OK']
                  });
                  alert.present();
            }
        },(err)=>{
              if(err=="NetworkFailure"){
                console.log("/shop/getSalesAndSatas error"+body);
                  let alert = this.alertController.create({
                                    title: '서버와 통신에 문제가 있습니다',
                                    subTitle: '네트웍상태를 확인해 주시기바랍니다',
                                    buttons: ['OK']
                                });
                  alert.present();
              }else{
                  let alert = this.alertController.create({
                                    title: '상점의 매출 정보를 알수 없습니다.',
                                    subTitle: '상점 매출 정보를 읽어오는데 실패했습니다.',
                                    buttons: ['OK']
                                });
                  alert.present();
              }
        });
    }else{
        // user select search button
    }
  }

}
