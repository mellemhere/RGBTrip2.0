import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {EfeitoModalComponent} from '../efeito-modal/efeito-modal.component';
import {Effect, WsControllerService} from '../ws-controller.service';

@Component({
    selector: 'app-efeitos',
    templateUrl: 'efeitos.page.html',
    styleUrls: ['efeitos.page.scss']
})
export class EfeitosPage {

    private effectModal;

    constructor(public modalController: ModalController, public wsService: WsControllerService) {
        wsService.effectChange.subscribe(async (effect) => {
            if (effect !== false) {
                await this.openCurrentEffect();
            } else {
                await this.closeCurrentEffect();
            }
        });

        this.checkState().then(() => {
        });
    }


    public filtroEfeitos(efeito: Effect) {
        return efeito.id > 0;
    }

    async checkState() {
        if (this.wsService.currentEffect !== false) {
            await this.openCurrentEffect();
        }
    }

    async closeCurrentEffect() {
        if (this.effectModal) {
            await this.effectModal.dismiss();
        }
    }

    async openCurrentEffect() {
        this.closeCurrentEffect();

        this.effectModal = await this.modalController.create({
            component: EfeitoModalComponent,
            backdropDismiss: false,
            cssClass: 'efeito-modal',
            mode: 'md'
        });
        console.log(this.effectModal);
        await this.effectModal.present();
    }

    public startEffect(effectId: number) {
        console.log('oi');
        this.wsService.sendMessage('effect_start', effectId);
    }

}
