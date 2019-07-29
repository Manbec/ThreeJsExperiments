import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Threebeginners2Component } from './threebeginners2.component';

describe('Threebeginners2Component', () => {
  let component: Threebeginners2Component;
  let fixture: ComponentFixture<Threebeginners2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Threebeginners2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Threebeginners2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
