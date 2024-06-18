import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export type Produto = {
  id?: string,
  nome: string
  preco: string,
  descricao: string,
  preco_promocional: string,
  id_categoria: string
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Produto[]>(`${environment.target}/product/list`);
  }

  salvar(produto: Produto) {
    return this.http.post(`${environment.target}/product`, produto);
  }

deletar(produto: Produto){
  return this.http.delete(`${environment.target}/product/delete?id_produto=${produto}`);
}

editar(produto: Produto){
  return this.http.put(`${environment.target}/product/delete/edit`, produto);
}

}
