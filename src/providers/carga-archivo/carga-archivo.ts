import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import {AngularFireDatabase} from "angularfire2/database";
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';

@Injectable()
export class CargaArchivoProvider {

  imagenes: ArchivoSubir[] = [];
  lastKey: string = null;

  constructor(public toastCtrl: ToastController,
              public afDB: AngularFireDatabase) {

    this.loadLastKey().subscribe( ()=> this.cargar_imagenes());
  }

  private loadLastKey(){
    return this.afDB.list('/post', ref=>ref.orderByKey().limitToLast(1)).valueChanges()
            .map( (post:any)=>{
                console.log(post);
                this.lastKey = post[0].key;
                this.imagenes.push( post[0] );
            });
  }

  cargar_imagenes(){
    return new Promise ( (resolve, reject)=>{
        this.afDB.list('/post',
          ref=> ref.limitToLast(3)
                   .orderByKey()
                   .endAt( this.lastKey )
              ).valueChanges().subscribe( (posts:any)=>{
                  posts.pop();
                    if(posts.length==0){
                      console.log('No hay mas registros');
                      resolve(false);
                      return;
                    }
                    this.lastKey = posts[0].key;
                    for(let i = posts.length-1; i>=0; i--){
                        let post = posts[i];
                        this.imagenes.push(post);
                    }
                    resolve(true);
              });
    });
  }

  loadImgFirebase( file:ArchivoSubir ){
    let promesa= new Promise((resolve,reject)=>{
      this.viewToast("Cargando...");

      let storeRef = firebase.storage().ref();
      let nombreArchivo:string = new Date().valueOf().toString();

      let uploadTask: firebase.storage.UploadTask =
          storeRef.child(`img/${ nombreArchivo }`)
                  .putString( file.img, 'base64', {contentType:'image/jpeg'});

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            ()=>{ }, //saber el % de cuantos Mbs se han subido
            (error) =>{
              //manejo de error
              console.log("Error en la carga");
              console.log(JSON.stringify(error));
              this.viewToast(JSON.stringify(error));
              reject();
            },
            ()=>{
              //Process OK
              console.log('Archivo Subido');
              this.viewToast("Imagen cargada correctamente");

              let url = uploadTask.snapshot.downloadURL;
              this.crear_post(file.titulo, url, nombreArchivo);
              resolve();

            }
          )
    });
    return promesa;
  }

  crear_post( titulo:string, url:string, nombreArchivo:string){
    let post: ArchivoSubir ={
      img:url,
      titulo: titulo,
      key: nombreArchivo
    };
    console.log( JSON.stringify(post));
    this.afDB.object(`/post/${ nombreArchivo }`).update(post);
    this.imagenes.push( post );
  }

  viewToast(msg:string){
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle'
    }).present();
  }

}

interface ArchivoSubir{
  titulo:string;
  img:string;
  key?:string;
}
