import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink ,Router} from '@angular/router';
import { interval, Subscription, take } from 'rxjs';
import { APIServicesService } from '../api-services.service';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.css'
})

export class VerificationComponent {
  http=inject(HttpClient);
message: string = '';
messageType: 'success' | 'error' | '' = '';    
urls:any;
    constructor(private router: Router,private api:APIServicesService) {} 
  verificationform: FormGroup=new FormGroup({
    verificationcode:new FormControl('',[Validators.required]),
    referralcode:new FormControl ('')
  });
  countdown: number = 60; 
  showResendLayout: boolean = false; 
  countdownSubscription: Subscription | undefined;
  ngOnInit(): void {
    this.startCountdown();
  }
  startCountdown() {
    this.countdownSubscription = interval(1000)
      .subscribe((value) => {
        this.countdown = 60 - value - 1;
        if (this.countdown === 0) {
          this.showResendLayout = true; 
          this.countdownSubscription?.unsubscribe();
        }
      });
  }
  resetCountdown() {
    this.countdown = 60;
    this.showResendLayout = false;
    this.startCountdown();
  }

  onSubmit(){
    if(this.verificationform.invalid){
    this.verificationform.markAllAsTouched();
    return;
    }
    const formdata=this.verificationform.value;
      this.api.onHitVerifyOtpApi(formdata).subscribe((res:any)=>{
        this.message = 'Success !';
        this.messageType = 'success';
        // if(){}
        const accessMedium = res.headers.get('Access-Medium');
        localStorage.setItem('AuthToken', accessMedium);
        this.router.navigate(['/terms&Conditions']); 
    },
    (error) => {
      this.message = 'Invalid OTP ';
      this.messageType = 'error';
      return;
    } );
  }


  resendOTP(){
    this.api.onHitResendOtpeApi().subscribe((res:any)=>{
        this.message = 'Verification code successfully sent !';
        this.messageType = 'success';
        const accessMedium = res.headers.get('Access-Medium');
        localStorage.setItem('AuthToken', accessMedium);
        console.log(accessMedium);
        this.router.navigate(['/verification']); 
    },
    (error) => {
      this.message = 'Error occurred: ' + error.message;
      this.messageType = 'error';
      return;
    } );
  }


  toRegistration(){
    this.router.navigate(['/registration']);
      };
    
      toterms(){
        this.router.navigate(['/terms&Conditions']);
      }
}

