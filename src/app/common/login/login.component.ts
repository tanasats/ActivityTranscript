import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  constructor(
    private authService: AuthenticationService,
    public router: Router
  ) {}

  ngOnInit(): void {}
  get f() {
    return this.formLogin.controls;
  }

  onSubmitLogin() {
    console.log('Submit Login !!!');
    this.authService.auth(this.formLogin.value).subscribe(
      (res) => {
        console.log(res);
        localStorage.setItem('access-token', res.accessToken);
        this.router.navigate(['home']);
      },
      (err) => {
        let msg = '';
        if (err.error instanceof ErrorEvent) {
          // client-side error
          msg = err.error.message;
        } else {
          // server-side error
          msg = `Error Code: ${err.status}\nMessage: ${err.message}`;
        }
        console.log(msg);
      }
    );
  }
}
