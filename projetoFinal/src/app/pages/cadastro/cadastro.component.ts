import { Component } from '@angular/core';
import { AbstractControl, FormControl, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../../services/usuario.service';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css',
})
export class CadastroComponent {

  currentDate = new Date();

  nomeFormControl: FormControl = new FormControl('', Validators.required);
  emailFormControl: FormControl = new FormControl('', [Validators.required, Validators.email]);
  senhaFormControl: FormControl = new FormControl('', [
    Validators.required,
    this.passwordFormatValidator()
  ]);

  confirmarSenhaFormControl: FormControl = new FormControl('', [
    Validators.required,
    this.passwordMatchValidator(this.senhaFormControl)
  ]);

  constructor(private usuarioService: UsuarioService, private snackbarService: MatSnackBar, private router: Router) {

  }

  criarUsuario(formCadastro: NgForm) {

    this.nomeFormControl.markAsTouched();
    this.emailFormControl.markAsTouched();
    this.senhaFormControl.markAsTouched();
    this.confirmarSenhaFormControl.markAsTouched();

    formCadastro.form.addControl('nome', this.nomeFormControl);
    formCadastro.form.addControl('email', this.emailFormControl);
    formCadastro.form.addControl('senha', this.senhaFormControl);
    formCadastro.form.addControl('confirmarSenha', this.confirmarSenhaFormControl);

    if(formCadastro.form.valid) {
      this.usuarioService.criarUsuario({
        nome: this.nomeFormControl.value,
        email: this.emailFormControl.value,
        senha: this.senhaFormControl.value
      }).subscribe({
        next: (resposta) => {
          this.snackbarService.openFromComponent(SnackbarComponent, {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            data: {
              mensagem: 'Usuário cadastrado com sucesso!'
            }
          });
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.snackbarService.openFromComponent(SnackbarComponent, {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            data: {
              mensagem: err?.error?.error
            }
          });
        }
      })
    } else {
      console.log('invalido');
      

    }

  }

  private passwordFormatValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value: string = control.value;
      const lentghRegex = /^(?=.{8,})/;
      const upperCaseRegex = /(?=.*[A-Z])/;
      const specialCharRegex = /(?=.*[\W_])/;
      const numberRegex = /(?=.*\d)/;

      if(!lentghRegex.test(value)) {
        return {
          passwordLength: true
        }
      }

      if(!upperCaseRegex.test(value)) {
        return {
          passwordUpperCase: true
        }
      }

      if(!specialCharRegex.test(value)) {
        return {
          passwordSpecialChar: true
        }
      }

      if(!numberRegex.test(value)) {
        return {
          passwordNumber: true
        }
      }

      return null;

    }
  }

  private passwordMatchValidator(passwordFormControl: FormControl): ValidatorFn {
    return (control: AbstractControl) => {
      const controlValue = control.value;

      if (controlValue !== passwordFormControl.value) {
        return { 'passwordNotMatch': true };
      }

      return null;
    }
  }


}
