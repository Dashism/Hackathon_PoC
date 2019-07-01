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
import { Agent } from '../_models/agent';
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
    coinnumber: number;
    skilldisponibility: Skill[] = [];
    skillchoice: Skill[] = [];
    dispostart: Date;
    dispoend: Date;
    agent: Agent;
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
        this.dataService.getAll('agents')
            .subscribe((data: {}) => {
                for (let i = 0; i < 99; i++) {
                    if (JSON.stringify(data).includes('\\"AGENT' + i.toString() + '\\", \\"Record\\":{\\"ausername\\":\\"' + this.currentUser.username + '\\"')) {
                        this.dataService.get('agent', 'AGENT' + i.toString())
                            .subscribe(data2 => {
                                this.respbc = data2;
                                this.agent = JSON.parse(this.respbc.response);
                                this.coinnumber = +this.agent.coin;
                                console.log('debug' + this.coinnumber)
                            });
                        return;
                    }
                }
            });
        for (let l = 0; l < 99; l++) {
            this.dataService.get('skill', 'SKILL' + l.toString())
                .subscribe(data2 => {
                    if (!JSON.stringify(data2).includes(this.currentUser.username)) {
                        this.respbc = data2;
                        this.skill = new Skill();
                        this.skill = JSON.parse(this.respbc.response);
                        this.skillchoice.push(this.skill);
                        this.skillchoice = this.skillchoice.filter((el, i, a) => i === a.indexOf(el));
                        console.log(this.skillchoice);
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
        this.skillok = '3';
    }

    deleteSkill(index: number) {
        // this.project.skillList.splice(index, 1);
        const control = <FormArray>this.form.controls['skillset'];
        control.removeAt(index);
        this.skillok = '3';
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

    async onSubmit() {

        this.alertService.error('Enregistrement du project sur la BlockChain ...', false);

        this.dataService.getAll('projects')
            .subscribe((data: {}) => {
                for (let i = 0; i < 99; i++) {
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
                        return;
                    }
                }
            });

        // await delay(2000);
        // this.alertService.error('Enregistrement des compétences sur la BlockChain ...', false);

        // let goodskill: Skill[] = [];
        // let i = 0;
        // while (i < this.f.skillset.value.length) {
        //     let l = 0;
        //     console.log(goodskill.length);
        //     console.log(i);
        //     while (goodskill.length !== (i + 1)) {
        //         this.dataService.get('skill', 'SKILL' + l.toString())
        //             .subscribe(data2 => {
        //                 if (JSON.stringify(data2).includes('\\"bskillname\\":\\"' + this.f.skillset.value[i].skillname + '\\",\\"clevel\\":\\"' + this.f.skillset.value[i].level + '\\"')) {
        //                     this.respbc = data2;
        //                     this.skill = new Skill();
        //                     this.skill = JSON.parse(this.respbc.response);
        //                     goodskill.push(this.skill);
        //                     return;
        //                 }
        //             });
        //         await delay(1000);
        //         l++;
        //     }
        //     await delay(1000);
        //     i++;
        // }


        await delay(1000);
        this.alertService.error('Enregistrement des participants sur la BlockChain ...', false);

        let i = 0;
        while (i < this.skilldisponibility.length) {
            this.participant = new Participant();
            this.participant.projectname = this.f.name.value;
            this.participant.username = this.skilldisponibility[i].ausername;
            this.dataService.getAll('participants')
                .subscribe((data3: {}) => {
                    let j = 0;
                    while (JSON.stringify(data3).includes('PARTICIPANT' + j.toString())) {
                        j++;
                    }
                    this.participant.participantid = 'PARTICIPANT' + j.toString();
                    console.log(this.participant);
                    this.dataService.add('addParticipant', this.participant).subscribe(res => {
                    });
                });

            this.pskill = new Projectskill();
            this.pskill.projectname = this.f.name.value;
            this.pskill.skillname = this.skilldisponibility[i].bskillname;
            this.pskill.username = this.skilldisponibility[i].ausername;
            this.pskill.level = this.skilldisponibility[i].clevel;

            this.dataService.getAll('projectskills')
                .subscribe((data4: {}) => {
                    let g = 0;
                    while (JSON.stringify(data4).includes('PROJECTSKILL' + g.toString())) {
                        g++;
                    }
                    this.pskill.projectskillid = 'PROJECTSKILL' + g.toString();
                    console.log(this.pskill);
                    this.dataService.add('addProjectskill', this.pskill).subscribe(res => {
                    });
                });
            await delay(6000);
            i++;
        }

        await delay(1);

        this.alertService.success('Enregistrement du project sur la BlockChain reussi !', false);
        this.skillok = '3';
    }

    logout(): void {
        this.authenticationService.logout();
    }

    async checkifskillspresent() {
        this.alertService.error('Recherche de participant sur la BlockChain ...', false);
        // let skillstring: String[] = [];
        // for (let i = 0; i < this.f.skillset.value.length; i++) {
        //         this.dataService.getAll('skills')
        //             .subscribe((data: {}) => {
        //                 if (JSON.stringify(data).includes('\\"bskillname\\":\\"' + this.f.skillset.value[i].skillname + '\\",\\"clevel\\":\\"' + this.f.skillset.value[i].level + '\\"')) {
        //                     skillstring.push('1');
        //                 } else {
        //                     skillstring.push('2');
        //                 }
        //             });
        // }

        // await delay(1000);

        // if (skillstring.includes('2')) {
        //     this.skillok = '2';
        //     console.log('test3');
        // } else {
        //     this.skillok = '1';
        //     console.log('test4');
        // }
        this.skilldisponibility = [];
        let l = 0;
        while (l < this.f.skillset.value.length) {
            for (let i = 0; i < 99; i++) {
                this.dataService.get('skill', 'SKILL' + i.toString())
                    .subscribe(data2 => {
                        if (JSON.stringify(data2).includes('\\"bskillname\\":\\"' + this.f.skillset.value[l].skillname + '\\",\\"clevel\\":\\"' + this.f.skillset.value[l].level + '\\"')) {
                            this.respbc = data2;
                            this.skill = new Skill();
                            this.skill = JSON.parse(this.respbc.response);
                            this.skill.username = this.skill.ausername;
                            for (let z = 0; z < 99; z++) {
                                this.dataService.get('agent', 'AGENT' + z.toString())
                                    .subscribe(data3 => {
                                        if (JSON.stringify(data3).includes(this.skill.username)) {
                                            this.respbc = data3;
                                            this.agent = new Agent();
                                            this.agent = JSON.parse(this.respbc.response);
                                            this.dispostart = new Date(this.agent.startdate);
                                            this.dispoend = new Date(this.agent.enddate);
                                            let startdate = new Date(this.f.startdate.value);
                                            let enddate = new Date(this.f.enddate.value);
                                            console.log('dispostart' + this.dispostart);
                                            console.log('dispoend' + this.dispoend);
                                            console.log('startdate' + startdate);
                                            console.log('enddate' + enddate);
                                            if (this.dispostart <= startdate && this.dispoend >= enddate) {
                                                this.skilldisponibility.push(this.skill);
                                            }
                                        }
                                    });
                            }
                        }
                    });
            }
            this.skilldisponibility = this.skilldisponibility.filter((el, i, a) => i === a.indexOf(el));
            await delay(8000);
            this.alertService.error('Nous avons trouvé : ' + this.skilldisponibility.length + ' participants sur la BlockChain', false);
            l++;
        }

        await delay(8000);

        console.log(this.skilldisponibility);

        if (this.skilldisponibility.length >= this.f.skillset.value.length) {
            this.skillok = '1';
            this.alertService.success('Nous avons trouvé : ' + this.skilldisponibility.length + ' participants sur la BlockChain !', false);
        } else {
            this.skillok = '2';
            this.alertService.error('Seulement : ' + this.skilldisponibility.length + ' participants trouvés sur la BlockChain ...', false);
        }
    }

    reset3() {
        this.skillok = '3';
    }
}

function delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
}
