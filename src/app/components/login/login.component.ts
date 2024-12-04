import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user-service/user.service';
import { UserLoginDtoIn } from '../../models/user/user.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    FormsModule, // Required for [(ngModel)]
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  userLogin: UserLoginDtoIn = { username: '', password: '' };

  constructor(private userService: UserService) {}

  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  login(): void {
    this.userService
      .login(this.userLogin.username, this.userLogin.password)
      .subscribe((data) => {
        console.log(data); // Handle the response from the backend
      });
  }
}
