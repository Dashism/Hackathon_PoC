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
import { DataService } from '../data.service';
import { Project } from '../_models/project';

@Component({
    selector: 'app-projet',
    templateUrl: './projet.component.html',
    styleUrls: ['./projet.component.scss']
})
export class ProjetComponent implements OnInit, OnDestroy {
    today: Date;
    project: Project;
    router: Router;
    form: FormGroup;
    formErrors: any;
    currentUser: User;
    currentUserSubscription: Subscription;
    private _unsubscribeAll: Subject<any>;
    constructor(
        private alertService: AlertService,
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private dataService: DataService<any>
    ) {
        this.openMenu();
        this.formErrors = {
            name: {},
            description: {},
            startdate: {},
            enddate: {},
            skillname: {},
            skilllevel: {}
        };
        this._unsubscribeAll = new Subject();
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    };

    ngOnInit() {
        this.today = new Date();
        this.form = this._formBuilder.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            startdate: ['', Validators.required],
            enddate: ['', Validators.required],
            skill: this._formBuilder.array([this.initSkill()])
        });
        this.form.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged();
            });
        console.log(this.currentUser.id);
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    initSkill() {
        return this._formBuilder.group({
            skillname: ['', Validators.required],
            skilllevel: ['', Validators.pattern('[1-5]')]
        });
    }

    addSkillForm() {
        const control = <FormArray>this.form.controls['skill'];
        control.push(this.initSkill());
    }

    addSkill() {
        this.addSkillForm();
    }

    deleteSkill(index: number) {
        // this.project.skillList.splice(index, 1);
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

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

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

    onSubmit() {
        this.dataService.getAll('projects')
            .subscribe((data: {}) => {
                for (let i = 0; i < 13; i++) {
                    if (!JSON.stringify(data).includes('PROJECT' + i.toString())) {
                        this.project = new Project();
                        this.project.projectid = 'PROJECT' + i.toString();
                        this.project.username = this.currentUser.username;
                        this.project.projectname = this.f.name.value;
                        this.project.description = this.f.description.value;
                        this.project.startdate = this.f.startdate.value.toString();
                        this.project.enddate = this.f.enddate.value.toString();
                        console.log(this.project);
                        this.dataService.add('addProject', this.project).subscribe(res => {
                        });
                        this.alertService.error('Enregistrement du project BlockChain reussi !', false);
                        return;
                    }
                }
            });
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
