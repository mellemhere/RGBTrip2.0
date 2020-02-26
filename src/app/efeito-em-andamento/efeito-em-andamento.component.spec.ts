import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EfeitoEmAndamentoComponent } from './efeito-em-andamento.component';

describe('EfeitoEmAndamentoComponent', () => {
  let component: EfeitoEmAndamentoComponent;
  let fixture: ComponentFixture<EfeitoEmAndamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EfeitoEmAndamentoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EfeitoEmAndamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
