import { CommonModule } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { APIServicesService } from '../api-services.service';
import { HttpClient } from '@angular/common/http';
import locationData from '../assets/locationsData.json';
import { __values } from 'tslib';

@Component({
  selector: 'app-permanent-address',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './permanent-address.component.html',
  styleUrl: './permanent-address.component.css',
})
export class PermanentAddressComponent {
  locationData: any = locationData;
  addressForm: FormGroup = new FormGroup
    ({
      streetaddress: new FormControl('', [Validators.required]),
      appartment: new FormControl(''),
      parish: new FormControl('', [Validators.required]),
      town: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      emailaddress: new FormControl('', [Validators.required, Validators.email]),
      trn: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      idtype: new FormControl('', [Validators.required]),
      idnumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      idexpirationdate: new FormControl('', [Validators.required]),
      frontPhoto: new FormControl('', [Validators.required]),
      backPhoto: new FormControl('', [Validators.required]),

      pep1: new FormControl('false'),
      tiername: new FormControl(''),
      occupation: new FormControl(''),
      sourceofFund: new FormControl(''),
      addressproof: new FormControl(''),
      bankname: new FormControl(''),
      branchname: new FormControl(''),
      accountnumber: new FormControl(''),
      accounttype: new FormControl(''),

    });

  parishList: any[] = [];
  townsList: any[] = [];
  districtsList: any[] = [];
  getAllParish() {
    this.parishList = Object.values(locationData.parish).map(parish => parish.name);
  }

  onParishChange(selectedParish: string): void {
    if (selectedParish) {
      const parishData = Object.values(locationData.parish).find(parish => parish.name === selectedParish);
      if (parishData) {
        this.townsList = Object.values(parishData.towns);
      } else {
        this.townsList = [];
      }
    }
    else {
      this.townsList = [];
    }
  }

  onTownChange(selectedTown: any): void {
    let parishData = this.addressForm.get('parish')?.value.toUpperCase().replace(/\. /g, '_');
    selectedTown = selectedTown.name.replace(/\ /g, '_');

    if (parishData && selectedTown && this.locationData.parish[parishData].towns[selectedTown]) {
      const districtData = this.locationData.parish[parishData].towns[selectedTown].districts;
      this.districtsList = Object.values(districtData).map((district: any) => district.name);
    }
    else {
      this.districtsList = [];
    }
  }

  ngOnInit(): void {
    // this.addressForm.controls['pep1'].value;
    this.getAllParish();
    this.fetchAllLookups();
    const formdata1 = this.api.getAddressDetailData1();
    if (formdata1) {
      this.addressForm.patchValue({

        streetaddress: formdata1.physicalAddress.streetAddress,
        appartment: formdata1.physicalAddress.apartment,
        parish: formdata1.physicalAddress.parish,
        town: formdata1.physicalAddress.town,
        district: formdata1.physicalAddress.district,
        emailaddress: formdata1.physicalAddress.emailAddress,
        trn: formdata1.identificationDetails.trnNumber,
        idtype: formdata1.identificationDetails.idTypeCD,
        idnumber: formdata1.identificationDetails.idNumber,
        idexpirationdate: formdata1.identificationDetails.idExpirationDate,
        pep1: (formdata1.identificationDetails.optForCashRecharge) == true ? 'true' : 'false',
        tiername: formdata1.identificationDetails.tier || '',
        occupation: formdata1.identificationDetails.occupation || '',
        bankname: formdata1.identificationDetails.bankName || '',
        branchname: formdata1.identificationDetails.branchName || '',
        accountnumber: formdata1.identificationDetails.accountNumber || '',
        accounttype: formdata1.identificationDetails.accountType || '',
      });
      if (formdata1.identificationDetails.document) {
        this.frontPhotoSrc = formdata1.identificationDetails.document || null;
        this.addressForm.get('frontPhoto')?.setValue(this.frontPhotoSrc)
      }
      if (formdata1.identificationDetails.documentBack) {
        this.backPhotoSrc = formdata1.identificationDetails.documentBack || null;
        this.addressForm.get('backPhoto')?.setValue(this.backPhotoSrc);

      }
      if (formdata1.identificationDetails.sourceOfFund) {
        this.sourceOfFund = formdata1.identificationDetails.sourceOfFund || null;
          this.addressForm.get('sourceofFund')?.setValue(this.sourceOfFund);
      }
      if (formdata1.identificationDetails.addressProof) {
        this.addressProofFile = formdata1.identificationDetails.addressProof || null;
        this.addressForm.get('addressProof')?.setValue(this.addressProofFile);
      }
      let radio1 = document.getElementById('pep1') as HTMLInputElement;
      let radio2 = document.getElementById('pep2') as HTMLInputElement;
      ((formdata1.identificationDetails.optForCashRecharge) == true && radio1 && radio2) ? radio2.checked = true : radio1.checked = false;

    }
    const todayDate = new Date();
    const tommarowDate = new Date();
    tommarowDate.setDate(todayDate.getDate() + 1);
    this.datelimit = tommarowDate.toISOString().split('T')[0];
    this.TierChangeValidation();
  }


  TierChangeValidation() {
    const paymentMethod = this.addressForm.get('paymentMethod')?.value;
    const tierType = this.addressForm.get('tierType')?.value;

    if (paymentMethod === 'cashInOut') {
      this.addressForm.get('tierType')?.setValidators([Validators.required]);
      if (tierType === '4') {
        this.addressForm.get('occupation')?.setValidators([Validators.required]);
        this.addressForm.get('bankname')?.setValidators([Validators.required]);
        this.addressForm.get('branchname')?.setValidators([Validators.required]);
        this.addressForm.get('accountnumber')?.setValidators([Validators.required]);
        this.addressForm.get('accounttype')?.setValidators([Validators.required]);
        this.addressForm.get('sourceofFund')?.setValidators([Validators.required]);
        this.addressForm.get('addressproof')?.setValidators([Validators.required]);
      } else if (tierType === '1') {
        this.addressForm.get('occupation')?.clearValidators();
        this.addressForm.get('bankname')?.clearValidators();
        this.addressForm.get('branchname')?.clearValidators();
        this.addressForm.get('accountnumber')?.clearValidators();
        this.addressForm.get('accounttype')?.clearValidators();
        this.addressForm.get('sourceofFund')?.clearValidators();
        this.addressForm.get('addressproof')?.clearValidators();
      }
    } else {
      this.addressForm.get('tierType')?.clearValidators();
      this.addressForm.get('occupation')?.clearValidators();
      this.addressForm.get('bankname')?.clearValidators();
      this.addressForm.get('branchname')?.clearValidators();
      this.addressForm.get('accountnumber')?.clearValidators();
      this.addressForm.get('accounttype')?.clearValidators();
      this.addressForm.get('sourceofFund')?.clearValidators();
      this.addressForm.get('addressproof')?.clearValidators();
    }
    this.addressForm.updateValueAndValidity();
  }

  onSubmit() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      this.message = 'Please fill out all required fields.';
      this.messageType = 'error';
      return;
    }
    const formValue = this.addressForm.value;
    // console.log('Form Values',formValue.pep1);
    const formData = new FormData();
    formData.append('streetAddress', formValue.streetaddress);
    formData.append('appartment', formValue.appartment || '');
    formData.append('parish', formValue.parish);
    formData.append('town', formValue.town.name);
    formData.append('district', formValue.district);
    formData.append('email', formValue.emailaddress);
    formData.append('trnNumber', formValue.trn);
    formData.append('idTypeCD', formValue.idtype);
    formData.append('idNumber', formValue.idnumber);
    formData.append('idExpirationDate', formValue.idexpirationdate);

    if (this.frontPhotoBinary) {
      formData.append('document', this.frontPhotoBinary);
    }
    if (this.backPhotoBinary) {
      formData.append('documentBack', this.backPhotoBinary);
    }
    formData.append('optForCashRecharge', formValue.pep1);
    formData.append('tier', formValue.tiername);
    formData.append('occupation', formValue.occupation);
    if (this.sourceOfFundBinary) {
      console.log('heloooo')
      formData.append('sourceOfFund', this.sourceOfFundBinary);
      console.log(this.sourceOfFundBinary);
    }
    if (this.addressProofBinary) {
      formData.append('addressProof', this.addressProofBinary);
    }

    formData.append('bankName', formValue.bankname);
    formData.append('branchName', formValue.branchname);
    formData.append('accountNumber', formValue.accountnumber);
    formData.append('accountType', formValue.accounttype);
    this.api.onHitAddressApi(formData).subscribe(
      (res: any) => {
        this.message = 'Success!';
        this.messageType = 'success';
        this.router.navigate(['/securityform']);
      },
      (error) => {
        console.error('Error:', error);
        this.message = 'An error occurred: ' + (error.message || 'Unknown error');
        this.messageType = 'error';
      }
    );
  }
  onPaymentOptionChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedOption = inputElement.value;
  }
  http = inject(HttpClient);
  message: string = '';
  messageType: 'success' | 'error' | '' = '';
  datelimit: string = '';
  constructor(private router: Router, private api: APIServicesService) { }
  frontPhotoSrc: string | ArrayBuffer | null = null;
  backPhotoSrc: string | ArrayBuffer | null = null;
  frontPhotoBinary: File | null = null;
  backPhotoBinary: File | null = null;
  onFileSelected(event: Event, photoType: 'frontPhoto' | 'backPhoto' | 'sourceofFund' | 'addressproof'): void {

    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {

      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (photoType === 'frontPhoto') {
          this.frontPhotoBinary = file;
          this.frontPhotoSrc = reader.result as string;
          this.addressForm.get('frontPhoto')?.setValue(this.frontPhotoSrc);

        } else if (photoType === 'backPhoto') {
          this.backPhotoBinary = file;
          this.backPhotoSrc = reader.result as string;
          this.addressForm.get('backPhoto')?.setValue(this.backPhotoSrc);

        }
        else if (photoType === 'sourceofFund') {
          this.sourceOfFundBinary = file;
          this.sourceOfFund = reader.result as string;
          this.addressForm.get('sourceofFund')?.setValue(this.sourceOfFund);


        } else if (photoType === 'addressproof') {
          this.addressProofBinary = file
          this.addressProofFile = reader.result as string;
          this.addressForm.get('addressproof')?.setValue(this.addressProofFile);

        }
      };
      reader.readAsDataURL(file);
    }
  }

  sourceOfFund: string | ArrayBuffer | null = null;
  addressProofFile: string | ArrayBuffer | null = null;
  sourceOfFundBinary: File | null = null;
  addressProofBinary: File | null = null;
  onlyAllowNumbers(event: KeyboardEvent): void {
    const charCode = event.charCode ? event.charCode : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  selectedTire: string = '';
  onTierChange() {
    this.selectedTire = this.addressForm.get('tiername')?.value;
  }
  selectedOption: string = '';
  lookupData: any = {
    bankNameList: [],
    accountType: [],
    idType: [],
    tierType: []
  };
  fetchAllLookups(): void {
    const requestBody = { lookups: ["bankName", "bankAccountType", "idType", "tierList"] };
    this.api.getLookupsData(requestBody).subscribe({
      next: (response) => {
        if (response) {
          if (response.bankName) {
            this.lookupData.bankNameList = response.bankName.map((codes: any) => ({
              id: codes.id,
              name: codes.name
            }));
          }
          if (response.bankAccountType) {
            this.lookupData.accountType = response.bankAccountType.map((codes: any) => ({
              id: codes.id,
              name: codes.name
            }));
          }
          if (response.idType) {
            this.lookupData.idType = response.idType.map((codes: any) => ({
              id: codes.id,
              name: codes.name
            }));
          }
          if (response.tierList) {
            console.log('tierList');
            this.lookupData.tierType = response.tierList.map((codes: any) => ({
              id: codes.id,
              name: codes.name

            }));
          }
        } else {
          console.warn('Unexpected response format:', response);
        }
      },
      error: (error) => {
        console.error('Failed to fetch lookups:', error);
      }
    });
  }
  toPersonalDetailPage() {
    this.router.navigate(['/personaldetail']);
  }
}

