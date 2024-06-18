import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component';
import { Produto, ProdutoService } from '../../services/produto.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Categoria, CategoriaService } from '../../services/categoria.service';

import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.css'
})
export class ProdutoComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  colunas = ['nome','preco','descricao','preco_promocional','categoria', 'editar', 'excluir'];
 
  produtos = new MatTableDataSource<Produto>([]);

  categorias: Categoria[] = [];

  nomeFormControl: FormControl = new FormControl('', Validators.required);
  precoFormControl: FormControl = new FormControl('', Validators.required);
  descricaoFormControl: FormControl = new FormControl('', Validators.required);
  preco_promocionalFormControl: FormControl = new FormControl('', Validators.required);
  id_categoriaFormControl: FormControl = new FormControl('', Validators.required);

  constructor(private produtoService: ProdutoService, private categoriaService: CategoriaService,  
    private snackbarService: MatSnackBar, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.produtos.filterPredicate = (data, filter) => {
      return data.nome.toLowerCase().includes(filter.trim().toLowerCase());
    };
    this.listar();
    this.listarCategoria();
  }

  salvar() {
    this.nomeFormControl.markAsTouched();
    this.precoFormControl.markAsTouched();
    this.descricaoFormControl.markAsTouched();
    this.preco_promocionalFormControl.markAsTouched();
    this.id_categoriaFormControl.markAsTouched();
    
    if (this.nomeFormControl.valid) {
      this.produtoService.salvar({ nome: this.nomeFormControl.value,  preco: this.precoFormControl.value, descricao: this.descricaoFormControl.value, 
        preco_promocional: this.preco_promocionalFormControl.value, id_categoria: this.id_categoriaFormControl.value})
        .subscribe({
          next: (resposta) => {
            this.listar();
            this.nomeFormControl.reset();
            this.precoFormControl.reset();
            this.descricaoFormControl.reset();
            this.preco_promocionalFormControl.reset();
            this.id_categoriaFormControl.reset();
            this.snackbarService.openFromComponent(SnackbarComponent, {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              data: {
                mensagem: 'Produto salvo com sucesso!'
              }
            });
          },
          error: (err) => {
            this.snackbarService.openFromComponent(SnackbarComponent, {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              data: {
                mensagem: err?.error?.error ?? 'Erro ao salvar Produto'
              }
            });
          }
        });
    }
  }

  listar() {
    this.produtoService.listar().subscribe({
      next: (resposta) => {
        this.produtos.data = resposta;
        this.produtos.paginator = this.paginator;
      },
      error: (err) => {

        if (err instanceof HttpErrorResponse) {
          this.snackbarService.openFromComponent(SnackbarComponent, {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            data: {
              mensagem: 'Erro ao listar produtos. Tente novamente mais tarde!'
            }
          });
        }

      }
    });
  }

  listarCategoria() {
    this.categoriaService.listar().subscribe({
      next: (categorias) => this.categorias = categorias
    })
  }

  filtrar(event: any) {
    const pesquisa = event.target.value;
    this.produtos.filter = pesquisa;
  }

  deleteProduct(idProduto : Produto){
    console.log(idProduto)
    if(confirm("Deseja realmente deletar o produto?")){
      this.produtoService.deletar(idProduto).subscribe(
        response => {
          this.snackbarService.openFromComponent(SnackbarComponent, {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            data: {
              mensagem: 'Produto deletado com sucesso!'
            }
          });
          this.listar();
        }
      )
      
    } else {

    }

  }

  editProduct(produto : Produto){

    this.nomeFormControl.value =

    this.nomeFormControl.markAsTouched();
    this.precoFormControl.markAsTouched();
    this.descricaoFormControl.markAsTouched();
    this.preco_promocionalFormControl.markAsTouched();
    this.id_categoriaFormControl.markAsTouched();
    
    if (this.nomeFormControl.valid) {
      this.produtoService.editar({ nome: this.nomeFormControl.value,  preco: this.precoFormControl.value, descricao: this.descricaoFormControl.value, 
        preco_promocional: this.preco_promocionalFormControl.value, id_categoria: this.id_categoriaFormControl.value})
        .subscribe({
          next: (resposta) => {
            this.listar();
            this.nomeFormControl.reset();
            this.precoFormControl.reset();
            this.descricaoFormControl.reset();
            this.preco_promocionalFormControl.reset();
            this.id_categoriaFormControl.reset();
            this.snackbarService.openFromComponent(SnackbarComponent, {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              data: {
                mensagem: 'Produto alterado com sucesso!'
              }
            });
          },
          error: (err) => {
            this.snackbarService.openFromComponent(SnackbarComponent, {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              data: {
                mensagem: err?.error?.error ?? 'Erro ao alterar Produto'
              }
            });
          }
        });
    }


  }

}
