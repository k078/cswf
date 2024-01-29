import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtiestUpdateComponent } from './artiest-update.component';

describe('ArtiestUpdateComponent', () => {
  let component: ArtiestUpdateComponent;
  let fixture: ComponentFixture<ArtiestUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtiestUpdateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtiestUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
