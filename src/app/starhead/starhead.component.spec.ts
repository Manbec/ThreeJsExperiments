import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {StarheadComponent} from './starhead.component';


describe('Threebeginners2Component', () => {
  let component: StarheadComponent;
  let fixture: ComponentFixture<StarheadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
