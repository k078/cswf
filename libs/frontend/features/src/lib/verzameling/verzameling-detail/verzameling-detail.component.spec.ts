import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerzamelingDetailComponent } from './verzameling-detail.component';

describe('VerzamelingDetailComponent', () => {
  let component: VerzamelingDetailComponent;
  let fixture: ComponentFixture<VerzamelingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerzamelingDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerzamelingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
