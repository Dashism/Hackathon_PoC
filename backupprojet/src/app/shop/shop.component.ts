import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AlertService, AuthenticationService } from '../_services';
import { DataService } from '../data.service';
import { HttpModule } from '@angular/http';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Agent } from '../_models/agent';
import { Diploma } from '../_models/diploma';
import { Skill } from '../_models/skill';
import { Project } from '../_models/project';
import { Car } from '../_models/car';
import { Responsebc } from '../_models/responsebc';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { throwError } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
    car: Car;
    respbc: Responsebc;
    private resolveSuffix = '?resolve=true';
    private headers: Headers;
    private url = 'http://localhost:3000/api/';
    constructor(private http: HttpClient, private authenticationService: AuthenticationService, private dataService: DataService<any>) {
        this.openMenu();
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    };

    ngOnInit() {
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

    getAgent(key: string) {
        this.dataService.get('agents', key)
            .subscribe(data => {
                console.log(data);
            });
    }

    getAgents() {
        this.dataService.getAll('agents')
            .subscribe((data: {}) => {
                console.log(data);
            });
    }

    updateAgent(key: string, json: any) {
        this.dataService.update('agent', key, JSON.stringify(json))
        .subscribe( res => {
            console.log(res);
        });
    }

    addAgent(json: any) {
        this.dataService.add('agent', JSON.stringify(json))
        .subscribe( res => {
            console.log(res);
        });
    }

    getCars() {
        this.dataService.getAll('queryallcars')
            .subscribe((data: {}) => {
                console.log(data);
            });
    }

    getCar(key: string) {
        this.dataService.get('query', 'CAR0')
            .subscribe(data => {
                this.respbc = data;
                console.log(this.respbc);
                console.log(this.respbc.response);
                this.car = JSON.parse(this.respbc.response);
                console.log(this.car.colour);
                console.log(this.car.make);
                console.log(this.car.model);
                console.log(this.car.owner);
            });
    }


}
