import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations/index';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService, UserService, AuthenticationService } from '../_services';
import { User } from '../_models';

@Component({
    selector: 'app-profil',
    templateUrl: './profil.component.html',
    styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit, OnDestroy {
    router: Router;
    form: FormGroup;
    form2: FormGroup;
    formErrors: any;
    formErrors2: any;
    currentUser: User;
    currentUserSubscription: Subscription;
    private _unsubscribeAll: Subject<any>;
    constructor(
        private alertService: AlertService,
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _formBuilder2: FormBuilder
    ) {
        this.openMenu();
        this.formErrors = {
            id: {},
            name: {},
            firstname: {},
            email: {},
            mobile: {},
            username: {},
            password: {},
            passwordConfirm: {}
        };

        this.formErrors2 = {
            field1: {},
            field2: {},
            field3: {},
            entity: {},
            diploma: {},
            skill: {}
        };
        this._unsubscribeAll = new Subject();
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    };

    ngOnInit() {
        this.form = this._formBuilder.group({
            id: this.currentUser.id,
            name: [this.currentUser.name, Validators.required],
            firstname: [this.currentUser.firstname, Validators.required],
            email: [this.currentUser.email, [Validators.required, Validators.email]],
            mobile: [this.currentUser.mobile, [Validators.required, Validators.pattern(/^\+?\d{10}$/)]],
            username: this.currentUser.username,
            password: [this.currentUser.password, [Validators.required, Validators.minLength(5)]],
            passwordConfirm: [this.currentUser.password, [Validators.required, confirmPassword]]
        });
        this.form.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged();
            });
        this.form2 = this._formBuilder2.group({
            field1: 'Vous disposez de 3 points virtuel',
            field2: 'Vous disposez de 200 points',
            field3: 'Votre entité possède 1000 points',
            entity: ['FR4554DE', Validators.required],
            diploma: ['Master Mathematique', Validators.required],
            skill: ['bilingue portugais', Validators.required]
        });
        this.form2.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged2();
            });
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    onFormValuesChanged(): void {
        for (const field in this.formErrors) {
            if (!this.formErrors.hasOwnProperty(field)) {
                continue;
            }
            // Clear previous errors
            this.formErrors[field] = {};
            // Get the control
            const control = this.form.get(field);
            if (control && control.dirty && !control.valid) {
                this.formErrors[field] = control.errors;
            }
        }
    }

    onFormValuesChanged2(): void {
        for (const field in this.formErrors) {
            if (!this.formErrors.hasOwnProperty(field)) {
                continue;
            }
            // Clear previous errors
            this.formErrors[field] = {};
            // Get the control
            const control = this.form.get(field);
            if (control && control.dirty && !control.valid) {
                this.formErrors[field] = control.errors;
            }
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        if (this.form.invalid) {
            console.log('wazaaaaaaaaaaaaaaa');
            return;
        }

        this.userService.update(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Enregistrement de vos données personnelles reussites !', false);
                },
                error => {
                    this.alertService.error(error);
                });

        this.authenticationService.logoutW();
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => { 
                    this.router.navigate(['/about']);
                },
                error => {
                    this.alertService.error(error);
                });
    }

    onSubmit2() {
        this.alertService.error('Enregistrement de vos données BlockChain reussites !', false);
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

    logout(): void {
        this.authenticationService.logout();
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
