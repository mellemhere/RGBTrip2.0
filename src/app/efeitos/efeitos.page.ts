import {Component, OnInit} from '@angular/core';
import {EfeitoEmAndamentoComponent} from "../efeito-em-andamento/efeito-em-andamento.component";
import {ModalController} from "@ionic/angular";
import {EfeitoModalComponent} from "../efeito-modal/efeito-modal.component";

interface Efeito {
    nome: string;
    id: number;
}

@Component({
    selector: 'app-efeitos',
    templateUrl: 'efeitos.page.html',
    styleUrls: ['efeitos.page.scss']
})
export class EfeitosPage implements OnInit{

    public efeitos = [
        {
            nome: 'Clube Carvalho',
            id: 1
        },
        {
            nome: 'Strobo',
            id: 2
        },
        {
            nome: 'Balada',
            id: 3
        },
        {
            nome: 'YMCA',
            id: 4
        },
        {
            nome: 'Camaleão',
            id: 4
        },
    ] as Efeito[];


    constructor(public modalController: ModalController) {
    }


    async openCurrentEffect() {
        const modal = await this.modalController.create({
            component: EfeitoModalComponent,
            backdropDismiss: false,
            cssClass: 'efeito-modal',
            mode: 'md'
        });
        await modal.present();
        console.log('oi');
    }

    ngOnInit(): void {
        this.openCurrentEffect();
    }

}
