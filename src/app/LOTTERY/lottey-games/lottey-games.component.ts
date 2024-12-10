import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { APIServicesService } from '../../api-services.service';
import { Router } from '@angular/router';
// import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-lottey-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lottey-games.component.html',
  styleUrl: './lottey-games.component.css'
})
export class LotteyGamesComponent {




constructor(private api :APIServicesService,private router: Router){}
 lotteryData:any;
 modalData:any;
ngOnInit(){
  this.api.getLottery().subscribe((response:any)=>{
    this.lotteryData=response.body;
});

this.api.getModalData().subscribe((response:any)=>{
  this.modalData=response.body;
  // console.log(this.modalData);
});


}

//For New line in cards 
replaceNewlines(text: string): string {
  if (!text) return '';
  return text.replace(/\\n/g, '<br>');
}


// For Flip functionality of the card 
isFlipped: boolean[] = [false, false]; 
toggleFlip(index: number): void {
  this.isFlipped[index] = !this.isFlipped[index];
}




// For modal open or close
isModalVisible: boolean = false;
  openModal() {
    // console.log('opennnnnn');
    this.isModalVisible = true;
  }
  closeModal() {
    this.isModalVisible = false;
  }



  moveToLogin(){
    this.router.navigate(['/login']);

  }



}
