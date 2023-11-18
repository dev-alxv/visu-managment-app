import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Services } from './presentation/services';
import { UsecaseManagers } from './domain/usecase-managers';
import { LayoutModule } from './presentation/layout/layout.module';
import { LoginModule } from './presentation/modules/login/login.module';
import { UiCoreModule } from './presentation/shared/modules/ui-core/ui-core.module';
import { AuthenticationRepo } from './domain/repository/auth.repo';
import { AuthenticationRepoService } from './data/repos-services/auth/auth-repo.service';
import { OrderRepo } from './domain/repository/order.repo';
import { OrderRepoService } from './data/repos-services/order/order-repo.service';
import { UserRepo } from './domain/repository/user.repo';
import { UserRepoService } from './data/repos-services/user/user-repo.service';
import { HttpInterceptorService } from './data/providers/interceptors/http.interceptor';
import { ErrorInterceptor } from './data/providers/interceptors/error.interceptor';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { BaseHostModalDialogModule } from './presentation/shared/components/base-host-modal-dialog/base-host-modal-dialog.module';
import { DatePipe } from '@angular/common';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { ContentPreLoadersModule } from './presentation/shared/components/content-preloaders/content-preloaders.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // Angular modules
    BrowserAnimationsModule,
    FileUploadModule,
    NgxPaginationModule,
    NgxMatFileInputModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'de',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),

    // UI core
    UiCoreModule,

    // Global
    BaseHostModalDialogModule,
    ContentPreLoadersModule,

    // Core "singleton" modules (not feature modules)
    LayoutModule,

    // Not lazy feature modules
    LoginModule,

    // App routing - should be the last import!
    AppRoutingModule
  ],
  providers: [
    // Angular modules
    DatePipe,

    //
    UsecaseManagers,

    // Core "singleton" services
    Services,

    // Material date locale
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    // Material dialog
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true, } },
    // Material radio button
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' } },

    // INTERCEPTORS
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // ====
    // every services from repos-services should be import like this
    // use abstract class for (provide: ) and map it to the repo service (useClass: )
    // in this way you will use only abstract class everywhere in the app
    { provide: AuthenticationRepo, useClass: AuthenticationRepoService },
    { provide: UserRepo, useClass: UserRepoService },
    { provide: OrderRepo, useClass: OrderRepoService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'assets/locales/app/', '.json');
}
