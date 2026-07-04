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

  it('toggle activates the given target', () => {
    service.toggle('from');
    expect(service.activeTarget()).toBe('from');
  });

  it('toggle on the active target again cancels the pick mode', () => {
    service.toggle('from');
    service.toggle('from');
    expect(service.activeTarget()).toBeNull();
  });

  it('toggle switches directly between targets', () => {
    service.toggle('from');
    service.toggle('to');
    expect(service.activeTarget()).toBe('to');
  });

  it('reset clears both the active target and the picked location', () => {
    service.toggle('from');
    service.pickedLocation.set({ label: 'A', lat: 1, lng: 2 });

    service.reset();

    expect(service.activeTarget()).toBeNull();
    expect(service.pickedLocation()).toBeNull();
  });
});
