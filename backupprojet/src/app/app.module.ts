import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import {
    MatRippleModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatToolbarModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    ErrorStateMatcher,
    ShowOnDirtyErrorStateMatcher,
    MatListModule,
    MatAccordion,
    MatExpansionModule,
    MatCheckboxModule,
    MatTooltipModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { fuseConfig } from 'app/fuse-config';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { ProfilComponent } from './profil/profil.component';
import { ProjetComponent } from './projet/projet.component';
import { ProjetlistComponent } from './projetlist/projetlist.component';
import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ShopComponent } from './shop/shop.component';
import { SlideshowModule } from '../../public_api';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ForgotPasswordModule } from './auth/forgot-password/forgot-password.module';
import { FaqComponent } from './help/faq.component';
import { FaqModule } from './help/faq.module';
// used to create fake backend
import { fakeBackendProvider } from './_helpers';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './_components';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AuthGuard } from './_guards';
import { DataService } from './data.service';

const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'profil',
        component: ProfilComponent
        , canActivate: [AuthGuard]
    },
    {
        path: 'shop',
        component: ShopComponent
    },
    {
        path: 'projet',
        component: ProjetComponent
        , canActivate: [AuthGuard]
    },
    {
        path: 'projetlist',
        component: ProjetlistComponent
        , canActivate: [AuthGuard]
    },
    {
        path: 'help',
        component: FaqComponent
        , canActivate: [AuthGuard]
    },
    {
        path: 'admin',
        component: AdminComponent
        , canActivate: [AuthGuard]
    },
];

@NgModule({
    declarations: [
        AppComponent,
        ProfilComponent,
        HomeComponent,
        ContactUsComponent,
        ShopComponent,
        LoginComponent,
        RegisterComponent,
        AlertComponent,
        AdminComponent,
        ProfilComponent,
        ProjetComponent,
        ProjetlistComponent
        // ForgotPasswordComponent,
        // FaqComponent,
    ],
    imports: [
        SlideshowModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        BrowserModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,
        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        SampleModule,
        ForgotPasswordModule,
        FaqModule,
        MatDatepickerModule,        // <----- import(must)
        MatNativeDateModule,        // <----- import for date formating(optional)
        MatMomentDateModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatGridListModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatToolbarModule,
        MatRadioModule,
        MatSelectModule,
        MatOptionModule,
        MatSlideToggleModule,
        MatListModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatTooltipModule

    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        DataService,
        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
