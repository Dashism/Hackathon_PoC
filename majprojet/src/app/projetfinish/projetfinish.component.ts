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
    router: Router;
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
        for (let i = 0; i < 13; i++) {
            this.dataService.get('project', 'PROJECT' + i.toString())
                .subscribe(data => {
                    if (JSON.stringify(data).includes('\\"ausername\\":\\"' + this.currentUser.username + '\\"') && !JSON.stringify(data).includes('\\"finish\\":\\"1\\"')) {
                        this.respbc = data;
                        this.project = new Project();
                        this.project = JSON.parse(this.respbc.response);
                        this.projectlist.push(this.project);
                        console.log(this.projectlist);
                        for (let l = 0; l < this.projectlist.length; l++) {
                            console.log('test');
                            for (let k = 0; k < 19; k++) {
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
                });
        }

    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    loadparticipant() {
        for (let l = 0; l < this.projectlist.length; l++) {
            console.log('test');
            for (let k = 0; k < 19; k++) {
                // this.dataService.get('participant', 'PARTICIPANT' + k.toString())
                //     .subscribe(data3 => {
                //         console.log('\\"projectname\\":\\"' + this.projectlist[l].projectname + '\\"');
                //         console.log(JSON.stringify(data3).includes('\\"projectname\\":\\"' + this.projectlist[l].projectname + '\\"'));
                //         if (JSON.stringify(data3).includes('\\"projectname\\":\\"' + this.projectlist[l].projectname + '\\"')) {
                //             console.log('2222222222');
                //             this.respbc = data3;
                //             this.participant = new Participant();
                //             this.participant = JSON.parse(this.respbc.response);
                //             this.participantlist.push(this.participant);
                //             console.log(this.participantlist + '2222222222');
                //         }
                //     });
                this.dataService.get('projectskill', 'PROJECTSKILL' + k.toString())
                    .subscribe(data4 => {
                        if (JSON.stringify(data4).includes('\\"projectname\\":\\"' + this.projectlist[l].projectname + '\\"')) {
                            this.respbc = data4;
                            this.projectskill = new Projectskill();
                            this.projectskill = JSON.parse(this.respbc.response);
                            this.projectskilllist.push(this.projectskill);
                            console.log(this.projectskilllist + '3333333333');
                            this.projectskilllist.forEach(
                                item => {
                                    this.addProjectskillsForm();
                                });
                        }
                    });
            }
        }
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

    onSubmit() {
        for (let l = 0; l < this.projectlist.length; l++) {
            for (let i = 0; i < 20; i++) {
                this.dataService.get('project', 'PROJECT' + i.toString())
                    .subscribe(data => {
                        if (JSON.stringify(data).includes('\\"ausername\\":\\"' + this.currentUser.username + '\\"') && JSON.stringify(data).includes('\\"finish\\":\\"0\\",\\"projectname\\":\\"' + this.projectlist[i].projectname + '\\"')) {
                            this.respbc = data;
                            this.project = JSON.parse(this.respbc.response);
                            this.project.projectid = 'PROJECT' + i.toString();
                            this.project.finish = '1';
                            this.dataService.add('addProject', this.project).subscribe(res => {
                            });
                        }
                    });
            }
        }
        this.dataService.getAll('agents')
            .subscribe((data: {}) => {
                for (let i = 0; i < 20; i++) {
                    if (JSON.stringify(data).includes('\\"AGENT' + i.toString() + '\\", \\"Record\\":{\\"ausername\\":\\"' + this.currentUser.username + '\\"')) {
                        this.dataService.get('agent', 'AGENT' + i.toString())
                            .subscribe(data2 => {
                                this.respbc = data2;
                                this.agent = JSON.parse(this.respbc.response);
                                this.agent.agentid = 'AGENT' + i.toString();
                                this.agent.coin = (+this.agent.coin - 1).toString();
                                this.dataService.add('addAgent', this.agent).subscribe(res => {
                                });
                            });
                    }
                }
            });
        for (let l = 0; l < this.f.projectskillList.value.length; l++) {
            this.dataService.getAll('agents')
                .subscribe((data: {}) => {
                    for (let i = 0; i < 20; i++) {
                        if (JSON.stringify(data).includes('\\"AGENT' + i.toString() + '\\", \\"Record\\":{\\"ausername\\":\\"' + this.f.projectskillList.value[l].username + '\\"')) {
                            this.dataService.get('agent', 'AGENT' + i.toString())
                                .subscribe(data2 => {
                                    this.respbc = data2;
                                    this.agent = JSON.parse(this.respbc.response);
                                    this.agent.agentid = 'AGENT' + i.toString();
                                    this.agent.coin = (+this.agent.coin + 1).toString();
                                    this.agent.point = (+this.agent.point + 1).toString();
                                    this.dataService.add('addAgent', this.agent).subscribe(res => {
                                    });
                                });
                        }
                    }
                });
        }

        for (let k = 0; k < this.f.projectskillList.value.length; k++) {
            for (let i = 0; i < 20; i++) {
                this.dataService.get('skill', 'SKILL' + i.toString())
                    .subscribe(data2 => {
                        if (JSON.stringify(data2).includes('')) {
                            this.respbc = data2;
                            this.agent = JSON.parse(this.respbc.response);
                            this.agent.agentid = 'AGENT' + i.toString();
                            this.agent.coin = (+this.agent.coin + 1).toString();
                            this.agent.point = (+this.agent.point + 1).toString();
                            this.dataService.add('addSkill', this.agent).subscribe(res => {
                            });
                        }
                    });
            }
        }

        this.dataService.getAll('agents')
            .subscribe((data: {}) => {
                for (let i = 0; i < 20; i++) {
                    if (JSON.stringify(data).includes('\\"AGENT' + i.toString() + '\\", \\"Record\\":{\\"ausername\\":\\"' + this.currentUser.username + '\\"')) {
                        this.dataService.get('agent', 'AGENT' + i.toString())
                            .subscribe(data2 => {
                                this.respbc = data2;
                                this.agent = JSON.parse(this.respbc.response);
                                this.agent.entity = (+this.agent.coin + 1).toString();
                                this.dataService.add('addAgent', this.agent).subscribe(res => {
                                });
                            });
                    }
                    if (JSON.stringify(data).includes('\"entity\":\"' + this.agent.entity + '\"')) {
                        this.dataService.get('agent', 'AGENT' + i.toString())
                            .subscribe(data2 => {
                                this.respbc = data2;
                                this.agent = JSON.parse(this.respbc.response);
                                this.agent.entity = (+this.agent.coin + 1).toString();
                                this.dataService.add('addAgent', this.agent).subscribe(res => {
                                });
                            });
                    }
                }
            });

    }

    logout(): void {
        this.authenticationService.logout();
    }

    initProjectskills() {
        return this.formBuilder.group({
            'username': [''],
            'skillname': [''],
            'grade': ['', Validators.pattern('[1-20]')],
            'newskill': [''],
            'level': ['']
        });
    }

    addProjectskillsForm() {
        const control = <FormArray>this.projectskillForm.controls['projectskillList'];
        control.push(this.initProjectskills());
    }

    get f() { return this.projectskillForm.controls; }

}
