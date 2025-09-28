import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {AccueilComponent} from './components/accueil/accueil.component';
import {ListeClientsComponent} from './components/Clients/liste-clients/liste-clients.component';
import {ProfilComponent} from './components/profil/profil.component';
import {ListeReservationsComponent} from './components/reservation/liste-reservations/liste-reservations.component';
import {UpdateClientsComponent} from './components/Clients/update-clients/update-clients.component';
import {UnauthorizedComponent} from './components/unauthorized/unauthorized.component';
import {DetailClientsComponent} from './components/Clients/detail-clients/detail-clients.component';
import {DetailReservationComponent} from './components/reservation/detail-reservation/detail-reservation.component';
import {RetraitVoitureComponent} from './components/Retraits/retrait-voiture/retrait-voiture.component';
import {RetourComponent} from './components/Retours/retour-voiture/retour.component';
import {UpdateReservationComponent} from './components/reservation/update-reservation/update-reservation.component';
import {ListeAgenceComponent} from './components/agences/liste-agence/liste-agence.component';
import {ListeVoituresComponent} from './components/voitures/liste-voitures/liste-voitures.component';
import {
  CreationReservationComponent
} from './components/reservation/creation-reservation/creation-reservation.component';
import {ContactComponent} from './components/contact/contact.component';
import {DetailVoitureComponent} from './components/voitures/detail-voiture/detail-voiture.component';
import {UpdateVoitureComponent} from './components/voitures/update-voiture/update-voiture.component';
import {AProposComponent} from './components/aPropos/a-propos/a-propos.component';
import {SearchComponent} from './components/search/search.component';

export const routes: Routes = [
  {path: '', redirectTo: '/accueil', pathMatch: 'full' },
  {path: 'accueil', component: AccueilComponent},
  {path: 'login',component: LoginComponent},
  {path: 'register', component: RegisterComponent },
  {path: 'logout' , component: AccueilComponent},
  {path: 'profil' , component: ProfilComponent},
  {path: 'listeClient', component: ListeClientsComponent},
  {path: 'listeReservation', component: ListeReservationsComponent},
  {path: 'listeReservation/:id', component: DetailReservationComponent},
  {path: 'update-client/:id', component: UpdateClientsComponent},
  {path: 'detail-client/:id', component: DetailClientsComponent},
  {path: 'retrait-voiture/:id', component: RetraitVoitureComponent},
  {path: 'retour-voiture/:id', component: RetourComponent},
  {path: 'update-reservation/:id', component: UpdateReservationComponent},
  {path: 'listeAgence' , component: ListeAgenceComponent},
  {path: 'listeVoituresAgence/:id', component: ListeVoituresComponent },
  {path: 'voitures/marque/:marque', component: SearchComponent },
  {path: 'createReservation', component: CreationReservationComponent},
  {path: 'detail-voiture/:id', component: DetailVoitureComponent},
  {path: 'unauthorized', component: UnauthorizedComponent },
  {path: 'update-voiture/:id', component: UpdateVoitureComponent},
  {path: 'a-propos' , component: AProposComponent},
  {path: 'contact', component: ContactComponent },
  {path: '**', redirectTo: '/unauthorized'},
];
