import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { APIServicesService } from '../api-services.service';

@Component({
  selector: 'app-personal-detail',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NgSelectModule,],
  templateUrl: './personal-detail.component.html',
  styleUrl: './personal-detail.component.css'
})

export class PersonalDetailComponent   {

  maxDate!: string;
  http=inject(HttpClient);
  message: string = '';
  messageType: 'success' | 'error' | '' = '';   

  personalDetailForm:FormGroup=new FormGroup({
    profilepic:new FormControl(''),
    firstname:new FormControl('',[Validators.required]),
    middlename:new FormControl(''),
    lastname:new FormControl('',[Validators.required]),
    dateofbirth:new FormControl('',[Validators.required]),
    gender:new FormControl('',[Validators.required]),
    countryofbirth:new FormControl('',[Validators.required]),
    nationality:new FormControl('',[Validators.required]),
    acceptTermsYN:new FormControl(true)
  });

  constructor(private router: Router,private api:APIServicesService) {

  } 


  ngOnInit(){
    this.fetchAllLookups();
    const formdata=this.api.getPersonalDetailData();
    if (formdata) {
      this.personalDetailForm.patchValue({
        firstname: formdata.firstName || '',
        middlename: formdata.middleName || '',
        lastname: formdata.lastName || '',
        dateofbirth: formdata.dob || '',
        gender: formdata.genderCD || '',
        countryofbirth: formdata.countryOfBirthCD || '',
        nationality: formdata.nationality || '',
        // profilepic: formdata.profileImage
      });
      if (formdata.profileImage) {
        this.profileImgSrc = formdata.profileImage; 
      }
    }


     const today = new Date();
    const maxDate = new Date(today.setFullYear(today.getFullYear() - 18));
    this.maxDate = maxDate.toISOString().split('T')[0];
  }



  @ViewChild('fileInput') fileInput!: ElementRef;
  onSelectFile(): void {
    this.fileInput.nativeElement.click();
  }
  profileImgSrc: string | ArrayBuffer | null = null;
  selectedProfile:File|null=null;
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this. selectedProfile=file;
        this.profileImgSrc = reader.result as string; 
      };
      reader.readAsDataURL(file);
    }
  }

  lookupData: any = {
    genderList: [],
    countryList: [],
  };
fetchAllLookups(): void {
    const requestBody = { lookups: ["gender", "countries"] };
    this.api.getLookupsData(requestBody).subscribe({
      next: (response) => {
        if (response) {
          if (response.gender) {
            this.lookupData.genderList = response.gender.map((codes: any) => ({
              id: codes.id,
              name: codes.name
            }));
          }        
          if (response.countries) {
            this.lookupData.countryList = response.countries.map((codes: any) => ({
              id: codes.id,
              name: codes.name
            }));
          }
        }
         else {
          console.warn('Unexpected response format:', response);
        }
      },
      error: (error) => {
        console.error('Failed to fetch lookups:', error);
      }
    });
  }

  onSubmit(){
    if(this.personalDetailForm.invalid){
      this.personalDetailForm.markAllAsTouched();
      return;
    }
    const formValue = this.personalDetailForm.value;
    const formData = new FormData();
    formData.append('firstName', formValue.firstname);
    formData.append('middleName', formValue.middleName || ''); 
    formData.append('lastName', formValue.lastname);
    formData.append('dob', formValue.dateofbirth);
    formData.append('genderCD', formValue.gender);
    formData.append('countryOfBirthCD', formValue.countryofbirth);
    formData.append('nationality', formValue.nationality);
    if (this.selectedProfile) {
      formData.append('profileImage', this.selectedProfile); 
    } else {
      formData.append('profileImage', '');
    }
    formData.append('acceptTermsYN', 'true');
      this.api.onHitPersonalDetailApi(formData).subscribe((res:any)=>{
        this.message = 'Success !';
        this.messageType = 'success';
        this.router.navigate(['/addressform']); 
    },
    (error) => {
      this.message = 'Error occurred: ' + error.message;
      this.messageType = 'error';
      return;
    });
  }


  moveToAddress(){
    this.router.navigate(['/addressform']);
  }
  moveToTerms(){
    this.router.navigate(['/terms&Conditions']);
  }

  }








 
