import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LpUpdateComponent } from './lp-update.component';

describe('LpUpdateComponent', () => {
  let component: LpUpdateComponent;
  let fixture: ComponentFixture<LpUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LpUpdateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LpUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
