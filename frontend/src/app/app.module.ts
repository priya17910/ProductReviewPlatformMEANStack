import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { UserComponent } from './components/user/user.component';
import { ProductComponent } from './components/product/product.component';
import { ReviewComponent } from './components/review/review.component';
import { StarComponent } from './components/star/star.component';
@NgModule({
    declarations: [
        AppComponent,
        UserComponent,
        ProductComponent,
        ReviewComponent,
        StarComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(routes),
    ],
    exports: [RouterModule],
    providers: [{ provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, JwtHelperService],
    bootstrap: [AppComponent]
})
export class AppModule { }