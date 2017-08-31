import { Injectable } from '@angular/core';
import {Platform,Events} from 'ionic-angular';

declare var modusecho:any;

/*
  Generated class for the IosPrinterProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class IosPrinterProvider{
    public printer:string;
    printerStatus:string;  //connected, disconnected
    printerlist; // array of  printers

    constructor(public events: Events) {
      console.log('Hello IosPrinterProvider Provider');
    }

    setPrinter(printer){
        this.printer=printer;
    }

    scanPrinter(){
        return new Promise((resolve,reject)=>{
            console.log("scanPrinter");
            this.printerlist=[];

            modusecho.scanAvailableDevices((data:any)=>{
                console.log(" scanAvailableDevices comes "+JSON.stringify(data));
                this.printerlist=data;
            },(error)=>{
                console.log("scanAvailableDevices error");
                this.printer=undefined;
                this.printerStatus=undefined;
                reject(error);
            });
            setTimeout(() => {
                console.log(" scanPrinter returns with "+JSON.stringify(this.printerlist));
                resolve(this.printerlist);;
            },1000); // one second. Is it too big?
        });
    }

    connectPrinter(){
        return new Promise((resolve,reject)=>{
          if(this.printer){
            this.printerlist=[];

            let timer=setTimeout(() => {
                        reject(this.printer+" is not discovered");
                      },1000); // one second. Is it too big?

            modusecho.scanAvailableDevices((data:any)=>{
                console.log(" scanAvailableDevices comes "+JSON.stringify(data));
                this.printerlist=data;
                let printerlist:string[]=data;
                if(printerlist.indexOf(this.printer)>=0){
                    let id=this.printerlist.indexOf(this.printer); 
                    modusecho.connectToDevice(id,(result)=>{
                        console.log(" connectToDevices comes "+JSON.stringify(result));
                        if(result==="connected"){
                            this.printer=this.printerlist[id];
                            this.printerStatus="connected";
                            this.events.publish('printer:status', this.printerStatus);
                            resolve(this.printerStatus);
                        }else if(result==="disconnected"){
                            this.printerStatus="disconnected";
                            this.events.publish('printer:status', this.printerStatus);                            
                        }
                        if(timer){
                            clearTimeout(timer);
                            timer=undefined;
                        }
                    },(error)=>{
                        console.log("error");
                        this.printerStatus=undefined;
                        clearTimeout(timer);
                        reject(error);
                    });
                }
            },(error)=>{
                console.log("scanAvailableDevices error");
                this.printer=undefined;
                this.printerStatus=undefined;
            });
          }else{ // this.printer is null or undefined. Connect to the first printer. Should I reject it?
            console.log("printer is not specified. Just connect the first one");
            this.printerlist=[];

            let timer=setTimeout(() => {
                        console.log("timeout happens");
                        reject("Printer is not discovered");
                      },1000); // one second. Is it too big?

            modusecho.scanAvailableDevices((data:any)=>{
                console.log(" scanAvailableDevices comes "+JSON.stringify(data));
                this.printerlist=data;
                    let id=0; 
                    modusecho.connectToDevice(id,(result)=>{
                        console.log(" connectToDevices comes "+JSON.stringify(result));
                        if(result=="connected"){
                            this.printer=this.printerlist[id];
                            this.printerStatus="connected";
                            this.events.publish('printer:status', this.printerStatus);
                            resolve(this.printerStatus);
                        }else{
                            this.printerStatus="disconnected";
                            this.events.publish('printer:status', this.printerStatus);
                        }
                        if(timer){
                            clearTimeout(timer);
                            timer=undefined;
                        }
                    },(error)=>{
                        console.log("error");
                        this.printerStatus=undefined;
                        clearTimeout(timer);
                        reject(error);
                    });
            });
          }
         });
    }

    disconnectPrinter(){ // Is it necessary? Just restart application.
        return new Promise((resolve,reject)=>{  
            modusecho.disconnectToDevice((result)=>{
                console.log(" disconnectToDevice comes");
                this.printerStatus="disconnected";
                this.events.publish('printer:status', this.printerStatus);
                resolve();
            },(error)=>{
                console.log("error");
                reject();
            });
        });
    }

    print(title,message){
        console.log("printStatus:"+this.printerStatus);
        return new Promise((resolve,reject)=>{      
            if(this.printerStatus=="connected"){
                /* data : The string data
                    width : Increase width (Value – True/False)
                    height : Increase height (Value – True/False)
                    bold : Make string bold (Value – True/False)
                    underline : To underline the string (Value – True/False)
                    minifont : Select font(Value – True/False), True : Font size 9x17, False : Font size 12x24 */  
                    modusecho.printText(title,1,(result)=>{
                        console.log(" printTitle success");
                        modusecho.printText(message+"\n\n\n\n",0,(result)=>{
                            resolve();  
                        },(err)=>{
                            reject(err);
                        });
                    },(error)=>{
                        console.log("printTitle error");
                            reject(error);
                    });
            }else{ //Please try connection
                this.connectPrinter().then(()=>{
                    modusecho.printText(title,1,(result)=>{
                        console.log(" printTitle success");
                        modusecho.printText(message,0,(result)=>{
                            resolve();  
                        },(err)=>{
                            reject(err);
                        });
                    },(error)=>{
                        console.log("printTitle error");
                            reject(error);
                    });
                },(error)=>{
                    reject(error);
                });
            }
        });
    }
}
