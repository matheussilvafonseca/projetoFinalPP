import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component';
import { Produto, ProdutoService } from '../../services/produto.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Categoria, CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  colunas = ['nome', 'preco', 'descricao', 'preco_promocional', 'categoria', 'editar', 'excluir'];
  produtos = new MatTableDataSource<Produto>([]);
  categorias: Categoria[] = [];
  produtoForm: FormGroup;
  isEditing: boolean = false;
  editingProductId?: string;

  constructor(
    private produtoService: ProdutoService,
    private categoriaService: CategoriaService,
    private snackbarService: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.produtoForm = this.fb.group({
      nome: ['', Validators.required],
      preco: ['', Validators.required],
      descricao: ['', Validators.required],
      preco_promocional: ['', Validators.required],
      id_categoria: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.produtos.filterPredicate = (data, filter) => {
      return data.nome.toLowerCase().includes(filter.trim().toLowerCase());
    };
    this.listar();
    this.listarCategoria();
  }

  salvar() {
    this.produtoForm.markAllAsTouched();

    if (this.produtoForm.valid) {
      const produto = this.produtoForm.value;

      if (this.isEditing) {
        produto.id = this.editingProductId;
        this.produtoService.editar(produto).subscribe({
          next: () => {
            this.resetForm();
            this.listar();
            this.showSnackbar('Produto alterado com sucesso!');
          },
          error: (err) => this.handleError(err, 'Erro ao alterar Produto')
        });
      } else {
        this.produtoService.salvar(produto).subscribe({
          next: () => {
            this.resetForm();
            this.listar();
            this.showSnackbar('Produto salvo com sucesso!');
          },
          error: (err) => this.handleError(err, 'Erro ao salvar Produto')
        });
      }
    }
  }

  listar() {
    this.produtoService.listar().subscribe({
      next: (resposta) => {
        this.produtos.data = resposta
        this.produtos.paginator = this.paginator;
      },
      error: (err) => this.handleError(err, 'Erro ao listar produtos. Tente novamente mais tarde!')
    });
  }

  listarCategoria() {
    this.categoriaService.listar().subscribe({
      next: (categorias) => this.categorias = categorias
    });
  }

  filtrar(event: any) {
    const pesquisa = event.target.value;
    this.produtos.filter = pesquisa;
  }

  deleteProduct(idProduto: Produto) {
    if (confirm("Deseja realmente deletar o produto?")) {
      this.produtoService.deletar(idProduto).subscribe(() => {
        this.resetForm();
        this.listar();
        this.showSnackbar('Produto deletado com sucesso!');
      });
    }
  }

  editProduct(produto: Produto) {
    this.produtoForm.patchValue({
    nome: produto.nome,
    preco: produto.preco,
    descricao: produto.descricao,
    preco_promocional: produto.preco_promocional,
    id_categoria: produto.categoria?.id
  });
  console.log (produto)

    this.isEditing = true;
    this.editingProductId = produto.id;
  }

  resetForm() {
    this.produtoForm.reset();
    this.isEditing = false;
    this.editingProductId = undefined;
  }

  private showSnackbar(message: string) {
    this.snackbarService.openFromComponent(SnackbarComponent, {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      data: { mensagem: message }
    });
  }

  private handleError(err: any, defaultMessage: string) {
    this.snackbarService.openFromComponent(SnackbarComponent, {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      data: { mensagem: err?.error?.error ?? defaultMessage }
    });
  }
}
