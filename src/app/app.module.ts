import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {EfeitoEmAndamentoComponent} from './efeito-em-andamento/efeito-em-andamento.component';
import {EfeitoModalComponent} from './efeito-modal/efeito-modal.component';
import {MqttControllerService} from './mqtt-controller.service';

import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
const config: SocketIoConfig = {url: 'http://' + window.location.hostname, options: {}};

@NgModule({
    declarations: [AppComponent, EfeitoEmAndamentoComponent, EfeitoModalComponent],
    entryComponents: [EfeitoEmAndamentoComponent, EfeitoModalComponent],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, SocketIoModule.forRoot(config)],
    providers: [
        StatusBar,
        SplashScreen,
        MqttControllerService,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
