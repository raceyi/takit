import {Component} from "@angular/core";
import {NavController,NavParams} from 'ionic-angular';
import {App} from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';

@Component({
  selector:'page-serviceinfo',
  templateUrl: 'serviceinfo.html'
})

export class ServiceInfoPage{
     version:string;
     
     constructor(private app: App,private navController: NavController, 
        private navParams: NavParams,private storageProvider:StorageProvider){
	      console.log("ServiceInfoPage constructor");
        this.version=this.storageProvider.version;
     }

     ionViewWillUnload(){
        console.log("ionViewWillUnload-ServiceInfoPage");
     }

}


