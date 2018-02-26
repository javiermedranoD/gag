import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

//plugins
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';

//firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyAVfRjFeMduXPEMBZsbasmHmhtQngJRL-Q",
  authDomain: "gag-88920.firebaseapp.com",
  databaseURL: "https://gag-88920.firebaseio.com",
  projectId: "gag-88920",
  storageBucket: "gag-88920.appspot.com",
  messagingSenderId: "754953402500"
};


//Pipes
import {PipesModule} from "../pipes/pipes.module";


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {SubirPage} from "../pages/subir/subir";
import { CargaArchivoProvider } from '../providers/carga-archivo/carga-archivo';
import { SocialSharing } from '@ionic-native/social-sharing';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SubirPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SubirPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    Camera,
    ImagePicker,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CargaArchivoProvider,
    SocialSharing
  ]
})
export class AppModule {}
