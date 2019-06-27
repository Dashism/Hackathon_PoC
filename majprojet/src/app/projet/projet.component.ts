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
    selector: 'app-projet',
    templateUrl: './projet.component.html',
    styleUrls: ['./projet.component.scss']
})
export class ProjetComponent implements OnInit, OnDestroy {
    participant: Participant;
    skillok: string;
    skill: Skill;
    pskill: Projectskill;
    respbc: Responsebc;
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
            level: {}
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
            skillset: this._formBuilder.array([this.initSkill()])
        });
        this.form.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged();
            });
        console.log(this.currentUser.id);
        this.skillok = '3';
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    initSkill() {
        return this._formBuilder.group({
            skillname: ['', Validators.required],
            level: ['', Validators.pattern('[1-5]')]
        });
    }

    addSkillForm() {
        const control = <FormArray>this.form.controls['skillset'];
        control.push(this.initSkill());
    }

    addSkill() {
        this.addSkillForm();
    }

    deleteSkill(index: number) {
        // this.project.skillList.splice(index, 1);
        const control = <FormArray>this.form.controls['skillset'];
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
                        this.project.finish = '0';
                        console.log(this.project);
                        this.dataService.add('addProject', this.project).subscribe(res => {
                        });
                        this.alertService.error('Enregistrement du project BlockChain reussi !', false);
                        return;
                    }
                }
            });

        for (let i = 0; i < this.f.skillset.value.length; i++) {
            for (let k = 0; k < 13; k++) {
                this.dataService.get('skill', 'SKILL' + k.toString())
                    .subscribe(data2 => {
                        if (JSON.stringify(data2).includes('\\"level\\":\\"' + this.f.skillset.value[i].level + '\\",\\"skillname\\":\\"' + this.f.skillset.value[i].skillname + '\\"')) {
                            this.respbc = data2;
                            this.skill = JSON.parse(this.respbc.response);
                            this.participant = new Participant();
                            this.participant.projectname = this.f.name.value;
                            this.participant.username = this.skill.username;
                            for (let l = 0; l < 13; l++) {
                                this.dataService.getAll('participant')
                                    .subscribe((data3: {}) => {
                                        if (!JSON.stringify(data3).includes('PARTICIPANT' + l.toString())) {
                                            if (!JSON.stringify(data3).includes('\\"ausername\\":\\"' + this.participant.username + '\\",\\"projectname\\":\\"' + this.participant.projectname + '\\"')) {
                                                this.participant.participantid = 'PARTICIPANT' + l.toString();
                                                this.dataService.add('addParticpant', this.participant).subscribe(res => {
                                                    return;
                                                });
                                            }
                                        }
                                    });
                            }
                            this.pskill = new Projectskill();
                            this.pskill.projectname = this.f.name.value;
                            this.pskill.skillname = this.f.skillset.value[i].skillname;
                            this.pskill.level = this.f.skillset.value[i].level;
                            this.pskill.grade = '';
                            for (let l = 0; l < 13; l++) {
                                this.dataService.getAll('projectskills')
                                    .subscribe((data3: {}) => {
                                        if (!JSON.stringify(data3).includes('PROJECTSKILL' + l.toString())) {
                                            this.pskill.projectskillid = 'PROJECTSKILL' + l.toString();
                                            this.dataService.add('addProjectskill', this.pskill).subscribe(res => {
                                                return;
                                            });
                                        }
                                    });
                            }
                        }
                    });
            }
        }
        this.skillok = '3';
    }

    logout(): void {
        this.authenticationService.logout();
    }

    checkifskillspresent() {
        let skillstring: String[] = [];
        for (let i = 0; i < this.f.skillset.value.length; i++) {
            this.dataService.getAll('skills')
                .subscribe((data: {}) => {
                    if (JSON.stringify(data).includes('\\"level\\":\\"' + this.f.skillset.value[i].level + '\\",\\"skillname\\":\\"' + this.f.skillset.value[i].skillname + '\\"')) {
                        skillstring.push('1');
                    } else {
                        skillstring.push('2');
                    }
                    if (skillstring.includes('2')) {
                        this.skillok = '2';
                    } else {
                        this.skillok = '1';
                    }
                });
        }
    }

    reset3() {
        this.skillok = '3';
    }
}
