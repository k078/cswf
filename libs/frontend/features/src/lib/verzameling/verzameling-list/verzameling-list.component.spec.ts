import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VerzamelingListComponent } from './verzameling-list.component';
import { VerzamelingService } from '../verzameling.service';

describe('VerzamelingListComponent', () => {
  let component: VerzamelingListComponent;
  let fixture: ComponentFixture<VerzamelingListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VerzamelingListComponent],
      providers: [VerzamelingService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerzamelingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
