import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtiestAddComponent } from './artiest-add.component';

describe('ArtiestAddComponent', () => {
  let component: ArtiestAddComponent;
  let fixture: ComponentFixture<ArtiestAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtiestAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtiestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
