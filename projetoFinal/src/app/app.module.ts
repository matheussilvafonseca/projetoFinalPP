import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { LoginComponent } from './pages/login/login.component';
import { MaterialModule } from './shared/material/material.module';
import { HomeComponent } from './pages/home/home.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { RequestInterceptor } from './shared/interceptors/request.interceptor';
import { MenuComponent } from './components/menu/menu.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getPaginatorFooter } from './shared/paginator/paginator.intl';
import { ProdutoComponent } from './pages/produto/produto.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CadastroComponent,
    SnackbarComponent,
    HomeComponent,
    CategoriaComponent,
    MenuComponent,
    ProdutoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(),
    {provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true},
    {provide: MatPaginatorIntl, useValue: getPaginatorFooter()}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
