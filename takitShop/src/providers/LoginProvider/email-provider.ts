import {Injectable} from '@angular/core';

import {Http,Headers} from '@angular/http';
import {Platform} from 'ionic-angular';
import {StorageProvider} from '../storageProvider';

import 'rxjs/add/operator/map';

@Injectable()
export class EmailProvider{
    constructor(private platform:Platform,private http:Http,
                private storageProvider:StorageProvider){
        console.log("EmailProvider");            
        this.platform=platform; 
    }

  EmailServerLogin(email:string,password:string){
      console.log("email:"+email+"password:"+password);
      return new Promise((resolve, reject)=>{
              console.log("EmailServerLogin");
              let body = JSON.stringify({email:email,password:password,version:this.storageProvider.version});
              let headers = new Headers();
              headers.append('Content-Type', 'application/json');
              this.http.post(this.storageProvider.serverAddress+"/shop/emailLogin",body,{headers: headers}).map(res=>res.json()).subscribe((res)=>{
                //console.log("res:"+JSON.stringify(res));
                //let result={result:res.result,userInfo:res.userInfo};
                console.log("result:"+JSON.stringify(res));
                resolve(res); // 'success'(move into home page) or 'invalidId'(move into signup page)
            },(err)=>{
                 console.log("emailLogin no response");
                 reject("emailLogin no response");
             });
         });
  }

  logout(){
          return new Promise((resolve, reject)=>{
              console.log("logout");
              let headers = new Headers();
              headers.append('Content-Type', 'application/json');
              console.log("server: "+ this.storageProvider.serverAddress);
              let body = JSON.stringify({version:this.storageProvider.version});
              this.http.post(this.storageProvider.serverAddress+"/shop/logout",body,{headers: headers}).map(res=>res.json()).subscribe((res)=>{
                 resolve(res); // 'success'(move into home page) or 'invalidId'(move into signup page)
             },(err)=>{
                 console.log("logout no response "+JSON.stringify(err));
                 reject("logout no response");
             });
         });
  }  
}
