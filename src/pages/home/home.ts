import { Component } from '@angular/core';
import {ModalController } from 'ionic-angular';

// import { AngularFireDatabase } from 'angularfire2/database';
// import { Observable } from 'rxjs/Observable';

import {SubirPage} from "../subir/subir";
import {CargaArchivoProvider} from "../../providers/carga-archivo/carga-archivo";

//PLUGINS
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  moreImg:boolean = true;
  // posts: Observable<any[]>;

  constructor(private modalCtrl:ModalController,
              private _cap: CargaArchivoProvider,
              private socialSharing: SocialSharing) {
    //this.posts = afDB.list('post').valueChanges();
  }

  mostrar_modal(){
    let modal = this.modalCtrl.create(SubirPage);
    modal.present();
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
      this._cap.cargar_imagenes().then(
            (moreImg:boolean)=>{
              this.moreImg = moreImg;
              console.info(moreImg);
              infiniteScroll.complete()}
      );
  }

  convertToDataURLviaCanvas(url, outputFormat){
    return new Promise((resolve, reject) => {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      let canvas = <HTMLCanvasElement> document.createElement('CANVAS'),
      ctx = canvas.getContext('2d'),dataURL;
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      resolve(dataURL);
      canvas = null;
    };
    img.src = url;
  });
}

compartir(urldeimagen:any) {
 this.convertToDataURLviaCanvas(urldeimagen, "image/jpeg").then(urldeimagen => {

 let urlbase64 = String(urldeimagen);

 this.socialSharing.shareViaFacebook(null,urlbase64,null).then(() => {
 // Success!
   }).catch(() => {
      // Error!
   });

 });

}

  // compartir(post:any){
  //
  //   this.socialSharing.shareViaFacebook(post.titulo,null, post.url).then(() => {
  //
  //   }).catch(() => {
  //   // Error!
  //   });
  // }
}
