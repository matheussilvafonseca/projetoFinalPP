import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

export const sessionGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  const token = usuarioService.usuarioLogado?.value?.token;
  if (token) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
