import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeVoituresComponent } from './liste-voitures.component';

describe('ListeVoituresComponent', () => {
  let component: ListeVoituresComponent;
  let fixture: ComponentFixture<ListeVoituresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeVoituresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeVoituresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
