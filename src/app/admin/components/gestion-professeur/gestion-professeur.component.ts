import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ProfesseurModel } from 'src/app/shared/models/professeur.model';

@Component({
  selector: 'app-gestion-professeur',
  templateUrl: './gestion-professeur.component.html',
  styleUrls: ['./gestion-professeur.component.scss']
})
export class GestionProfesseurComponent {
  @ViewChild('nav') nav: any;
  active = 2;

  professeurEdit!: ProfesseurModel;
  professeur!: ProfesseurModel;
  typeHonoraire!: string;

  onEdit(professeur: ProfesseurModel) {
    this.professeurEdit = professeur;
    this.nav.select(1);
  }

  onEditDone(professeur: ProfesseurModel) {
    this.professeurEdit = new ProfesseurModel();
  }

  onShowHonoraire(event: any) {
    this.professeur = event.professeur;
    this.typeHonoraire = event.typeHonoraire;
    if (this.typeHonoraire === 'encours') {
      this.nav.select(3);
    } else {
      this.nav.select(4);
    }
  }

  onNavChange(event: any) {
    if (event.nextId === 2) {
      this.typeHonoraire = '';
      this.professeur = new ProfesseurModel();
    }
  }
}
