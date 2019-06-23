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
import { DataService } from '../data.service';
import { Project } from '../_models/project';
import { Responsebc } from '../_models/responsebc';
import { Participant } from '../_models/participant';

@Component({
    selector: 'app-projetlist',
    templateUrl: './projetlist.component.html',
    styleUrls: ['./projetlist.component.scss']
})
export class ProjetlistComponent implements OnInit, OnDestroy {
    respbc: Responsebc;
    participant: Participant;
    participantlist: Participant[] = [];
    participantlist2: Participant[] = [];
    projectnumber: Number[] = [];
    project: Project;
    projectlist: Project[] = [];
    projectuserparticipate: Project[] = [];
    users: User[] = [];
    usersmodif: User[] = [];
    usersmodif2: User[] = [];
    userscreator: User[] = [];
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
            id: {},
            name: {},
            firstname: {},
            email: {},
            mobile: {},
            username: {},
            password: {},
            passwordConfirm: {}
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
            username: [this.currentUser.username, Validators.required],
            password: [this.currentUser.password, [Validators.required, Validators.minLength(5)]],
            passwordConfirm: [this.currentUser.password, [Validators.required, confirmPassword]]
        });
        this.form.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged();
            });
        this.dataService.getAll('projects')
            .subscribe((data: {}) => {
                for (let i = 0; i < 9; i++) {
                    if (JSON.stringify(data).includes('\\"PROJECT' + i.toString() + '\\", \\"Record\\":{\\"ausername\\":\\"' + this.currentUser.username + '\\"')) {
                        this.dataService.get('project', 'PROJECT' + i.toString())
                            .subscribe(data2 => {
                                this.respbc = data2;
                                this.project = new Project();
                                this.project = JSON.parse(this.respbc.response);
                                this.projectlist.push(this.project);
                            });
                    }
                }
            });


        for (let i = 0; i < 9; i++) {
            this.dataService.get('participant', 'PARTICIPANT' + i.toString())
                .subscribe(data10 => {
                    if (JSON.stringify(data10).includes('\\"ausername\\":\\"' + this.currentUser.username + '\\"')) {
                        this.respbc = data10;
                        this.participant = new Participant();
                        this.participant = JSON.parse(this.respbc.response);
                        this.participantlist2.push(this.participant);
                        console.log(this.participantlist2);
                        for (let l = 0; l < 9; l++) {
                            this.dataService.get('project', 'PROJECT' + l.toString())
                                .subscribe(data11 => {
                                    for (let k = 0; k < this.participantlist2.length; k++) {
                                        if (JSON.stringify(data11).includes('\\"projectname\\":\\"' + this.participantlist2[k].projectname + '\\"')) {
                                            this.respbc = data11;
                                            this.project = new Project();
                                            this.project = JSON.parse(this.respbc.response);
                                            this.projectuserparticipate.push(this.project);
                                            console.log(this.projectuserparticipate);
                                        }
                                    }
                                });
                        }
                    }
                });
        }
    }


    loadparticipant() {
        for (let i = 0; i < this.projectlist.length; i++) {
            for (let k = 0; k < 9; k++) {
                this.dataService.get('participant', 'PARTICIPANT' + k.toString())
                    .subscribe(data3 => {
                        console.log('\\"projectname\\":\\"' + this.project.projectname + '\\"');
                        console.log(JSON.stringify(data3).includes('\\"projectname\\":\\"' + this.projectlist[i].projectname + '\\"'));
                        if (JSON.stringify(data3).includes('\\"projectname\\":\\"' + this.projectlist[i].projectname + '\\"')) {
                            this.respbc = data3;
                            this.participant = new Participant();
                            this.participant = JSON.parse(this.respbc.response);
                            console.log(this.participant);
                            this.participantlist.push(this.participant);
                        }
                    });
            }
        }
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
                    this.alertService.success('Enregistrement reussi', true);
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

    loadinfoparticipant() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            console.log(users);
            console.log(this.participantlist);
            for (let k = 0; k < this.participantlist.length; k++) {
                for (let i = 0; i < users.length; i++) {
                    console.log(users[i].username);
                    console.log(this.participantlist[k].username);
                    if (users[i].username === this.participantlist[k].ausername) {
                        this.usersmodif.push(users[i]);
                    }
                }
                this.users = this.usersmodif;
            }
        });
    }

    loadinfocreator() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            for (let k = 0; k < this.projectuserparticipate.length; k++) {
                for (let i = 0; i < users.length; i++) {
                    if (users[i].username === this.projectuserparticipate[k].ausername) {
                        this.usersmodif2.push(users[i]);
                    }
                }
                this.userscreator = this.usersmodif2;
            }
            console.log(this.userscreator);
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
