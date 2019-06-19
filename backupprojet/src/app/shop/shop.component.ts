import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AlertService, AuthenticationService } from '../_services';
import { DataService } from '../data.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Agent } from '../_models/agent';
import { Diploma } from '../_models/diploma';
import { Skill } from '../_models/skill';
import { Project } from '../_models/project';

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
    private errorMessage;
    private listagents = [];
    constructor(private authenticationService: AuthenticationService, private dataService: DataService<any>) {
        this.openMenu();

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

    getAgent(key: number): Observable<Agent[]> {
        return this.dataService.get('agents', key)
            .pipe(

            );
    }

    getAgents(): Observable<Agent[]> {
        return this.dataService.getAll('agents')
            .pipe(

            );
    }

    updateAgent(key: number, agent: Agent): Observable<Agent> {
        return this.dataService.update('agent', key, JSON.stringify(agent))
        .pipe(

        );
    }

    addAgent(agent: Agent): Observable<Agent> {
        return this.dataService.add('agent', JSON.stringify(agent))
        .pipe(

        );
    }

}
