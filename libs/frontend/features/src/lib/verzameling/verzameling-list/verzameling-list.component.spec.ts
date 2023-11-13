import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerzamelingListComponent } from './verzameling-list.component';

describe('VerzamelingListComponent', () => {
  let component: VerzamelingListComponent;
  let fixture: ComponentFixture<VerzamelingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerzamelingListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerzamelingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
