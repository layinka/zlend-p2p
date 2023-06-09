import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZlendBalanceComponent } from './zlend-balance.component';

describe('ZlendBalanceComponent', () => {
  let component: ZlendBalanceComponent;
  let fixture: ComponentFixture<ZlendBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZlendBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZlendBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
