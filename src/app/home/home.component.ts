import { Component } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{

  constructor(){
    localStorage.setItem('isAuthenticated', 'false')
    localStorage.setItem('myToken', "")
  }
  ngOnInit(){
    
  }

}
