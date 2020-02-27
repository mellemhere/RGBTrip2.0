import {Component} from '@angular/core';

interface Efeito {
    nome: string;
    id: number;
}

@Component({
    selector: 'app-efeitos',
    templateUrl: 'efeitos.page.html',
    styleUrls: ['efeitos.page.scss']
})
export class EfeitosPage {

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


    constructor() {
    }

}
