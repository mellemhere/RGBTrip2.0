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
    }

    public filtroEfeitos(efeito: Effect) {
        return efeito.id > 0;
    }

    async closeCurrentEffect() {
        if (this.effectModal) {
            await this.effectModal.dismiss();
        }
    }

    async openCurrentEffect() {
        await this.closeCurrentEffect();

        this.effectModal = await this.modalController.create({
            component: EfeitoModalComponent,
            backdropDismiss: false,
            cssClass: 'efeito-modal',
            mode: 'md'
        });
        await this.effectModal.present();
    }

    public startEffect(effectId: number) {
        this.wsService.sendMessage('effect_start', effectId);
    }

}
