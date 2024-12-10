import { Routes } from '@angular/router';
import { RegisterationComponent } from './registeration/registeration.component';
import { LoginComponent } from './login/login.component';
import { PersonalDetailComponent } from './personal-detail/personal-detail.component';
import { PermanentAddressComponent } from './permanent-address/permanent-address.component';
import { SecurityComponent } from './security/security.component';
import { ReviewComponent } from './review/review.component';
import { VerificationComponent } from './verification/verification.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LotteyGamesComponent } from './LOTTERY/lottey-games/lottey-games.component';

export const routes: Routes = [
    {
        path:'registration' ,
        component:RegisterationComponent
    },
    {
        path:'login' ,
        component:LoginComponent,
    },
    {
        path:'verification' ,
        component:VerificationComponent
    },
    {
        path:'personaldetail' ,
        component:PersonalDetailComponent
    },
    {
        path:'addressform' ,
        component:PermanentAddressComponent
    },
    {
        path:'securityform' ,
        component:SecurityComponent
    },
    {
        path:'reviewform' ,
        component:ReviewComponent
    },
    {
        path:'terms&Conditions' ,
        component:TermsAndConditionsComponent   
    },
    {
        path:'forgotPassword' ,
        component:ForgotPasswordComponent   
    },
    {
        path:'lottery' ,
        component:LotteyGamesComponent   
    },
    { 
        path: '',
         redirectTo: '/review-form'
         , pathMatch: 'full' 
        },



];
