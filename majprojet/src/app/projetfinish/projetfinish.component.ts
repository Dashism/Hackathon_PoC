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
import { Skill } from '../_models/skill';
import { Project } from '../_models/project';
import { Projectskill } from '../_models/projectskill';
import { Responsebc } from '../_models/responsebc';
import { Participant } from '../_models/participant';


@Component({
    selector: 'app-projetfinish',
    templateUrl: './projetfinish.component.html',
    styleUrls: ['./projetfinish.component.scss']
})
export class ProjetfinishComponent implements OnInit, OnDestroy {
    projectskill: Projectskill;
    projectskilllist: Projectskill[] = [];
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
    skillok: string;
    skill: Skill;
    pskill: Projectskill;
    today: Date;
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
            projectskilllist: {}
        };
        this._unsubscribeAll = new Subject();
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    };

    ngOnInit() {
        this.today = new Date();
        this.form = this._formBuilder.group({
            projectskilllist: this._formBuilder.array([this.initSkill()])
        });
        this.form.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged();
            });
        for (let i = 0; i < 13; i++) {
            this.dataService.get('project', 'PROJECT' + i.toString())
                .subscribe(data => {
                    if (JSON.stringify(data).includes('\\"ausername\\":\\"' + this.currentUser.username + '\\"') && !JSON.stringify(data).includes('\\"finish\\":\\"1\\"')) {
                        this.respbc = data;
                        this.project = new Project();
                        this.project = JSON.parse(this.respbc.response);
                        this.projectlist.push(this.project);
                        console.log(this.projectlist);
                    }
                });
        }
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    initSkill() {
        return this._formBuilder.group({
            username: ['', Validators.required],
            skillname: ['', Validators.required],
            grade: ['', Validators.pattern('[1-20]')]
        });
    }

    addSkillForm() {
        const control = <FormArray>this.form.controls['skillset'];
        control.push(this.initSkill());
    }

    loadparticipant() {
        for (let l = 0; l < this.projectlist.length; l++) {
            console.log('test');
            for (let k = 0; k < 19; k++) {
                this.dataService.get('participant', 'PARTICIPANT' + k.toString())
                    .subscribe(data3 => {
                        console.log('\\"projectname\\":\\"' + this.projectlist[l].projectname + '\\"');
                        console.log(JSON.stringify(data3).includes('\\"projectname\\":\\"' + this.projectlist[l].projectname + '\\"'));
                        if (JSON.stringify(data3).includes('\\"projectname\\":\\"' + this.projectlist[l].projectname + '\\"')) {
                            console.log('2222222222');
                            this.respbc = data3;
                            this.participant = new Participant();
                            this.participant = JSON.parse(this.respbc.response);
                            this.participantlist.push(this.participant);
                            console.log(this.participantlist + '2222222222');
                        }
                    });
                this.dataService.get('projectskill', 'PROJECTSKILL' + k.toString())
                    .subscribe(data4 => {
                        if (JSON.stringify(data4).includes('\\"projectname\\":\\"' + this.projectlist[l].projectname + '\\"')) {
                            this.respbc = data4;
                            this.projectskill = new Projectskill();
                            this.projectskill = JSON.parse(this.respbc.response);
                            this.projectskilllist.push(this.projectskill);
                            console.log(this.projectskilllist + '3333333333');
                        }
                    });
            }
        }
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

    }

    logout(): void {
        this.authenticationService.logout();
    }

}
