import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class APIServicesService {
  data: any;
  formData: any;
  // lookupDataSubject: any;
  // apiResponse: any;

  constructor() { }
  http = inject(HttpClient);

  onHitRegistrationApi(formcontrols: any): Observable<any> {
    const baseurl = 'https://d1-slp-api.supremelifeplatform.com/api/register-mobile';
    const payload = {
      phone: formcontrols.countrycode + formcontrols.mobilenumber
    };
    const headers = new HttpHeaders({
      'Client-Type': 'WEB',
      'Platform-Type': 'JM'

    });
    return this.http.post(baseurl, payload, { headers: headers, observe: 'response' });
  }


  onHitForgotPINApi(formcontrls: any) {
    const baseurl = 'https://d1-slp-api.supremelifeplatform.com/api/register-mobile';
    const payload = {
      forgotpassword: true,
      phone: formcontrls.countrycode + formcontrls.mobilenumber
    };
    const headers = new HttpHeaders({
      'Client-Type': 'WEB',
      'Platform-Type': 'JM'
    });
    return this.http.post(baseurl, payload, { headers: headers });
  }


  onLogin(data: FormData) {
    const baseurl = 'https://d1-slp-api.supremelifeplatform.com/api/login';
    const header = new HttpHeaders({ 'Client-Type': 'WEB', 'Platform-Type': 'JM' });
    return this.http.post(baseurl, data, { headers: header });
  }


  onHitVerifyOtpApi(formcontrols: any) {
    const baseurl = 'https://d1-slp-api.supremelifeplatform.com/api/verify-otp';
    const payload = {
      otp: formcontrols.verificationcode,
      influencerPromoCode: formcontrols.referralcode
    }
    const token = localStorage.getItem('AuthToken');
    const header = new HttpHeaders({
      'Client-Type': 'WEB',
      'Platform-Type': 'GY',
      'Access-Medium': `${token}`,
    });
    return this.http.post(baseurl, payload, { headers: header, observe: 'response' }
    );
  }

  onHitResendOtpeApi() {
    const baseurl = 'https://d1-slp-api.supremelifeplatform.com/api/resend-otp';
    const token = localStorage.getItem('AuthToken');
    const header = new HttpHeaders({
       'Client-Type': 'WEB',
        'Platform-Type': 'JM',
        'Access-Medium': `${token}`
      });
      console.log(header);
    return this.http.post(baseurl,null, { headers: header, observe: 'response' });
  }


  onHitPersonalDetailApi(data: FormData) {
    const baseurl = 'https://d1-slp-api.supremelifeplatform.com/api/register-personal';
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders({
      'Client-Type': 'WEB',
      'Platform-Type': 'GY',
      'Access-Medium': `${token}`,
    });
    return this.http.post(baseurl, data, { headers: headers, observe: 'response' });

  }


  onHitAddressApi(data: FormData) {
    const baseurl = 'https://d1-slp-api.supremelifeplatform.com/api/register-address';
    const token = localStorage.getItem('AuthToken');
    const header = new HttpHeaders({
      'Client-Type': 'WEB',
      'Platform-Type': 'JM',
      'Access-Medium': `${token}`,
    });
    return this.http.post(baseurl, data, { headers: header, observe: 'response' }
    );
  }

  getLookupsData(data: { lookups: string[] }): Observable<any> {
    const headers = {
      'Client-Type': 'WEB',
      'Platform-Type': 'JM',
      'Content-Type': 'application/json',
    };
    return this.http.post<any>(`https://d1-slp-api.supremelifeplatform.com/api/lookups`, data, { headers });
  }


  onHitSecurityFormApi(payload: any) {
    const baseurl = 'https://d1-slp-api.supremelifeplatform.com/api/register-security';
    const token = localStorage.getItem('AuthToken');
    const header = new HttpHeaders({
      'Client-Type': 'WEB',
      'Platform-Type': 'JM',
      'Access-Medium': `${token}`,
    });
    return this.http.post(baseurl, payload, { headers: header, observe: 'response' }
    );
  }


response:any=null;
  getResponse(){
    return this.response;
  }
  setResponse(res:any){
    this.response=res;
  }



  personalDetailData:any=null;
  setPersonalDetail(data:any){
    this.personalDetailData=data;
  }
  getPersonalDetailData(){
    return this.personalDetailData;
  }

  
  personalAddressData:any=null;
  setAddressDetail1(data:any){
    this.personalAddressData=data;
  }
  getAddressDetailData1(){
    return this.personalAddressData;
  }



  securityFormData:any=null;
  setSecurityDetails(data:any){
    this.securityFormData=data;
  }
  getSecurityFormData(){
    return this.securityFormData;
  }



  getLottery(): Observable<any>
  {
    return this.http.get('https://stg-api.supremegames.com/api/svgames-landing-page',{observe: 'response'});
  }


  getModalData(): Observable<any>
  {
    return this.http.get('https://stg-api.supremegames.com/api/lucky5-prize-tiers?drawId=7769',{observe: 'response'});

  }



}
