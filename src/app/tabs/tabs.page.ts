import {Component} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {WsControllerService} from '../ws-controller.service';
import {Router} from '@angular/router';
@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    private loading: boolean | HTMLIonLoadingElement = false;

    constructor(public loadingController: LoadingController,
                private wsService: WsControllerService,
                private route: Router) {
        wsService.connection.subscribe(async (state) => {
            this.handleLoading(state);
        });

        wsService.effectChange.subscribe(async (effect) => {
            if (effect !== false) {
                await route.navigateByUrl('tabs/efeitos');
            }
        });
    }

    private async handleLoading(state: boolean) {
        if (!state && this.loading === false) {
            this.loading = await this.loadingController.create({
                message: 'Conectado as luzes'
            });
            await this.loading.present();
        } else if (this.loading !== false && state) {
            (this.loading as HTMLIonLoadingElement).dismiss();
            this.loading = false;
        }
    }


}
