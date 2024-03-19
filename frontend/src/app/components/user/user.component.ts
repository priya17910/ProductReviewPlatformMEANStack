import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedServiceService } from '../../services/shared-service.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  username!: string;
  email!: string;
  password!: string;
  credentials: any = {};
  successMessage: string = '';
  errorMessage: string = '';
  loginActive: boolean = true;
  registerActive: boolean = false;
  constructor(private userService: UserService, private router: Router, private sharedService: SharedServiceService) { }

  ngOnInit(): void {
    this.sharedService.loginEvent.subscribe(() => {
      this.loginActive = true;
      this.registerActive = false;
      this.username = "";
      this.email = "";
      this.password = "";
      this.successMessage = "";
      this.errorMessage = "";
    });
    this.sharedService.registerEvent.subscribe(() => {
      this.registerActive = true;
      this.loginActive = false;
      this.username = "";
      this.email = "";
      this.password = "";
      this.successMessage = "";
      this.errorMessage = "";
    });
  }

  login(): void {
    const credentials = {
      email: this.email,
      password: this.password
    };
    this.userService.login(credentials).subscribe(
      (response: any) => {
        const token = response.token;
        localStorage.setItem("token", token);
        this.userService.setAuthenticationStatus(true);
        this.userService.emitLoggedInEvent();
        this.loginActive = false;
        this.registerActive = false;
        this.router.navigate(["/getAllProducts"]);
        this.successMessage = response.message;
      },
      error => {
        console.error('Error logging in:', error);
        this.errorMessage = "Login unsuccessfull ! Please reload or try in incognito tab";
      }
    );
  }

  register(): void {
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.userService.register(userData).subscribe(
      (response: any) => {
        this.successMessage = response.message;
        this.loginActive = true;
        this.registerActive = false;
      },
      (error: any) => {
        this.errorMessage = "User not registered successfully";
      }
    );
  }
}
