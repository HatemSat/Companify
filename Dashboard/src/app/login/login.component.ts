import { Admin } from './../models/admin';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthentificationService } from './../services/authentification.service';
import { Component, OnInit, Inject } from '@angular/core';
import { BROWSER_STORAGE } from '../services/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  // disabling submit button on unauthorised and formSubmitted
  unauthorized: boolean;
  formSubmitted: boolean;
  isLoggedIn: boolean;

  constructor(
    private authService: AuthentificationService,
    private fb: FormBuilder,
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private router: Router) {
    this.loginForm = fb.group({
      email: fb.control('', [Validators.required, Validators.email]),
      password: fb.control('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.authService.currentLogStatus.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  login() {
    this.formSubmitted = true;
    const formValues = this.loginForm.value;

    const log = {
      email: formValues.email,
      password: formValues.password
    };

    this.authService.login(log).subscribe((res) => {
      this.authService.saveToken(res.token);
      this.authService.changeLogStatus(true);
      this.router.navigateByUrl('/dashboard');

    }, (err) => {
      console.log(err.status);
      this.unauthorized = true;
      this.loginForm.get('password').reset();
    });
  }

}
