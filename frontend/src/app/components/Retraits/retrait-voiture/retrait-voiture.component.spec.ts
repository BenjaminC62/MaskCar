import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetraitVoitureComponent } from './retrait-voiture.component';

describe('RetraitVoitureComponent', () => {
  let component: RetraitVoitureComponent;
  let fixture: ComponentFixture<RetraitVoitureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetraitVoitureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetraitVoitureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
