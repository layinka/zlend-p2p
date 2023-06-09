import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositAssetsComponent } from './deposit-assets.component';

describe('DepositAssetsComponent', () => {
  let component: DepositAssetsComponent;
  let fixture: ComponentFixture<DepositAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
