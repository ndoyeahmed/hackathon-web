import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  toggle = false;
  user: any;

  constructor(private authService: AuthenticationService) {}
  ngOnInit(): void {
    const result = localStorage.getItem('mdd_user');
    if (result)  {
      this.user = JSON.parse(result);
    }
  }

  toggled() {
    this.toggle = !this.toggle;
  }

  logout() {
    this.authService.logout();
  }
}
