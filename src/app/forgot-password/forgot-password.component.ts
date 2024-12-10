import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { APIServicesService } from '../api-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  message: string = '';
  messageType: 'success' | 'error' | '' = '';  
  constructor(private router: Router,private api:APIServicesService) {} 


  forgotpassword: FormGroup = new FormGroup({
    countrycode:new FormControl('',[Validators.required]),
    mobilenumber:new FormControl('',[Validators.required])
});



onSubmit(){
  
  if(this.forgotpassword.invalid){
 this.forgotpassword.markAllAsTouched();
 return;
}
const formvalues=this.forgotpassword.value;
this.api.onHitForgotPINApi(formvalues).subscribe((res: any) => {
 this.message = 'Verification code sent successfully!';
 this.messageType = 'success';
 this.router.navigate(['/reviewform']);
});

}

}
