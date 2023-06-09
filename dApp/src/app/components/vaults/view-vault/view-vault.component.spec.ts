import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVaultComponent } from './view-vault.component';

describe('ViewVaultComponent', () => {
  let component: ViewVaultComponent;
  let fixture: ComponentFixture<ViewVaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewVaultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
