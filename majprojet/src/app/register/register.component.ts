import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations/index';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService, UserService, AuthenticationService } from '../_services';

import { DataService } from '../data.service';
import { Agent } from '../_models/agent';
import { Responsebc } from '../_models/responsebc';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    animations: fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy {
    str: string;
    number: number;
    agent: Agent;
    respbc: Responsebc;
    registerForm: FormGroup;
    registerFormErrors: any;
    loading = false;
    submitted = false;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
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
        this.registerFormErrors = {
            name: {},
            firstname: {},
            email: {},
            mobile: {},
            username: {},
            password: {},
            passwordConfirm: {}
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();

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

        this.registerForm = this._formBuilder.group({
            name: ['', Validators.required],
            firstname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            mobile: ['', [Validators.required, Validators.pattern(/^\+?\d{10}$/)]],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(5)]],
            passwordConfirm: ['', [Validators.required, confirmPassword]]
        });

        this.registerForm.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onRegisterFormValuesChanged();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    openMenu() {
        $('body').removeClass('noScroll');
        if ($('.collapse').hasClass('collapse-active')) {
            $('.collapse').removeClass('collapse-active');
        }
        else {
            $('.collapse').addClass('collapse-active');
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On form values changed
     */
    onRegisterFormValuesChanged(): void {
        for (const field in this.registerFormErrors) {
            if (!this.registerFormErrors.hasOwnProperty(field)) {
                continue;
            }

            // Clear previous errors
            this.registerFormErrors[field] = {};

            // Get the control
            const control = this.registerForm.get(field);

            if (control && control.dirty && !control.valid) {
                this.registerFormErrors[field] = control.errors;
            }
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.createagent();
                    this.alertService.success('Enregistrement reussi', false);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    createagent() {
        this.dataService.getAll('agents')
            .subscribe((data: {}) => {
                if (!JSON.stringify(data).includes(this.f.username.value)) {
                    for (let i = 0; i < 13; i++) {
                        if (!JSON.stringify(data).includes('AGENT' + i.toString())) {
                            console.log(!JSON.stringify(data).includes('CAR' + i.toString()));
                            this.str = i.toString();
                            console.log(this.str);
                            this.agent = new Agent();
                            this.agent.agentid = 'AGENT' + this.str;
                            this.agent.username = this.f.username.value;
                            this.agent.coin = '3';
                            this.agent.entity = '';
                            this.agent.entitypoint = '0';
                            this.agent.point = '0';
                            console.log(this.agent);
                            this.dataService.add('addAgent', this.agent).subscribe(res => {
                            });
                            return;
                        }
                    }
                }
            });
    }

}

/**
 * Confirm password
 *
 * @param {AbstractControl} control
 * @returns {{passwordsNotMatch: boolean}}
 */
function confirmPassword(control: AbstractControl): any {
    if (!control.parent || !control) {
        return;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if (!password || !passwordConfirm) {
        return;
    }

    if (passwordConfirm.value === '') {
        return;
    }

    if (password.value !== passwordConfirm.value) {
        return {
            passwordsNotMatch: true
        };
    }
}
