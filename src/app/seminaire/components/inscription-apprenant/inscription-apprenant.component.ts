import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ParametragesService } from '../../services/parametrages.service';
import { SeminaireService } from '../../services/seminaire.service';
import { PlanningFormationModel } from 'src/app/shared/models/planning-formation.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-inscription-apprenant',
  templateUrl: './inscription-apprenant.component.html',
  styleUrls: ['./inscription-apprenant.component.scss']
})
export class InscriptionApprenantComponent implements OnInit, OnDestroy {
  inscriptionForm!: FormGroup;
  subscriptions: Subscription[] = [];
  planning!: PlanningFormationModel;
  avance = 0;
  inscriptionEdit: any;
  selectedTypeInscription = '';

  constructor(
    private seminaireService: SeminaireService,
    private alertService: AlertService,
    private _activatedRoute: ActivatedRoute,
    private _route: Router
    ) {
      this.initAddForm();
    }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    const planningID = Number(this._activatedRoute.snapshot.params['planningID']);
    const apprenantID = Number(this._activatedRoute.snapshot.params['apprenantID']);
    if (planningID) {
      this.getPlanningById(planningID);
    } else {
      if (apprenantID) {
        this.getApprenantByID(apprenantID);
      } else {
        this._route.navigate(['/formation/inscription']);
      }
    }

  }

  getApprenantByID(apprenantID: number) {
    this.subscriptions.push(
      this.seminaireService.getApprenantInscriptionByID(apprenantID).subscribe(
        (data: any) => {
          this.inscriptionEdit = data;
          this.getPlanningById(this.inscriptionEdit.planningID);
          this.initEditForm(this.inscriptionEdit);
        }, (error) => this.alertService.error('inscription apprenant introuvable')
      )
    );
  }

  getPlanningById(planningID: number) {
    this.subscriptions.push(
      this.seminaireService.getPlanningByID(planningID).subscribe(
        (data: any) => this.planning = data as PlanningFormationModel,
        (error) => this._route.navigate(['/formation/inscription']),
        () => {
          this.inscriptionForm.controls['reliquat'].setValue(this.getReliquat(this.planning.cout, this.avance));
        }
      )
    );
  }

  getReliquat(total: number, montant: number) {
    return total - montant;
  }

  initAddForm() {
    this.inscriptionForm = new FormGroup({
      'nom': new FormControl(null),
      'prenom': new FormControl(null, Validators.required),
      'email': new FormControl(null, Validators.required),
      'telephone': new FormControl(null, Validators.required),
      'typeInscription': new FormControl(this.selectedTypeInscription, Validators.required),
      'avance': new FormControl(0, [Validators.required, Validators.pattern("^[0-9]*$")]),
      'reliquat': new FormControl({value: null, disabled: true})
    });
  }

  initEditForm(inscription: any) {
    this.selectedTypeInscription = inscription.typeInscription
    this.inscriptionForm = new FormGroup({
      'nom': new FormControl(inscription.nom),
      'prenom': new FormControl(inscription.prenom, Validators.required),
      'email': new FormControl(inscription.email, Validators.required),
      'telephone': new FormControl(inscription.telephone, Validators.required),
      'typeInscription': new FormControl(this.selectedTypeInscription, Validators.required),
      'avance': new FormControl({value: inscription.avance, disabled: true}, [Validators.required, Validators.pattern("^[0-9]*$")]),
      'reliquat': new FormControl({value: inscription.reliquat, disabled: true})
    });
  }

  onChangeAvance(event: any) {
    if (event && event.target && event.target.valueAsNumber) {
      this.avance = event.target.valueAsNumber;
      this.inscriptionForm.controls['reliquat'].setValue(this.getReliquat(this.planning.cout, this.avance));
    } else{
      this.inscriptionForm.controls['reliquat'].setValue(this.getReliquat(this.planning.cout, 0));
    }
  }

  saveInscription() {
    if (this.inscriptionForm.valid) {
      const inscription = {
        nom: this.inscriptionForm.controls['nom'].value,
        prenom: this.inscriptionForm.controls['prenom'].value,
        email: this.inscriptionForm.controls['email'].value,
        telephone: this.inscriptionForm.controls['telephone'].value,
        typeInscription: this.inscriptionForm.controls['typeInscription'].value,
        avance: Number(this.inscriptionForm.controls['avance'].value),
        reliquat: Number(this.inscriptionForm.controls['reliquat'].value),
        planningID: this.planning.id
      }
      this.subscriptions.push(
        this.seminaireService.addInscription(inscription).subscribe(
          (response: any) => {
            this.clear();
            this.alertService.success('Inscrit avec succès');
            // setTimeout(() => {this.goToListInscris();}, 1200);
          }, (error: any) => {
            this.alertService.error('Echec de l\'opération');
          }
        )
      );
    }
  }

  updateInscription() {
    if (this.inscriptionForm.valid && this.inscriptionEdit && this.inscriptionEdit.id) {
      const inscription = {
        id: this.inscriptionEdit.id,
        nom: this.inscriptionForm.controls['nom'].value,
        prenom: this.inscriptionForm.controls['prenom'].value,
        email: this.inscriptionForm.controls['email'].value,
        telephone: this.inscriptionForm.controls['telephone'].value,
        typeInscription: this.inscriptionForm.controls['typeInscription'].value,
        avance: Number(this.inscriptionForm.controls['avance'].value),
        reliquat: Number(this.inscriptionForm.controls['reliquat'].value),
        planningID: this.planning.id
      }
      this.subscriptions.push(
        this.seminaireService.updateInscription(inscription).subscribe(
          (response: any) => {
            this.clear();
            this.alertService.success('Inscription mis à jour avec succès');
            // setTimeout(() => {this.goToListInscris();}, 1200);
          }, (error: any) => {
            this.alertService.error('Echec de l\'opération');
          }
        )
      );
    }
  }

  clear() {
    this.inscriptionForm.reset();
  }

  goToListInscris() {
    this._route.navigate(['/formation/apprenants/list/', this.planning.id]);
  }
}
