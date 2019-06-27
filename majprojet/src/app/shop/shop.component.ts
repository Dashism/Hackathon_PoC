import { Component } from '@angular/core';
import { Validators, FormArray, FormBuilder } from '@angular/forms';
import { Diploma } from '../_models/diploma';
import { DataService } from '../data.service';
import { Responsebc } from '../_models/responsebc';
import { AuthenticationService } from '../_services';
import { User } from '../_models';
import { Subscription } from 'rxjs';
import { Skill } from '../_models/skill';

@Component({
    selector: 'my-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.scss']
})
export class ShopComponent {
    skill: Skill;
    skills: Skill[] = [
        { grade: '', level: '3', skillname: 'labs1', username: '2' },
        { grade: '', level: '3', skillname: 'labs1', username: '2' },
        { grade: '', level: '3', skillname: 'labs1', username: '2' },
        { grade: '', level: '3', skillname: 'labs1', username: '2' }
    ];
    skilllist: Skill[] = [
        { skillname: 'labs1', username: '2', grade: '', level: '3' },
        { skillname: 'labs2', username: '2', grade: '', level: '3' },
        { skillname: 'labs3', username: '2', grade: '', level: '3' },
        { skillname: 'Olabel4', username: '3', grade: '', level: '3' }
    ];
    diploma: Diploma;
    respbc: Responsebc;
    diplomas: Diploma[] = [
        { diplomaname: 'labs1', username: '2' },
        { diplomaname: 'labs2', username: '2' },
        { diplomaname: 'labs3', username: '2' },
        { diplomaname: 'Olabel4', username: '3' }
    ];
    diplomalist: Diploma[] = [];
    diplomaForm: any;
    skillForm: any;
    currentUser: User;
    currentUserSubscription: Subscription;
    constructor(
        public formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private dataService: DataService<any>
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
        this.diplomaForm = this.formBuilder.group({
            'diplomaList': this.formBuilder.array([this.initDiplomas()])
        });
        this.skillForm = this.formBuilder.group({
            'skillList': this.formBuilder.array([this.initSkills()])
        });
    }

    ngOnInit() {
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

        this.skilllist.forEach(
            item => {
                this.addSkillsForm();
            });
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
