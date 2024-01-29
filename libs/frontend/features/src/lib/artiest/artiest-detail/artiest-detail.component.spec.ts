import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtiestDetailComponent } from './artiest-detail.component';

describe('ArtiestDetailComponent', () => {
  let component: ArtiestDetailComponent;
  let fixture: ComponentFixture<ArtiestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtiestDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtiestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
