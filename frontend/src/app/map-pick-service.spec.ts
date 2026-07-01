import { TestBed } from '@angular/core/testing';

import { MapPickService } from './map-pick-service';

describe('MapPickService', () => {
  let service: MapPickService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapPickService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
