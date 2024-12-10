import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.css'
})
export class TermsAndConditionsComponent {



  

  toProfilePage(){
    return '/personaldetail';
  }

  decline_btn(){
    alert('Accepting terms and conditions is required to create an account');
  }
}
