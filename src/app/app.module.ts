import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {EfeitoEmAndamentoComponent} from './efeito-em-andamento/efeito-em-andamento.component';
import {EfeitoModalComponent} from './efeito-modal/efeito-modal.component';

@NgModule({
  declarations: [AppComponent, EfeitoEmAndamentoComponent, EfeitoModalComponent],
  entryComponents: [EfeitoEmAndamentoComponent, EfeitoModalComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
