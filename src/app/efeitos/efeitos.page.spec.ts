import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { EfeitosPage } from './efeitos.page';

describe('EfeitosPage', () => {
  let component: EfeitosPage;
  let fixture: ComponentFixture<EfeitosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EfeitosPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EfeitosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
