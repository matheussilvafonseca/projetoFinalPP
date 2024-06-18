import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { LoginResponse, UsuarioService } from "../../services/usuario.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarComponent } from "../../components/snackbar/snackbar.component";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    constructor(private usuarioService: UsuarioService, private router: Router, private snackBarService: MatSnackBar) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (!req.url.includes('/session') && !req.url.includes('/user')) {
            const token = this.usuarioService.usuarioLogado.value.token;

            if (token) {
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        }

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.handleUnauthorizedError();
                    return throwError(() => new Error('Não autorizado!'));
                }
                return throwError(() => error);
            })
        );
    }

    private handleUnauthorizedError(): void {
        localStorage.removeItem('usuarioLogado');
        this.usuarioService.usuarioLogado.next({} as LoginResponse);
        this.snackBarService.openFromComponent(SnackbarComponent, {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            data: {
                mensagem: 'Sessão expirada!'
            }
        });
        this.router.navigate(['/']);
    }

}