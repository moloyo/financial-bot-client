import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email!: string;
  password!: string;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.authenticationService.login(this.email, this.password).subscribe((res) => {
      console.log('LOGGED', res);
      this.router.navigate(['/chatroom']);
    });
  }

  register() {
    this.authenticationService.register(this.email, this.password).subscribe(
      (res) => {
        console.log('REGISTERED', res);
        this.router.navigate(['/chatroom']);
      },
      (err) => console.log(err)
    );
  }
}
