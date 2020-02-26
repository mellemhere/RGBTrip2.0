import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-efeito-em-andamento',
    templateUrl: './efeito-em-andamento.component.html',
    styleUrls: ['./efeito-em-andamento.component.scss'],
})
export class EfeitoEmAndamentoComponent implements OnInit {

    constructor(public modalController: ModalController) {
    }

    ngOnInit() {
    }

    async goToEffect() {
        await this.modalController.dismiss();
    }
}
