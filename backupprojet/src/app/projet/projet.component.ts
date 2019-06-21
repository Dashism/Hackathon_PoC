import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, NgModel, FormBuilder, Validators, FormArray, FormGroup, FormControl, FormArrayName } from '@angular/forms';
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
    selector: 'app-projet',
    templateUrl: './projet.component.html',
    styleUrls: ['./projet.component.scss']
})
export class ProjetComponent implements OnInit, OnDestroy {
    router: Router;
    projectForm: any;
    formErrors: any;
    currentUser: User;
    currentUserSubscription: Subscription;
    private _unsubscribeAll: Subject<any>;

    constructor(private alertService: AlertService,
        private userService: UserService,
        private authenticationService: AuthenticationService,
        public fb: FormBuilder) {
        this.projectForm = this.fb.group({
            'name': ['', Validators.required],
            'description': ['', Validators.required],
            'startdate': ['', Validators.required],
            'enddate': ['', Validators.required],
            'skillset': this.fb.array([this.initSkill()])
        }),
            this.openMenu();
        this.formErrors = {
            name: {},
            description: {},
            startdate: {},
            enddate: {},
            skillname: {},
            level: {}
        };
        this._unsubscribeAll = new Subject();
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        // this.form.valueChanges
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(() => {
        //         this.onFormValuesChanged();
        //     });
        // console.log(this.currentUser.id);
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    initSkill() {
        return this.fb.group({
            'skillname': ['', Validators.required],
            'level': ['', Validators.required]
        });
    }

    addSkillForm() {
        const control = <FormArray>this.projectForm.controls['skillset'];
        control.push(this.initSkill());
    }

    addSkill() {
        this.addSkillForm();
    }

    deleteSkill(index: number) {
        const control = <FormArray>this.projectForm.controls['skillset'];
        control.removeAt(index);
        
    }

    onFormValuesChanged(): void {
        for (const field in this.formErrors) {
            if (!this.formErrors.hasOwnProperty(field)) {
                continue;
            }
            // Clear previous errors
            this.formErrors[field] = {};
            // Get the control
            const control = this.projectForm.get(field);
            if (control && control.dirty && !control.valid) {
                this.formErrors[field] = control.errors;
            }
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.projectForm.controls; }

    // onSubmit() {
    //     this.alertService.error('Enregistrement du projet dans la BlockChain reussi !', true);
    // }

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

    register(): void {
        console.log("registred !!!");
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
