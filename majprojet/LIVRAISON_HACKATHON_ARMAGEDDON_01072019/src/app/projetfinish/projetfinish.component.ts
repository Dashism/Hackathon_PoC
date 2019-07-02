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
import { User, Agent } from '../_models';
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
    entitylist: String[] = [];
    agent: Agent;
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
    form: FormGroup;
    formErrors: any;
    currentUser: User;
    currentUserSubscription: Subscription;
    skillok: string;
    skill: Skill;
    pskill: Projectskill;
    today: Date;
    projectskillForm: any;
    private _unsubscribeAll: Subject<any>;
    constructor(
        public formBuilder: FormBuilder,
        private alertService: AlertService,
        private router: Router,
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
        this.projectskillForm = this.formBuilder.group({
            'projectskillList': this.formBuilder.array([this.initProjectskills()])
        });
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    };

    ngOnInit() {
        this.today = new Date();
        for (let i = 0; i < 99; i++) {
            this.dataService.get('project', 'PROJECT' + i.toString())
                .subscribe(data => {
                    if (JSON.stringify(data).includes('\\"ausername\\":\\"' + this.currentUser.username + '\\"') && !JSON.stringify(data).includes('\\"finish\\":\\"1\\"')) {
                        this.respbc = data;
                        this.project = new Project();
                        this.project = JSON.parse(this.respbc.response);
                        let enddate = new Date(this.project.enddate);
                        if (enddate < this.today) {
                            this.projectlist.push(this.project);
                            console.log(this.projectlist);
                            for (let l = 0; l < this.projectlist.length; l++) {
                                console.log('test');
                                for (let k = 0; k < 99; k++) {
                                    this.dataService.get('projectskill', 'PROJECTSKILL' + k.toString())
                                        .subscribe(data4 => {
                                            if (JSON.stringify(data4).includes('\\"projectname\\":\\"' + this.projectlist[l].projectname + '\\"')) {
                                                this.respbc = data4;
                                                this.projectskill = new Projectskill();
                                                this.projectskill = JSON.parse(this.respbc.response);
                                                this.projectskilllist.push(this.projectskill);
                                                console.log(this.projectskilllist);
                                                this.projectskilllist.forEach(
                                                    item => {
                                                        this.addProjectskillsForm();
                                                    });
                                            }
                                        });
                                }
                            }
                        }
                    }
                });
        }

    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
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

    async onSubmit() {
        this.alertService.error('Mise à jour de projet sur la BlockChain ...', false);

        // Projet finish
        for (let l = 0; l < this.projectlist.length; l++) {
            for (let i = 0; i < 99; i++) {
                this.dataService.get('project', 'PROJECT' + i.toString())
                    .subscribe(data => {
                        console.log(this.projectlist[i].projectname);
                        if (JSON.stringify(data).includes('\\"ausername\\":\\"' + this.currentUser.username + '\\"') && JSON.stringify(data).includes('\\"finish\\":\\"0\\",\\"projectname\\":\\"' + this.projectlist[i].projectname + '\\"')) {
                            this.respbc = data;
                            this.project = new Project();
                            this.project = JSON.parse(this.respbc.response);
                            this.project.projectid = 'PROJECT' + i.toString();
                            this.project.finish = '1';
                            this.project.username = this.currentUser.username;
                            console.log(this.project);
                            this.dataService.add('addProject', this.project).subscribe(res => {
                            });
                        }
                    });
            }
        }

        await delay(3000);
        this.alertService.error('Mise à jour argent virtuel du créateur sur la BlockChain ...', false);

        // point agent createur
        this.dataService.getAll('agents')
            .subscribe((data: {}) => {
                for (let i = 0; i < 99; i++) {
                    if (JSON.stringify(data).includes('\\"AGENT' + i.toString() + '\\", \\"Record\\":{\\"ausername\\":\\"' + this.currentUser.username + '\\"')) {
                        this.dataService.get('agent', 'AGENT' + i.toString())
                            .subscribe(data2 => {
                                this.respbc = data2;
                                this.agent = new Agent();
                                this.agent = JSON.parse(this.respbc.response);
                                this.agent.username = this.agent.ausername;
                                this.agent.agentid = 'AGENT' + i.toString();
                                this.agent.coin = (+this.agent.coin - 1).toString();
                                console.log(this.agent);
                                this.dataService.add('addAgent', this.agent).subscribe(res => {
                                });
                            });
                    }
                }
            });

        await delay(3000);
        this.alertService.error('Mise à jour argent virtuel des participants sur la BlockChain ...', false);

        // point participants
        for (let l = 0; l < this.f.projectskillList.value.length; l++) {
            this.dataService.getAll('agents')
                .subscribe((data: {}) => {
                    for (let i = 0; i < 99; i++) {
                        if (JSON.stringify(data).includes('\\"AGENT' + i.toString() + '\\", \\"Record\\":{\\"ausername\\":\\"' + this.f.projectskillList.value[l].username + '\\"')) {
                            this.dataService.get('agent', 'AGENT' + i.toString())
                                .subscribe(data3 => {
                                    this.respbc = data3;
                                    this.agent = new Agent();
                                    this.agent = JSON.parse(this.respbc.response);
                                    this.agent.username = this.agent.ausername;
                                    this.agent.agentid = 'AGENT' + i.toString();
                                    this.agent.coin = (+this.agent.coin + 1).toString();
                                    this.agent.point = (+this.agent.point + 1).toString();
                                    console.log(this.agent);
                                    this.dataService.add('addAgent', this.agent).subscribe(res => {
                                    });
                                });
                        }
                    }
                });
        }

        await delay(3000);
        this.alertService.error('Mise à jour des points entité sur la BlockChain ...', false);

        //entity number
        for (let l = 0; l < this.f.projectskillList.value.length; l++) {
            this.dataService.getAll('agents')
                .subscribe((data: {}) => {
                    for (let i = 0; i < 99; i++) {
                        if (JSON.stringify(data).includes('\\"AGENT' + i.toString() + '\\", \\"Record\\":{\\"ausername\\":\\"' + this.f.projectskillList.value[l].username + '\\"')) {
                            this.dataService.get('agent', 'AGENT' + i.toString())
                                .subscribe(data4 => {
                                    this.respbc = data4;
                                    this.agent = new Agent();
                                    this.agent = JSON.parse(this.respbc.response);
                                    this.entitylist.push(this.agent.entity);
                                });
                        }
                    }
                });
        }

        await delay(3000);
        this.alertService.error('Mise à jour des points entité sur la BlockChain ...', false);

        // entity point
        for (let l = 0; l < this.entitylist.length; l++) {
            for (let i = 0; i < 99; i++) {
                this.dataService.get('agent', 'AGENT' + i.toString())
                    .subscribe(data5 => {
                        if (JSON.stringify(data5).includes('\\"entity\\":\\"' + this.entitylist[l].toString() + '\\"')) {
                            this.respbc = data5;
                            this.agent = new Agent();
                            this.agent = JSON.parse(this.respbc.response);
                            this.agent.username = this.agent.ausername;
                            this.agent.agentid = 'AGENT' + i.toString();
                            this.agent.entitypoint = (+this.agent.entitypoint + 1).toString();
                            console.log(this.agent);
                            this.dataService.add('addAgent', this.agent).subscribe(res => {
                            });
                        }
                    });
            }
        }

        await delay(3000);
        this.alertService.error('Mise à jour des nôtes des participants sur la BlockChain ...', false);

        // grade
        let l = 0;
        while (l < this.f.projectskillList.value.length) {
            this.dataService.getAll('skills')
                .subscribe((data: {}) => {
                    for (let i = 0; i < 99; i++) {
                        if (JSON.stringify(data).includes('\\"Key\\":\\"SKILL' + i.toString() + '\\", \\"Record\\":{\\"ausername\\":\\"' + this.f.projectskillList.value[l].username + '\\",\\"bskillname\\":\\"' + this.f.projectskillList.value[l].skillname + '\\"')) {
                            this.dataService.get('skill', 'SKILL' + i.toString())
                                .subscribe(data4 => {
                                    this.respbc = data4;
                                    this.skill = new Skill();
                                    this.skill = JSON.parse(this.respbc.response);
                                    this.skill.username = this.skill.ausername;
                                    this.skill.skillname = this.skill.bskillname;
                                    this.skill.level = this.skill.clevel;
                                    this.skill.grade = this.f.projectskillList.value[l].grade;
                                    this.skill.skillid = 'SKILL' + i.toString();
                                    console.log(this.skill);
                                    this.dataService.add('addSkill', this.skill).subscribe(res => {
                                    });
                                });
                        }
                    }
                });
            await delay(6000);
            l++;
        }

        await delay(3000);
        this.alertService.error('Création des nouvelles compétences sur la BlockChain ...', false);

        //new competence
        let m = 0;
        while (m < this.f.projectskillList.value.length) {
            if (this.f.projectskillList.value[m].newskill !== '' && this.f.projectskillList.value[m].level !== '') {
                this.skill = new Skill();
                this.skill.username = this.f.projectskillList.value[m].username;
                this.skill.skillname = this.f.projectskillList.value[m].newskill;
                this.skill.level = this.f.projectskillList.value[m].level;
                this.skill.grade = '';
                this.dataService.getAll('skills')
                    .subscribe((data: {}) => {
                        let y = 0;
                        while (JSON.stringify(data).includes('SKILL' + y.toString())) {
                            y++;
                        }
                        this.skill.skillid = 'SKILL' + y.toString();
                        console.log(this.skill);
                        this.dataService.add('addSkill', this.skill).subscribe(res => {
                        });
                    });
            }
            await delay(4000);
            m++;
        }

        await delay(1000);
        this.alertService.success('Enregistrement de la notation sur la BlockChain reussi !', false);

        await delay(1000);
        this.alertService.success('Merci de votre participation !', false);

        await delay(1000);
        this.router.navigate(['/profil']);

    }

    logout(): void {
        this.authenticationService.logout();
    }

    initProjectskills() {
        return this.formBuilder.group({
            'username': [''],
            'skillname': [''],
            'grade': ['', Validators.pattern('/^(0[1-9]|1\d|20)$/')],
            'newskill': [''],
            'level': ['', Validators.pattern('[1-5]')]
        });
    }

    addProjectskillsForm() {
        const control = <FormArray>this.projectskillForm.controls['projectskillList'];
        control.push(this.initProjectskills());
    }

    get f() { return this.projectskillForm.controls; }

}

function delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
}
