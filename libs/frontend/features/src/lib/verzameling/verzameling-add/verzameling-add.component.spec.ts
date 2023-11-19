import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerzamelingAddComponent } from './verzameling-add.component';

describe('VerzamelingAddComponent', () => {
  let component: VerzamelingAddComponent;
  let fixture: ComponentFixture<VerzamelingAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerzamelingAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerzamelingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
