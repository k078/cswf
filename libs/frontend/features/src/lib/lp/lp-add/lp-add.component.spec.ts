import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LpAddComponent } from './lp-add.component';

describe('LpAddComponent', () => {
  let component: LpAddComponent;
  let fixture: ComponentFixture<LpAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LpAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LpAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
