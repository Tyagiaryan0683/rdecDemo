import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { APIServicesService } from '../api-services.service';
import { PersonalDetailComponent } from '../personal-detail/personal-detail.component';
@Component({
  selector: 'app-review',
  standalone: true,
  imports: [],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {
personalDetailData: any;

constructor(private router:Router, private api: APIServicesService ){}


toSecurityForm(){
  this.router.navigate(['/securityform']);
}

editPersonalInfo(){
  const response=this.api.getResponse();
  this.api.setPersonalDetail(response.body.personalDetails);
  this.router.navigate(['/personaldetail']);  
}

editAddressInfo(){
  const apiresponse=this.api.getResponse();
  this.api.setAddressDetail1(apiresponse.body);
  this.router.navigate(['/addressform']);
}

editSecurityForm(){
  const apihit=this.api.getResponse();
  this.api.setSecurityDetails(apihit.body);
  this.router.navigate(['/securityform']);  
}

// navigateToForm(formName: string): void {
//   this.router.navigate([`/${formName}-form`]);
// }

}

