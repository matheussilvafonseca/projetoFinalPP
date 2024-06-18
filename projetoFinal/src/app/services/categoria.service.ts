import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export type Categoria = {
  id?: string,
  nome: string
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Categoria[]>(`${environment.target}/listcategory`);
  }

  salvar(categoria: Categoria) {
    return this.http.post(`${environment.target}/category`, categoria);
  }

}
