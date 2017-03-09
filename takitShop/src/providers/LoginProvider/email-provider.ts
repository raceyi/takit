import {Injectable} from '@angular/core';

import {Http,Headers} from '@angular/http';
import {Platform} from 'ionic-angular';
import {StorageProvider} from '../StorageProvider';
import 'rxjs/add/operator/map';

@Injectable()
export class EmailProvider{
    constructor(private platform:Platform,private http:Http,private storageProvider:StorageProvider){
        this.platform=platform; 
        this.http=http;
    }

  EmailServerLogin(email:string,password:string){
      console.log("email:"+email+"password:"+password);
      return new Promise((resolve, reject)=>{
              console.log("EmailServerLogin");
              let body = JSON.stringify({email:email,password:password,version:this.storageProvider.version});
              let headers = new Headers();
              headers.append('Content-Type', 'application/json');

            this.http.post(this.storageProvider.serverAddress+"/shop/emailLogin",body,{headers: headers}).map(res=>res.json()).subscribe((res)=>{
                console.log("res:"+JSON.stringify(res));
                //let result={result:res.result,userInfo:res.userInfo};
                //console.log("result:"+JSON.stringify(result));
                resolve(res); // 'success'(move into home page) or 'invalidId'(move into signup page)
            },(err)=>{
                 console.log("emailLogin no response");
                 reject("emailLogin no response");
             });
         });
  }

  emailServerSignup(password,name,email,country,phone){
      return new Promise((resolve, reject)=>{
              console.log("emailServerSignup");
              let body = JSON.stringify({referenceId:"email_"+email,password:password,name:name,email:email
                            ,country:country,phone:phone,version:this.storageProvider.version});
              let headers = new Headers();
              headers.append('Content-Type', 'application/json');
              console.log("server:"+ this.storageProvider.serverAddress);

             this.http.post(this.storageProvider.serverAddress+"/signup",body,{headers: headers}).map(res=>res.json()).subscribe((res)=>{
                 resolve(res); // 'success'(move into home page) or 'invalidId'(move into signup page)
             },(err)=>{
                 console.log("signup no response");
                 reject("signup no response");
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
             this.http.post(this.storageProvider.serverAddress+"/logout",body,{headers: headers}).map(res=>res.json()).subscribe((res)=>{
                 resolve(res); // 'success'(move into home page) or 'invalidId'(move into signup page)
             },(err)=>{
                 console.log("logout no response "+JSON.stringify(err));
                 reject("logout no response");
             });
         });
  }

  unregister(){
          return new Promise((resolve, reject)=>{
              console.log("unregister");
              let headers = new Headers();
              headers.append('Content-Type', 'application/json');
              console.log("server: "+ this.storageProvider.serverAddress);
              let body = JSON.stringify({version:this.storageProvider.version});
             this.http.post(this.storageProvider.serverAddress+"/unregister",body,{headers: headers}).map(res=>res.json()).subscribe((res)=>{
                 resolve(res); // 'success'(move into home page) or 'invalidId'(move into signup page)
             },(err)=>{
                 console.log("unregister no response "+JSON.stringify(err));
                 reject("unregister no response");
             });
         });
  }
}
