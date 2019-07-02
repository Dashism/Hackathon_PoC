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


@Component({
  selector: 'app-help',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    faqsFiltered = [
        {
            'question': 'Comment puis-je utiliser le marché des compétences ?',
            'answer': 'Pour commencer il faut vous enregistrer.'
        },
        {
            'question': 'Comment enregistrer mon profil ?',
            'answer': 'Allez dans le menu ENREGISTRER et rentrez toutes vos informations. A la fin cliquez sur Soumettre.'
        },
        {
            'question': 'Comment rentrer dans mon profil',
            'answer': 'Allez dans le menu SE CONNECTER puis rentrez votre nom utilisateur et votre mot de passe puis cliquez sur Soumettre.'
        },
        {
            'question': 'Comment modifier mes informations personnelles ?',
            'answer': 'Dans la section profil, modifiez vos informations situées sur la partie gauche, puis cliquez sur Enregistrer.'
        },
        {
            'question': 'Comment modifier mes informations Blockchain ?',
            'answer': 'Dans la section profil, modifiez vos informations situées sur la partie droite, puis cliquez sur Enregistrer.'
        },
        {
            'question': 'Comment savoir si les informations sont bien enregistrées ?',
            'answer': 'Un message rouge est situé en haut de la page sous le titre pour indiquer si tout se passe correctement.'
        },
        {
            'question': 'Comment créer un projet ?',
            'answer': 'Dans la section projet, remplissez les informations, puis cliquez sur le bouton validation.'
        },
        {
            'question': 'Comment soumettre un projet ?',
            'answer': 'Après avoir cliqué sur validation, la blockchain vérifie si toutes les conditions au déroulement de votre projet sont présentes.'
        },
        {
            'question': 'Comment soumettre un projet après vérification de la Blockchain ?',
            'answer': 'Si le bouton passe au bleu, il faut recliquer sur le bouton pour soumettre le projet, si le bouton est rouge recliquer pour recommencer une tentative de recherche.'
        },
        {
            'question': 'Comment puis-je savoir si mon projet a bien été enregistré ?',
            'answer': 'Si le message en dessous du titre passe au vert tout est validé.'
        },
        {
            'question': 'Comment puis-je suivre mes projets ?',
            'answer': 'Que vous soyez créateur ou participant, il vous suffit de cliquer sur la section SUIVI.'
        },
        {
            'question': ' Comment obtenir les contacts des différents participants ?',
            'answer': 'Que vous soyez créateur ou participant, dans la section SUIVI cliquez sur le bouton au dessous de Projets créés ou Projets participés.'
        },
        {
            'question': 'Comment noter les participants ?',
            'answer': 'A la fin du projet un onglet vous conduit automatiquement sur la page de notation à votre prochaine connexion.'
        },
        {
            'question': 'Comment me déconnecter ?',
            'answer': 'Cliquez sur SE DECONNECTER.'
        }
        ];

    constructor(private authenticationService: AuthenticationService) {
        this.openMenu();
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    openMenu(){
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
}
