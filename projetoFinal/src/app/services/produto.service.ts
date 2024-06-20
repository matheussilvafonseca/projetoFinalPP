import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Categoria } from './categoria.service';

export type Produto = {
  id?: string,
  nome: string
  preco: string,
  descricao: string,
  preco_promocional: string,
  id_categoria: string,
  categoria?: Categoria
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
  return this.http.put(`${environment.target}/product/edit`, null, {
    params: {
      id_produto: produto.id!,
      nome_produto: produto.nome,
      preco_produto: produto.preco,
      descricao_produto: produto.descricao,
      preco_promocional: produto.preco_promocional,
      id_categoria: produto.id_categoria
    }
  });

}

}