import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router: Router) {}

  ngOnInit(){
    // this.updateCurrentStep();
    this.router.events.subscribe(() => {
      this.updateCurrentStep();
    });
  }
  title = 'GAming';
  isActive(route: string): boolean {
    return this.router.url === route;
  }

  hideImage:number = 1;
  private updateCurrentStep() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/lottery')) {
      this.hideImage = 0;
    }  else {
      this.hideImage = 1;
    }
  }


}
