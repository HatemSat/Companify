import { Router } from '@angular/router';
import { AuthentificationService } from './../services/authentification.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  isloggedIn: boolean;

  constructor(private authService: AuthentificationService, private router: Router) { }

  ngOnInit() {
    this.authService.changeLogStatus(this.authService.isLoggedIn());

    this.authService.currentLogStatus.subscribe((res) => {
      this.isloggedIn = res;
    });
  }

  logout() {
    this.authService.changeLogStatus(false);
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
