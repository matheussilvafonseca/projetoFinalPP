import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

type CriarUsuarioRequest = {
  nome: string,
  email: string,
  senha: string
}

type LoginRequest = {
  email: string,
  senha: string
}

export type LoginResponse = {
  id: string,
  nome: string,
  email: string,
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private _usuarioLogado = new BehaviorSubject<LoginResponse>({} as LoginResponse);

  constructor(private http: HttpClient) {
    const usuarioLogadoString = localStorage.getItem('usuarioLogado');
    if (usuarioLogadoString) {
      const usuarioLogadoObj = JSON.parse(usuarioLogadoString) as LoginResponse;
      this.usuarioLogado.next(usuarioLogadoObj);
    }
  }

  criarUsuario(body: CriarUsuarioRequest) {
    return this.http.post(`${environment.target}/user`, body);
  }

  login(body: LoginRequest) {
    return this.http.post<LoginResponse>(`${environment.target}/session`, body);
  }

  get usuarioLogado() {
    return this._usuarioLogado;
  }

}
