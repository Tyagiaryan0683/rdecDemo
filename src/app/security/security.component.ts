import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { APIServicesService } from '../api-services.service';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [ ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './security.component.html',
  styleUrl: './security.component.css'
})
export class SecurityComponent {
  personalDetailForm: any;
  constructor(private router: Router,private api:APIServicesService) {} 
  message: string = '';
  messageType: 'success' | 'error' | '' = '';   
  formData: any = {};
  ngOnInit(){
      this.fetchQuestions();
      const formdata=this.api.getSecurityFormData();
      if (formdata) {
        this.securityForm.patchValue({
          question1: formdata.securityDetails[0].questionCD || '',
          answer1: formdata.securityDetails[0].answer || '',
          question2: formdata.securityDetails[1].questionCD || '',
          answer2: formdata.securityDetails[1].answer || '',
          areYouPEP: formdata.miscellaneous.areYouPEP || '',
          familyMemberPEP: formdata.miscellaneous.familyMemberPEP || '',
          closeAssociatePEP: formdata.miscellaneous.closeAssociatePEP || '',
        });

      }
  }
  
  securityForm:FormGroup=new FormGroup({
    question1:new FormControl('',[Validators.required]),
    answer1:new FormControl('',[Validators.required, Validators.maxLength(50)]),
    question2:new FormControl('',[Validators.required]),
    answer2:new FormControl('',[Validators.required, Validators.maxLength(50)]),
    accountpin:new FormControl('',[Validators.required, Validators.minLength(5), Validators.maxLength(10)]),
    confirmpin:new FormControl('',[Validators.required, Validators.minLength(5), Validators.maxLength(10)]),
    areYouPEP: new FormControl('N') ,
    familyMemberPEP: new FormControl('N') ,
    closeAssociatePEP: new FormControl('N') ,
  });

  isAccountPinVisible: boolean = false; 
  isConfirmPinVisible: boolean = false; 
  isPasswordVisible = false;
  questionsList:any[]=[];

  fetchQuestions(): void {
    const requestBody = { lookups: ["securityQuestions"] };
    this.api.getLookupsData(requestBody).subscribe({
      next: (response) => {
        if (response && response.securityQuestions) {
          this.questionsList = response.securityQuestions.map((codes: any) => ({
            id: codes.id,
            name: codes.name,
          }));
        } else {
          console.warn('Unexpected response format:', response);
        }
      },
      error: (error) => {
        console.error('Failed to fetch Questions : ', error);
      }
    });
  } 



  toggleAccountPinVisibility() {
      this.isAccountPinVisible = !this.isAccountPinVisible; 
  }
  toggleConfirmPinVisibility() {
      this.isConfirmPinVisible = !this.isConfirmPinVisible; 
  }

  onlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Tab', 'Enter'];
    if (!allowedKeys.includes(event.key)) {
        event.preventDefault(); 
    }
  }

onSubmit(){
  this.securityForm.markAllAsTouched();
  if(this.securityForm.invalid){
    console.log(this.securityForm.value);
    return;
  }
  const formvalues=this.securityForm.value;
  const payload={
    id:null,
    miscellaneous: {
      areYouPEP: formvalues.areYouPEP,
      familyMemberPEP: formvalues.familyMemberPEP,
      closeAssociatePEP: formvalues.closeAssociatePEP,
    },
    securityDetails: {
      questionList: [
        { questionCD: formvalues.question1, answer: formvalues.answer1 },
        { questionCD:  formvalues.question2, answer: formvalues.answer2 },
      ],
      accountPin: formvalues.accountpin,
    },
  }
  this.api.onHitSecurityFormApi(payload).subscribe((res:any)=>{
    this.message = 'Success !';
    this.messageType = 'success';
    this.api.setResponse(res);

    this.router.navigate(['/reviewform']); 
},
(error) => {
  this.message = 'Error occurred: ' + error.message;
  this.messageType = 'error';
  return;
});

}


  toAddressPage(){
    this.router.navigate(['/addressform']);
  }


}
