import {Component,NgZone} from "@angular/core";
import {NavController,NavParams,AlertController,Platform} from 'ionic-angular';
import{ShopTablePage} from '../shoptable/shoptable';
import {Splashscreen} from 'ionic-native';
import {PrinterProvider} from '../../providers/printerProvider';
import {StorageProvider} from '../../providers/storageProvider';
import { NativeStorage } from '@ionic-native/native-storage';
import {IosPrinterProvider} from '../../providers/ios-printer';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-printer',
  templateUrl: 'printer.html',
})

export class PrinterPage {
    printerlist=[];
    printerStatus;  
    printerEmitterSubscription;
    printOn;

  constructor(private navController: NavController, private navParams: NavParams,public printerProvider:PrinterProvider,
                private alertController:AlertController,private ngZone:NgZone,private nativeStorage: NativeStorage,
                public storageProvider:StorageProvider,private iosPrinterProvider:IosPrinterProvider,
                private platform:Platform,public events: Events){
           console.log("PrinterPage construtor-printOn"+this.storageProvider.printOn);
           this.printOn=this.storageProvider.printOn;
  }

   ionViewDidLoad(){
        console.log("SelectorPage did enter");
        Splashscreen.hide();
        this.events.subscribe('printer:status', (status) => {
                    console.log("printer status:"+status);
                    this.ngZone.run(()=>{
                        this.printerStatus=status;
                        console.log("ngZone=> change status into "+this.printerStatus);
                    });
        });
  }

  selectPrinter(printer){
      console.log("selectPrinter:"+printer);
      if(this.platform.is('android')){
            this.printerProvider.printer=printer;
      }else if(this.platform.is('ios')){
            this.iosPrinterProvider.printer=printer;
      }
  }
 
  scanPrinter(){
      console.log("scanPrinter");
      if(this.platform.is('android')){
            this.printerProvider.scanPrinter().then((list:any)=>{
                this.ngZone.run(()=>{    
                        this.printerlist=list;
                        console.log("pinterlist:"+JSON.stringify(this.printerlist));
                });
            },(error)=>{
                this.printerlist=[];
                let alert = this.alertController.create({
                    title: '프린터가 검색되지 않았습니다.',
                    subTitle: '네트워크->블루투스 설정에서 장치를 검색후 등록하여 주시기바랍니다',
                    buttons: ['OK']
                });
                alert.present();
            });
      }else if(this.platform.is('ios')){ //ios
            this.iosPrinterProvider.scanPrinter().then((list:any)=>{
                this.ngZone.run(()=>{    
                        this.printerlist=list;
                        console.log("pinterlist:"+JSON.stringify(this.printerlist));
                });
            },(error)=>{
                this.printerlist=[];
                let alert = this.alertController.create({
                    title: '프린터가 검색되지 않았습니다.',
                    subTitle: '네트워크->블루투스 설정에서 장치를 검색후 등록하여 주시기바랍니다',
                    buttons: ['OK']
                });
                alert.present();
            });
      }
  }

  testPrinter(){
      if(this.platform.is('android')){
        this.printerProvider.print("주문","프린터가 동작합니다").then(()=>{
            console.log("프린트 명령을 보냈습니다. ");
        },()=>{
            let alert = this.alertController.create({
                title: '프린트 명령을 보내는것에 실패했습니다.',
                buttons: ['OK']
            });
            alert.present();
        });
      }else if(this.platform.is('ios')){
        this.iosPrinterProvider.print("Test","프린터가 동작합니다").then(()=>{
            console.log("프린트 명령을 보냈습니다. ");
        },()=>{
            let alert = this.alertController.create({
                title: '프린트 명령을 보내는것에 실패했습니다.',
                buttons: ['OK']
            });
            alert.present();
        });
      }
  }

  connectPrinter(){
       if(this.platform.is('android')){
                this.printerProvider.connectPrinter().then((status)=>{
                            console.log("connectPrinter:"+status);
                            this.printerStatus=status;
                            if(status=="lost"){
                                let alert = this.alertController.create({
                                    title: '프린터에 연결할수 없습니다.',
                                    subTitle: '네트워크->블루투스 설정에서 등록된 장치를 삭제후 다시 검색하여 등록해 주시기바랍니다',
                                    buttons: ['OK']
                                });
                                alert.present();

                            }else if(status=="unable"){
                                let alert = this.alertController.create({
                                    title: '프린터에 연결할수 없습니다.',
                                    subTitle: '프린터를 상태를 확인해 주시기바랍니다',
                                    buttons: ['OK']
                                });
                                alert.present();
                            }else{
                                //////////////////////////////////
                                // connected, connecting
                                console.log("connected or connecting status");
                            }
                },(err)=>{
                            console.log("fail to connect");
                                let alert = this.alertController.create({
                                    title: '프린터에 연결할수 없습니다.',
                                    subTitle: '프린터를 상태를 확인해 주시기바랍니다',
                                    buttons: ['OK']
                                });
                                alert.present();
                });
       }else if(this.platform.is('ios')){
                console.log("call this.iosPrinterProvider.connectPrinter");
                this.iosPrinterProvider.connectPrinter().then((status)=>{
                            console.log("connectPrinter:"+status);
                            this.printerStatus=status;
                            if(status=="lost"){
                                let alert = this.alertController.create({
                                    title: '프린터에 연결할수 없습니다.',
                                    subTitle: '네트워크->블루투스 설정에서 등록된 장치를 삭제후 다시 검색하여 등록해 주시기바랍니다',
                                    buttons: ['OK']
                                });
                                alert.present();

                            }else if(status=="unable"){
                                let alert = this.alertController.create({
                                    title: '프린터에 연결할수 없습니다.',
                                    subTitle: '프린터를 상태를 확인해 주시기바랍니다',
                                    buttons: ['OK']
                                });
                                alert.present();
                            }else{
                                //////////////////////////////////
                                // connected, connecting
                                console.log("connected or connecting status");
                            }
                },(err)=>{
                            console.log("fail to connect");
                                let alert = this.alertController.create({
                                    title: '프린터에 연결할수 없습니다.',
                                    subTitle: '프린터를 상태를 확인해 주시기바랍니다',
                                    buttons: ['OK']
                                });
                                alert.present();
                });
       }
  }

  disconnectPrinter(){
      if(this.platform.is('android')){
            this.printerProvider.disconnectPrinter().then(()=>{
                        console.log("disconnect Success");
                        let alert = this.alertController.create({
                            title: '프린터 연결을 해제했습니다.',
                            buttons: ['OK']
                        });
                        alert.present();
                    },(err)=>{
                        console.log("Error:"+err);
                        let alert = this.alertController.create({
                            title: '프린터 연결 해제에 실패했습니다.',
                            buttons: ['OK']
                        });
                        alert.present();
                    });
      }else  if(this.platform.is('ios')){
            this.iosPrinterProvider.disconnectPrinter().then(()=>{
                        console.log("disconnect Success");
                        let alert = this.alertController.create({
                            title: '프린터 연결을 해제했습니다.',
                            buttons: ['OK']
                        });
                        alert.present();
                    },(err)=>{
                        console.log("Error:"+err);
                        let alert = this.alertController.create({
                            title: '프린터 연결 해제에 실패했습니다.',
                            buttons: ['OK']
                        });
                        alert.present();
                    });
      }
  }

  savePrinter(){
      if(this.platform.is('android')){
            this.nativeStorage.setItem('printer',this.printerProvider.printer);
            this.storageProvider.printerName=this.printerProvider.printer;
      }else if(this.platform.is('ios')){
            this.nativeStorage.setItem('printer',this.iosPrinterProvider.printer);
            this.storageProvider.printerName=this.iosPrinterProvider.printer;
      }
      //save it into localstorage
      this.storageProvider.printOn=this.printOn;
      this.nativeStorage.setItem("printOn",this.storageProvider.printOn.toString());
  }    

  printOnChange(){
      //save it into localstorage
      //console.log("printOn:"+this.printOn);
      this.storageProvider.printOn=this.printOn;
      console.log("save printOn as "+this.storageProvider.printOn.toString());
      this.nativeStorage.setItem("printOn",this.storageProvider.printOn.toString());
  }
}
