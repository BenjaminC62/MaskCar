import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeAgenceComponent } from './liste-agence.component';

describe('ListeAgenceComponent', () => {
  let component: ListeAgenceComponent;
  let fixture: ComponentFixture<ListeAgenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeAgenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeAgenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
