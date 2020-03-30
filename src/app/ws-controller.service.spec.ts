import { TestBed } from '@angular/core/testing';

import { WsControllerService } from './ws-controller.service';

describe('WsControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsControllerService = TestBed.get(WsControllerService);
    expect(service).toBeTruthy();
  });
});
