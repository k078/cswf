import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtiestListComponent } from './artiest-list.component';

describe('ArtiestListComponent', () => {
  let component: ArtiestListComponent;
  let fixture: ComponentFixture<ArtiestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtiestListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtiestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
