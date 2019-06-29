import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as $ from 'jquery';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations/index';

import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '../_services';
import { DataService } from '../data.service';
import { Project } from '../_models/project';
import { Responsebc } from '../_models/responsebc';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: fuseAnimations
})
export class LoginComponent implements OnInit, OnDestroy {
    respbc: Responsebc;
    project: Project;
    projectlist: Project[] = [];
    loginForm: FormGroup;
    loginFormErrors: any;
    loading = false;
    submitted = false;
    returnUrl: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private dataService: DataService<any>
    ) {
        this.openMenu();
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                }
            }
        };

        // Set the defaults
        this.loginFormErrors = {
            username: {},
            password: {}
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.loginForm.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onLoginFormValuesChanged();
            });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On form values changed
     */
    onLoginFormValuesChanged(): void {
        for (const field in this.loginFormErrors) {
            if (!this.loginFormErrors.hasOwnProperty(field)) {
                continue;
            }

            // Clear previous errors
            this.loginFormErrors[field] = {};

            // Get the control
            const control = this.loginForm.get(field);

            if (control && control.dirty && !control.valid) {
                this.loginFormErrors[field] = control.errors;
            }
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    for (let i = 0; i < 13; i++) {
                        this.dataService.get('project', 'PROJECT' + i.toString())
                            .subscribe(data => {
                                if (JSON.stringify(data).includes('\\"ausername\\":\\"' + this.f.username.value + '\\"') && !JSON.stringify(data).includes('\\"finish\\":\\"1\\"')) {
                                    this.respbc = data;
                                    this.project = JSON.parse(this.respbc.response);
                                    this.projectlist.push(this.project);
                                    for (let k = 0; k < this.projectlist.length; k++) {
                                        const enddate = new Date(this.projectlist[k].enddate);
                                        const actualdate = new Date();
                                        console.log(enddate);
                                        console.log(actualdate);
                                        if (enddate < actualdate) {
                                            this.router.navigate(['/projetfinish']);
                                            return;
                                        }
                                    }
                                }
                            });
                    }
                    if (this.f.username.value === 'Admin' && this.f.password.value === 'Admin') {
                        this.router.navigate(['/admin']);
                        return;
                    } else {
                        this.router.navigate(['/profil']);
                        return;
                    }
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    openMenu() {
        $('body').addClass('noScroll');
        if ($('.collapse').hasClass('collapse-active')) {
            $('.collapse').removeClass('collapse-active');
        }
        else {
            $('.collapse').addClass('collapse-active');
        }
    }
}
