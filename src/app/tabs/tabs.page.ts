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
    private lastState: boolean;
    private interval;

    constructor(public loadingController: LoadingController,
                private wsService: WsControllerService,
                private route: Router) {
        wsService.connection.subscribe(async (state) => {
            if (state !== this.lastState) {
                this.lastState = state;
                await this.handleLoading(state);
            }
        });


        wsService.effectChange.subscribe(async (effect) => {
            if (effect !== false) {
                await route.navigateByUrl('tabs/efeitos');
            }
        });

        /*
             Fix para sempre tentarmos fechar os loadings...
         */
        setInterval(() => {
            if (this.wsService.connected) {
                this.whilePromise(
                    () => this.loadingController.getTop().then(topLoader => topLoader != null),
                    () => this.loadingController.dismiss()
                );
            }
        }, 500);

    }

    private whilePromise(condition: () => Promise<boolean>, action: () => Promise<boolean>) {
        condition().then(value => {
            if (value) {
                action().then(closed => {
                    if (closed) {
                        this.whilePromise(condition, action);
                    }
                });
            }
        });
    }

    private async handleLoading(state: boolean) {
        if (!state && this.loading === false) {
            this.loading = await this.loadingController.create({
                message: 'Conectado as luzes'
            });
            await this.loading.present();

            clearInterval(this.interval);
            this.interval = setInterval(() => {
                if (this.wsService.connected) {
                    this.handleLoading(true);
                }
            }, 2000);

        } else {
            try {
                await (this.loading as HTMLIonLoadingElement).dismiss();
                this.loading = false;
                clearInterval(this.interval);
            } catch (e) {
                /*
                    Tentar denovo em alguns segundos
                 */
                setTimeout(() => {
                    this.handleLoading(state);
                }, 500);
            }
        }
    }


}
