import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  emailFormControl: FormControl = new FormControl('', [Validators.required, Validators.email]);
  senhaFormControl: FormControl = new FormControl('', Validators.required);

  currentDate = new Date();

  constructor(private usuarioService: UsuarioService, private snackbarService: MatSnackBar, private router: Router) {

  }

  login() {
    this.emailFormControl.markAsTouched();
    this.senhaFormControl.markAsTouched();

    if (this.emailFormControl.valid && this.senhaFormControl.valid) {
      this.usuarioService.login({ email: this.emailFormControl.value, senha: this.senhaFormControl.value })
        .subscribe({
          next: (resposta) => {
            localStorage.setItem('usuarioLogado', JSON.stringify(resposta));
            this.usuarioService.usuarioLogado.next(resposta);
            this.snackbarService.openFromComponent(SnackbarComponent, {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              data: {
                mensagem: 'Login efetuado com sucesso!',
              }
            });
            this.router.navigate(['/home']);
          },
          error: (err) => {
            this.snackbarService.openFromComponent(SnackbarComponent, {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              data: {
                mensagem: err?.error?.error
              }
            })
          }
        });
    }
  }

}
