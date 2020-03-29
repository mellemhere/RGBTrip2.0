import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {EfeitoModalComponent} from '../efeito-modal/efeito-modal.component';
import {MqttControllerService} from '../mqtt-controller.service';

interface Efeito {
    nome: string;
    id: number;
}

@Component({
    selector: 'app-efeitos',
    templateUrl: 'efeitos.page.html',
    styleUrls: ['efeitos.page.scss']
})
export class EfeitosPage implements OnInit {

    private effectModal;

    constructor(public modalController: ModalController, public wsService: MqttControllerService) {
        console.log('sub');
        wsService.effectChange.subscribe(async (effect) => {
            if (effect !== false) {
                await this.openCurrentEffect();
            } else {
                await this.closeCurrentEffect();
            }
        });

        this.checkState();
    }

    async checkState() {
        if (this.wsService.getCurrentEffect !== false) {
            await this.openCurrentEffect();
        }
    }

    async closeCurrentEffect() {
        if (this.effectModal) {
            console.log('Fechando');
            await this.effectModal.dismiss();
        } else {
            console.log('Nao tem nada para fechar');
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

    ngOnInit(): void {
        // this.openCurrentEffect();
    }

}
