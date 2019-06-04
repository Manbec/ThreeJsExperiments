import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Threebeginners1Component } from './threebeginners1.component';

describe('Threebeginners1Component', () => {
  let component: Threebeginners1Component;
  let fixture: ComponentFixture<Threebeginners1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Threebeginners1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Threebeginners1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
