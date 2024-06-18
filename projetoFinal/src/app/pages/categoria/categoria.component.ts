import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component';
import { Categoria, CategoriaService } from '../../services/categoria.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  colunas = ['nome'];
 
  categorias = new MatTableDataSource<Categoria>([]);

  nomeFormControl: FormControl = new FormControl('', Validators.required);

  constructor(private categoriaService: CategoriaService, private snackbarService: MatSnackBar) {

  }

  ngOnInit(): void {
    this.categorias.filterPredicate = (data, filter) => {
      return data.nome.toLowerCase().includes(filter.trim().toLowerCase());
    };
    this.listar();
  }

  salvar() {
    this.nomeFormControl.markAsTouched();
    if (this.nomeFormControl.valid) {
      this.categoriaService.salvar({ nome: this.nomeFormControl.value })
        .subscribe({
          next: (resposta) => {
            this.listar();
            this.nomeFormControl.reset();
            this.snackbarService.openFromComponent(SnackbarComponent, {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              data: {
                mensagem: 'Categoria salva com sucesso!'
              }
            });
          },
          error: (err) => {
            this.snackbarService.openFromComponent(SnackbarComponent, {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              data: {
                mensagem: err?.error?.error ?? 'Erro ao salvar categoria'
              }
            });
          }
        });
    }
  }

  listar() {
    this.categoriaService.listar().subscribe({
      next: (resposta) => {
        this.categorias.data = resposta;
        this.categorias.paginator = this.paginator;
      },
      error: (err) => {

        if (err instanceof HttpErrorResponse) {
          this.snackbarService.openFromComponent(SnackbarComponent, {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            data: {
              mensagem: 'Erro ao listar categorias. Tente novamente mais tarde!'
            }
          });
        }

      }
    });
  }

  filtrar(event: any) {
    const pesquisa = event.target.value;
    this.categorias.filter = pesquisa;
  }

}
