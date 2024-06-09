import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PaiementModel } from 'src/app/shared/models/paiement.model';
import { ReglementModel } from 'src/app/shared/models/reglement.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { SeminaireService } from '../../services/seminaire.service';

@Component({
  selector: 'app-reglement',
  templateUrl: './reglement.component.html',
  styleUrls: ['./reglement.component.scss']
})
export class ReglementComponent implements OnInit, OnDestroy {
  isAdd = false;
  reglements!: ReglementModel[];
  @Input() paiement!: PaiementModel;
  @Output() onAdd: EventEmitter<boolean> = new EventEmitter<boolean>();
  reglementForm!: FormGroup;
  reglementEdit!: ReglementModel;
  subscriptions: Subscription[] = [];

  page = 0;
  pageSize = 5;
  totalPage!: number;
  totalItems!: number;
  searchTerm = '';

  constructor(
    private seminaireService: SeminaireService,
    private alerteService: AlertService
  ) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
  ngOnInit(): void {
    this.getAllReglementByPaiement(this.paiement);
    this.initAddForm();
  }

  getAllReglementByPaiement(paiement: PaiementModel) {
    this.subscriptions.push(
      this.seminaireService.getAllReglementByPaiementID(paiement.id, this.page, this.pageSize).subscribe({
        next: (data: any) => {
          this.reglements = data.results;
            this.page = data.currentPage + 1;
            this.totalPage = data.totalPages;
            this.totalItems = data.totalItems;
        }
      })
    );
  }

  initAddForm() {
    this.reglementForm = new FormGroup({
      'montant': new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  initEditForm(reglement: ReglementModel) {
    this.reglementForm = new FormGroup({
      'montant': new FormControl(reglement.montant, [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  onEdit(reglement: ReglementModel) {
    this.reglementEdit = reglement;
    this.isAdd = true;
    this.initEditForm(reglement);
  }

  onDelete(reglement: ReglementModel) {
    reglement.deleteAction = true;
  }

  cancelDeleteAction(reglement: ReglementModel) {
    reglement.deleteAction = false;
  }

  deleteReglement(reglement: ReglementModel) {
    reglement.deleteAction = false;
    this.subscriptions.push(
      this.seminaireService.deleteReglement(reglement.id).subscribe(
        (data) => {
          this.alerteService.success('Réglement supprimer avec succés');
          this.onAdd.emit(true)
          this.cancel();
          this.page = 0;
          this.getAllReglementByPaiement(this.paiement);
        }
      )
    );
  }

  edit() {
    if (this.reglementForm.valid && this.reglementEdit && this.reglementEdit.id) {
      this.reglementEdit.montant = Number(this.reglementForm.controls['montant'].value);
      this.reglementEdit.paiement = this.paiement;
      this.subscriptions.push(
        this.seminaireService.updateReglement(this.reglementEdit).subscribe(
          (data: any) => {
            this.alerteService.success('Réglement mis à jour avec succés');
            this.onAdd.emit(true)
            this.cancel();
            this.page = 0;
            this.getAllReglementByPaiement(this.paiement);
          }, (err) => this.alerteService.error('Echec de l\'opération')
        )
      );
    }
  }

  save() {
    if (this.reglementForm.valid) {
      const reglement = new ReglementModel();
      reglement.montant = Number(this.reglementForm.controls['montant'].value);
      reglement.paiement = this.paiement;
      this.subscriptions.push(
        this.seminaireService.addReglement(reglement).subscribe(
          (data: any) => {
            this.alerteService.success('Réglement enregistrer avec succés');
            this.onAdd.emit(true)
            this.cancel();
            this.page = 0;
            this.getAllReglementByPaiement(this.paiement);
          }, (err) => {
            if (err && err.error && err.error.message && err.error.message ==='montant_superieur_montant_total') {
              this.alerteService.error('Montant supérieur au montant total. Saisir un montant inférieur ou égal au total');
            } else {
              this.alerteService.error('Echec de l\'opération');
            }
          }
        )
      );
    }
  }

  cancel() {
    this.reglementForm.reset();
    this.reglementEdit = new ReglementModel();
    this.isAdd = false;
  }

  onPageChange(event: any) {
    this.page = Number(event-1);
    this.getAllReglementByPaiement(this.paiement);
  }
}
