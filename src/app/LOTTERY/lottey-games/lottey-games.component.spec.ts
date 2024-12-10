import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotteyGamesComponent } from './lottey-games.component';

describe('LotteyGamesComponent', () => {
  let component: LotteyGamesComponent;
  let fixture: ComponentFixture<LotteyGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LotteyGamesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotteyGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
