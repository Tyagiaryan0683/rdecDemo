import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { APIServicesService } from '../api-services.service';

@Component({
  selector: 'app-registeration',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './registeration.component.html',
  styleUrl: './registeration.component.css'
})
export class RegisterationComponent {
  http=inject(HttpClient);
  message: string = '';
  messageType: 'success' | 'error' | '' = '';     
   constructor(private router: Router,private api:APIServicesService) {} 
    registrationform: FormGroup = new FormGroup({
      countrycode:new FormControl('',[Validators.required]),
      mobilenumber:new FormControl('',[Validators.required])
  });

  ngOnInit(){
    // this.api.getAllLookups();
    // const lookup = this.api.getCachedLookups();
    // this.countryCodes=lookup?.phoneNumberCodes || []
    // console.log('Lookup',lookup);
    this.fetchCountryCodes();
  }
  
  countryCodes :any[]=[];

  fetchCountryCodes(): void {
    const requestBody = { lookups: ["phoneNumberCodes"] };
    this.api.getLookupsData(requestBody).subscribe({
      next: (response) => {
        if (response && response.phoneNumberCodes) {
          this.countryCodes = response.phoneNumberCodes.map((codes: any) => ({
            id: codes.id,
            name: codes.name,
          }));
        } else {
          console.warn('Unexpected response format:', response);
        }
      },
      error: (error) => {
        console.error('Failed to fetch countriescode:', error);
      }
    });
  } 


onSubmit(){
   if(this.registrationform.invalid){
  this.registrationform.markAllAsTouched();
  return;
}

const formvalues=this.registrationform.value;
this.api.onHitRegistrationApi(formvalues).subscribe((res: any) => {
    this.message = 'Verification code sent successfully!';
    this.messageType = 'success';
    const accessMedium = res.headers.get('Access-Medium');
    console.log(accessMedium);
    localStorage.setItem('AuthToken', accessMedium);
    this.router.navigate(['/verification']);
});
}


moveToVerification(){
  this.router.navigate(['/verification']);
}


}
