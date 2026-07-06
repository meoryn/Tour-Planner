import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { TourList } from './tour-list';

describe('TourList', () => {
  let component: TourList;
  let fixture: ComponentFixture<TourList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourList],
      providers: [MessageService],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
