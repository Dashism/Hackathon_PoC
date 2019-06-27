import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
import { Responsebc } from '../_models/responsebc';
// import { Responsebc2 } from '../_models/responsebc2';
import { DataService } from '../data.service';
import { Agent } from '../_models/agent';
import { Diploma } from '../_models/diploma';
import { Skill } from '../_models/skill';

@Component({
    selector: 'app-profil',
    templateUrl: './profil.component.html',
    styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit, OnDestroy {
    skill: Skill;
    skilllist: Skill[] = [];
    actualagentnumber: string;
    str: string;
    diploma: Diploma;
    diplomalist: Diploma[] = [];
    diplomalisttest: Diploma[] = [];
    agent: Agent;
    respbc: Responsebc;
    // respbc2: Responsebc2;
    router: Router;
    form: FormGroup;
    form2: any;
    formErrors: any;
    formErrors2: any;
    currentUser: User;
    currentUserSubscription: Subscription;
    diplomaForm: any;
    skillForm: any;
    private _unsubscribeAll: Subject<any>;
    constructor(
        public formBuilder: FormBuilder,
        private alertService: AlertService,
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _formBuilder2: FormBuilder,
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

        this.formErrors2 = {
            coin: {},
            point: {},
            entity: {},
            entitypoint: {}
        };
        this._unsubscribeAll = new Subject();
        this.diplomaForm = this.formBuilder.group({
            'diplomaList': this.formBuilder.array([this.initDiplomas()])
        });
        this.skillForm = this.formBuilder.group({
            'skillList': this.formBuilder.array([this.initSkills()])
        });
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        this.agent = new Agent();
        this.agent.coin = '0';
        this.agent.point = '0';
        this.agent.entitypoint = '0';
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
            'coin': '',
            'point': '',
            'entity': ['', Validators.required],
            'entitypoint': ''
        });
        this.form2.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged2();
            });
        this.dataService.getAll('agents')
            .subscribe((data: {}) => {
                for (let i = 0; i < 9; i++) {
                    if (JSON.stringify(data).includes('\\"AGENT' + i.toString() + '\\", \\"Record\\":{\\"ausername\\":\\"' + this.currentUser.username + '\\"')) {
                        console.log(i.toString());
                        this.actualagentnumber = i.toString();
                        console.log(this.actualagentnumber + '------------');
                        this.dataService.get('agent', 'AGENT' + i.toString())
                            .subscribe(data2 => {
                                this.respbc = data2;
                                this.agent = JSON.parse(this.respbc.response);
                                console.log(this.agent.coin);
                                console.log(this.agent.entity);
                                console.log(this.agent.entitypoint);
                                console.log(this.agent.point);
                            });
                        return;
                    }
                }
            });
        this.dataService.getAll('diplomas')
            .subscribe((data: {}) => {
                for (let i = 0; i < 9; i++) {
                    if (JSON.stringify(data).includes('\\"DIPLOMA' + i.toString() + '\\", \\"Record\\":{\\"ausername\\":\\"' + this.currentUser.username + '\\"')) {
                        this.dataService.get('diploma', 'DIPLOMA' + i.toString())
                            .subscribe(data2 => {
                                this.respbc = data2;
                                this.diploma = JSON.parse(this.respbc.response);
                                this.diplomalist.push(this.diploma);
                                console.log(this.diplomalist);
                                this.diplomalist.forEach(
                                    item => {
                                        this.addDiplomasForm();
                                    });
                            });
                    }
                }
            });
        this.dataService.getAll('skills')
            .subscribe((data: {}) => {
                for (let i = 0; i < 9; i++) {
                    if (JSON.stringify(data).includes('\\"SKILL' + i.toString() + '\\", \\"Record\\":{\\"ausername\\":\\"' + this.currentUser.username + '\\"')) {
                        this.dataService.get('skill', 'SKILL' + i.toString())
                            .subscribe(data2 => {
                                this.respbc = data2;
                                this.skill = JSON.parse(this.respbc.response);
                                this.skilllist.push(this.skill);
                                console.log(this.skilllist);
                                this.skilllist.forEach(
                                    item => {
                                        this.addSkillsForm();
                                    });
                            });
                    }
                }
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
        for (const field in this.formErrors2) {
            if (!this.formErrors2.hasOwnProperty(field)) {
                continue;
            }
            // Clear previous errors
            this.formErrors2[field] = {};
            // Get the control
            const control = this.form.get(field);
            if (control && control.dirty && !control.valid) {
                this.formErrors2[field] = control.errors;
            }
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }
    get f2() { return this.form2.controls; }
    get f3() { return this.diplomaForm.controls; }
    get f4() { return this.skillForm.controls; }

    onSubmit() {
        if (this.form.invalid) {
            return;
        }

        this.userService.update(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Enregistrement de vos données personnelles reussi !', false);
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

    async onSubmit2() {
        for (let i = 0; i < 9; i++) {
            this.dataService.get('agent', 'AGENT' + i.toString())
                .subscribe(data => {
                    for (let k = 0; k < 99; k++) {
                        if (JSON.stringify(data).includes('\\"entity\\":\\"' + this.f2.entity.value + '\\",\\"entitypoint\\":\\"' + k.toString() + '\\"')) {
                            this.f2.entitypoint.value = k.toString();
                            console.log(this.f2.entitypoint.value);
                            this.agent = new Agent();
                            this.agent.agentid = 'AGENT' + this.actualagentnumber;
                            this.agent.username = this.currentUser.username;
                            this.agent.coin = this.f2.coin.value;
                            this.agent.entity = this.f2.entity.value;
                            this.agent.entitypoint = this.f2.entitypoint.value;
                            this.agent.point = this.f2.point.value;
                            console.log(this.agent);
                            this.dataService.add('addAgent', this.agent)
                                .subscribe(res => {
                                    return;
                                });
                        }
                    }
                    this.dataService.getAll('agents')
                        .subscribe((data2: {}) => {
                            if (!JSON.stringify(data2).includes('\\"entity\\":\\"' + this.f2.entity.value + '\\"')) {
                                this.agent = new Agent();
                                this.agent.agentid = 'AGENT' + this.actualagentnumber;
                                this.agent.username = this.currentUser.username;
                                this.agent.coin = this.f2.coin.value;
                                this.agent.entity = this.f2.entity.value;
                                this.agent.entitypoint = '0';
                                this.agent.point = this.f2.point.value;
                                console.log(this.agent);
                                this.dataService.add('addAgent', this.agent)
                                    .subscribe(res => {
                                        return;
                                    });
                            }
                        });
                });
        }

        await this.dataService.getAll('diplomas')
            .subscribe((data4: {}) => {
                for (let b = 0; b < 20; b++) {
                    if (JSON.stringify(data4).includes('\\"Key\\":\\"DIPLOMA' + b.toString() + '\\", \\"Record\\":{\\"ausername\\":\\"' + this.currentUser.username + '\\"')) {
                        this.dataService.delete('delete', 'DIPLOMA' + b.toString()).subscribe(res => {
                        });
                    }
                }
            }
            );


        await this.dataService.getAll('skills')
            .subscribe((data4: {}) => {
                for (let b = 0; b < 20; b++) {
                    if (JSON.stringify(data4).includes('\\"Key\\":\\"SKILL' + b.toString() + '\\", \\"Record\\":{\\"ausername\\":\\"' + this.currentUser.username + '\\"')) {
                        this.dataService.delete('delete', 'SKILL' + b.toString()).subscribe(res => {
                        });
                    }
                }
            }
            );

        for (let b = 0; b < this.f3.diplomaList.value.length; b++) {
            const diploma = new Diploma();
            diploma.diplomaid = 'DIPLOMA' + b.toString();
            diploma.diplomaname = this.f3.diplomaList.value[b].diplomaname;
            diploma.username = this.currentUser.username;
            this.dataService.add('addDiploma', diploma).subscribe(res => {
            });
        }

        for (let b = 0; b < this.f4.skillList.value.length; b++) {
            const skill = new Skill();
            skill.skillid = 'SKILL' + b.toString();
            skill.username = this.currentUser.username;
            skill.skillname = this.f4.skillList.value[b].skillname;
            skill.level = this.f4.skillList.value[b].level;
            skill.grade = '';
            this.dataService.add('addSkill', skill).subscribe(res => {
            });
        }
    }

    // checkskills() {
    //     this.dataService.getAll('skills')
    //         .subscribe((data5: {}) => {
    //             for (let l = 0; l < 20; l++) {
    //                 this.dataService.get('skill', 'SKILL' + l.toString())
    //                     .subscribe(data10 => {
    //                         for (let b = 0; b < this.f2.skillset.value.length; b++) {
    //                             if (JSON.stringify(data10).includes('\\"ausername\\":\\"' + this.currentUser.username + '\\"') && (JSON.stringify(data10).includes('\\"level\\":\\"' + this.f2.skillset.value[b].level + '\\",\\"skillname\\":\\"' + this.f2.skillset.value[b].skillname + '\\"'))) {
    //                                 for (let i = 0; i < 20; i++) {
    //                                     if (!JSON.stringify(data5).includes('SKILL' + i.toString())) {
    //                                         this.str = i.toString();
    //                                         this.skill = new Skill();
    //                                         this.skill.skillid = 'SKILL' + i.toString();
    //                                         this.skill.username = this.currentUser.username;
    //                                         this.skill.skillname = this.f2.skillset.value[b].skillname;
    //                                         this.skill.level = this.f2.skillset.value[b].level;
    //                                         this.skill.grade = '0';
    //                                         console.log(this.diploma);
    //                                         this.dataService.add('addDiploma', this.diploma).subscribe(res => {
    //                                         });
    //                                         return;
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     });
    //             }
    //         });
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

    initDiplomas() {
        return this.formBuilder.group({
            'diplomaname': ['']
        });
    }

    addDiploma() {
        const diploma = new Diploma();
        this.diplomalist.push(diploma);
        this.addDiplomasForm();
    }

    deleteDiploma(index: number) {
        this.diplomalist.splice(index, 1);
    }

    addDiplomasForm() {
        const control = <FormArray>this.diplomaForm.controls['diplomaList'];
        control.push(this.initDiplomas());
    }

    initSkills() {
        return this.formBuilder.group({
            'skillname': [''],
            'level': ['', Validators.pattern('[1-5]')]
        });
    }

    addSkill() {
        const skill = new Skill();
        this.skilllist.push(skill);
        this.addSkillsForm();
    }

    deleteSkill(index: number) {
        this.skilllist.splice(index, 1);
    }

    addSkillsForm() {
        const control1 = <FormArray>this.skillForm.controls['skillList'];
        control1.push(this.initSkills());
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
