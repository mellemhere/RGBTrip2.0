import {Component} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {MqttControllerService} from '../mqtt-controller.service';
import {Router} from '@angular/router';
@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {


    private loading: boolean | HTMLIonLoadingElement = false;

    constructor(public loadingController: LoadingController,
                private mqttController: MqttControllerService,
                private route: Router) {
        mqttController.connection.subscribe(async (state) => {
            this.handleLoading(state);
        });

        mqttController.effectChange.subscribe(async (effect) => {
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
