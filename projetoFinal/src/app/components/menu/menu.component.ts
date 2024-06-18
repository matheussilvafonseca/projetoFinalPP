import { Component, Input, TemplateRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginResponse, UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  autenticado: boolean = false;

  constructor(private router: Router, private snackbarService: MatSnackBar, private usuarioService: UsuarioService) {
    this.router.events.subscribe({
      next: (event) => {
        if (event instanceof NavigationEnd) {
          this.autenticado = event.url !== '/' && event.url !== '/cadastro';
        }
      }
    });
  }

  mudarRota(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    localStorage.removeItem('usuarioLogado');
    this.usuarioService.usuarioLogado.next({} as LoginResponse);
    this.snackbarService.openFromComponent(SnackbarComponent, {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      data: {
        mensagem: 'Logout efetuado com sucesso!'
      }
    });
    this.router.navigate(['/']);
  }

}
