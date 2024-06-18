import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { ProdutoComponent } from './pages/produto/produto.component';
import { sessionGuard } from './shared/guards/session.guard';

const routes: Routes = [
  {
    path: '', component: LoginComponent, pathMatch: 'prefix'
  },
  {
    path: 'cadastro', component: CadastroComponent,
  },
  {
    path: 'home', component: HomeComponent, canActivate: [sessionGuard],
  },
  {
    path: 'categoria', component: CategoriaComponent, canActivate: [sessionGuard],
  },
  {
    path: 'produto', component: ProdutoComponent, canActivate: [sessionGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
