import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router, RouterLink } from '@angular/router';
// import { Router} from '@angular/router';
import { APIServicesService } from '../api-services.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule ,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  http=inject(HttpClient);
  message: string = '';
  messageType: 'success' | 'error' | '' = '';   
  constructor(private router: Router,private api:APIServicesService) {} 
    loginForm:FormGroup=new FormGroup
  ({
    countrycode:new FormControl('',[Validators.required]),
    mobileNo:new FormControl('',[Validators.required,Validators.pattern('^[0-9]*$')]),
    accountpin:new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]) 
  });

  
  onlyAllowNumbers(event: KeyboardEvent): void {
    const charCode = event.charCode ? event.charCode : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

isPasswordVisible = false;

togglePasswordVisibility(pinInput: HTMLInputElement): void {
  this.isPasswordVisible = !this.isPasswordVisible;
  pinInput.type = this.isPasswordVisible ? 'text' : 'password';
}

onlyNumbers(event: KeyboardEvent): void {
  const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Tab', 'Enter'];
  if (!allowedKeys.includes(event.key)) {
      event.preventDefault(); 
  }
}

onSubmit() {
if(this.loginForm.invalid){
  this.loginForm.markAllAsTouched();
  return;
  }

  const formValue = this.loginForm.value;
  const formData = new FormData();
  formData.append('loginId', formValue.countrycode +formValue.mobileNo);
  formData.append('password', formValue.accountpin || ''); 
    this.api.onLogin(formData).subscribe((res:any)=>{
        this.message = 'Logged in successfully';
        this.messageType = 'success';
        // if()
        alert("login Successfully");
    },
    (error) => {
      this.message = 'Error occurred: ';
      this.messageType = 'error';
      return;
    });
}


forgotPin(){
  const header=new HttpHeaders({'Client-Type': 'WEB','Platform-Type':'JM'});
  this.http.post('https://d1-slp-api.supremelifeplatform.com/api/api/forgot-password', this.loginForm.value,{headers:header}).subscribe((res: any) => {
    if (!res.message.errorMessage) {
      alert('Verification code send Successfully');
    }
    else{
      alert('ERROR OCCUR');
    }
    });
}

moveToRegistration(){
  this.router.navigate(['/registration']);
}

moveToChangePIN(){
  this.router.navigate(['/forgotPassword']);

}

  

}
