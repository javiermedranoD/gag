import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker,ImagePickerOptions } from '@ionic-native/image-picker';
import {CargaArchivoProvider} from "../../providers/carga-archivo/carga-archivo";

@Component({
  selector: 'page-subir',
  templateUrl: 'subir.html',
})
export class SubirPage {
  titulo:string ="";
  imgPreview:string ="";
  img64:string;

  constructor(private viewCtrl: ViewController,
              private camera: Camera,
              private imagePicker: ImagePicker,
              public _cap:CargaArchivoProvider) {
  }

  close_modal(){
    this.viewCtrl.dismiss();
  }

  mostrar_camara(){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.imgPreview = 'data:image/jpeg;base64,' + imageData;
     this.img64 = imageData;
    }, (err) => {
     console.warn("Error en cámara", JSON.stringify(err));
    });
  }

  select_img(){
    let options: ImagePickerOptions = {
      quality: 78,
      outputType: 1,
      maximumImagesCount: 1
    }
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
          //console.log('Image URI: ' + results[i]);
          this.imgPreview = 'data:image/jpeg;base64,' + results[i];
          this.img64 = results[i];
      }
    }, (err) => {
        console.log("Error en selector", JSON.stringify(err));
    });
  }

  saveImg(){
    let archivo={
      img: this.img64,
      titulo: this.titulo
    }
    this._cap.loadImgFirebase(archivo)
        .then(()=>this.close_modal());
  }

}
