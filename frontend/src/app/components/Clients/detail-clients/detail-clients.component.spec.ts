import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailClientsComponent } from './detail-clients.component';

describe('DetailClientsComponent', () => {
  let component: DetailClientsComponent;
  let fixture: ComponentFixture<DetailClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
