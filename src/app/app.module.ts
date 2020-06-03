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
import {WsControllerService} from './ws-controller.service';

import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
import {FormsModule} from '@angular/forms';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
// const config: SocketIoConfig = {url: 'http://' + window.location.hostname, options: {}};
const config: SocketIoConfig = {url: 'http://192.168.100.10', options: {}};

@NgModule({
    declarations: [AppComponent, EfeitoEmAndamentoComponent, EfeitoModalComponent],
    entryComponents: [EfeitoEmAndamentoComponent, EfeitoModalComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        SocketIoModule.forRoot(config),
        FormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
    ],
    providers: [
        StatusBar,
        SplashScreen,
        WsControllerService,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
