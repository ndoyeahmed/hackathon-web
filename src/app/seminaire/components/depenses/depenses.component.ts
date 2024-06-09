import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PlanningFormationModel } from 'src/app/shared/models/planning-formation.model';
import { SeminaireService } from '../../services/seminaire.service';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DepenseDTO } from 'src/app/shared/models/depense-dto';
import { PlanningDtoModel } from 'src/app/shared/models/planning-dto.model';

@Component({
  selector: 'app-depenses',
  templateUrl: './depenses.component.html',
  styleUrls: ['./depenses.component.scss']
})
export class DepensesComponent implements OnInit, OnDestroy {

  @Input() planning!: PlanningDtoModel;
  depenseForm!: FormGroup;
  subscriptions: Subscription[] = [];
  mouvementsDepense: DepenseDTO[] = [];
  totalDepense = 0;
  depenseEdit!: DepenseDTO;
  isAdd = false;
  searchTerm = '';

  constructor(
    private seminaireService: SeminaireService,
    private alerteService: AlertService
    ) {}

  ngOnInit(): void {
    this.getAllMouvementDepensesByPlanningId();
    this.initAddForm();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe())
  }

  getAllMouvementDepensesByPlanningId() {
    this.subscriptions.push(
      this.seminaireService.getAllMouvementDepensesByPlanningFormationID(this.planning.id).subscribe(
        (data: any) => {
          this.mouvementsDepense = data;
          this.totalDepense = this.mouvementsDepense.reduce((sum, data) => sum + data.montant, 0);
        }, (error: any) => this.alerteService.error('Erreur lors du chargement des données')
      )
    );
  }

  initAddForm() {
    this.depenseForm = new FormGroup({
      'libelle': new FormControl(null, Validators.required),
      'montant': new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  initEditForm(depenseDTO: DepenseDTO) {
    this.depenseForm = new FormGroup({
      'libelle': new FormControl(depenseDTO.libelleDepense, Validators.required),
      'montant': new FormControl(depenseDTO.montant, [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  saveDepense() {
    if (this.depenseForm.valid) {
      const depenseDTO = new DepenseDTO();
      depenseDTO.archive = false;
      depenseDTO.archiveDepense = false;
      depenseDTO.libelleDepense = this.depenseForm.controls['libelle'].value;
      depenseDTO.montant = Number(this.depenseForm.controls['montant'].value);
      depenseDTO.planningID = this.planning.id;

      this.subscriptions.push(
        this.seminaireService.addMouvementDepense(depenseDTO).subscribe(
          (data) => {
            this.alerteService.success('Dépense enregistrer avec succès');
            this.depenseForm.reset();
            this.getAllMouvementDepensesByPlanningId();
            this.isAdd = false;
          }, (err) => this.alerteService.error('Echec de l\'opération')
        )
      );
    }
  }

  editDepense() {
    if (this.depenseForm.valid && this.depenseEdit && this.depenseEdit.id) {
      this.depenseEdit.libelleDepense = this.depenseForm.controls['libelle'].value;
      this.depenseEdit.montant = Number(this.depenseForm.controls['montant'].value);
      this.subscriptions.push(
        this.seminaireService.editMouvementDepense(this.depenseEdit).subscribe(
          (data) => {
            this.alerteService.success('Dépense enregistrer avec succès');
            this.depenseForm.reset();
            this.getAllMouvementDepensesByPlanningId();
            this.isAdd = false;
          }, (err) => this.alerteService.error('Echec de l\'opération')
        )
      );
    }
  }

  cancel() {
    this.isAdd = false;
    this.depenseForm.reset();
  }

  onEdit(depenseDTO: DepenseDTO) {
    this.depenseEdit = depenseDTO;
    this.initEditForm(depenseDTO);
    this.isAdd = true;
  }

  onDelete(depenseDTO: DepenseDTO) {
    depenseDTO.deleteAction = true;
  }

  deleteDepense(depenseDTO: DepenseDTO) {
    depenseDTO.deleteAction = false;
    depenseDTO.archive = true;
    depenseDTO.archiveDepense = true;
    this.subscriptions.push(
      this.seminaireService.editMouvementDepense(depenseDTO).subscribe(
        (data) => {
          this.alerteService.success('Dépense supprimer avec succès');
          this.depenseForm.reset();
          this.getAllMouvementDepensesByPlanningId();
        }, (err) => this.alerteService.error('Echec de l\'opération')
      )
    );
  }

  cancelDeleteAction(depenseDTO: DepenseDTO) {
    depenseDTO.deleteAction = false;
  }
}
