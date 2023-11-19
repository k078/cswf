import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerzamelingUpdateComponent } from './verzameling-update.component';

describe('VerzamelingUpdateComponent', () => {
  let component: VerzamelingUpdateComponent;
  let fixture: ComponentFixture<VerzamelingUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerzamelingUpdateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerzamelingUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
