import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user-service/user.service';
import { UserLoginDtoIn } from '../../models/user/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  userLogin: UserLoginDtoIn = { username: '', password: '' };

  constructor(private userService: UserService, private router: Router) {}

  hide: boolean = true;

  regForm = new FormGroup({
    name: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    password: new FormControl('', [Validators.required]),
  });

  get name() {
    return this.regForm.get('name');
  }

  get password() {
    return this.regForm.get('password');
  }

  login(): void {
    if (this.regForm.valid) {
      this.userLogin.username = this.name?.value || '';
      this.userLogin.password = this.password?.value || '';

      this.userService
        .login(this.userLogin.username, this.userLogin.password)
        .subscribe((data) => {
          console.log(data);
          this.router.navigate(['/admin']);
        });
    }
  }
}
