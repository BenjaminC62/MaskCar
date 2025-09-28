import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationReservationComponent } from './creation-reservation.component';

describe('CreationReservationComponent', () => {
  let component: CreationReservationComponent;
  let fixture: ComponentFixture<CreationReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationReservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
