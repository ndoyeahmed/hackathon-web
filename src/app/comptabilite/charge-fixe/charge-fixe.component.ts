import { TypeChargeModel } from '../../shared/models/type-charge.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChargeFixeModel } from 'src/app/shared/models/charge-fixe.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ComptabiliteService } from '../services/comptabilite.service';
import {PdfService} from "../../shared/services/pdf.service";

@Component({
  selector: 'app-charge-fixe',
  templateUrl: './charge-fixe.component.html',
  styleUrls: ['./charge-fixe.component.scss']
})
export class ChargeFixeComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  chargeFixeForm!: FormGroup;
  typeChargeForm!: FormGroup;
  chargeFixeEdit!: any;
  typeChargeEdit!: any;
  chargeFixes: ChargeFixeModel[] = [];
  typeCharges: TypeChargeModel[] = [];
  isAdd = false;
  total = 0;
  page!: number;
  pageSize = 5;
  totalPage!: number;
  totalItems!: number;
  searchTerm = '';

  onAddTypeCharge = false;

  constructor(
    private comptabiliteService: ComptabiliteService,
    private alerteService: AlertService,
    private pdfService: PdfService
    ) {}

  ngOnInit(): void {
    this.getAllTypeChargeFixe();
    this.initAddForm();
    this.initAddTypeForm();
    this.getAllChargeFixe(this.page);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe())
  }

  initAddForm() {
    this.chargeFixeForm = new FormGroup({
      'typeChargeFixe': new FormControl(0, Validators.required),
      'montant': new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  initEditForm(charge: ChargeFixeModel) {
    this.chargeFixeForm = new FormGroup({
      'typeChargeFixe': new FormControl(charge.typeChargeFixe.id, Validators.required),
      'montant': new FormControl(charge.montant, [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  initAddTypeForm() {
    this.typeChargeForm = new FormGroup({
      'libelle': new FormControl(null, Validators.required)
    });
  }

  initEditTypeForm(charge: string) {
    this.typeChargeForm = new FormGroup({
      'libelle': new FormControl(charge, Validators.required)
    });
  }

  getAllChargeFixe(page = 0) {
    this.subscriptions.push(
      this.comptabiliteService.getAllChargefixePerPage(page, this.pageSize).subscribe(
        (data: any) => {
          this.chargeFixes = data.results;
          this.page = data.currentPage + 1;
          this.totalPage = data.totalPages;
          this.totalItems = data.totalItems;
          this.total = this.chargeFixes.reduce((acc, item) => acc + item.montant, 0)
        }, (error) => console.log(error)
      )
    );
  }

  getAllTypeChargeFixe() {
    this.subscriptions.push(
      this.comptabiliteService.getAllTypeChargefixe().subscribe(
        (data: any) => {
          this.typeCharges = data;
        }, (error) => console.log(error)
      )
    );
  }

  onPageChange(event: any) {
    this.page = event - 1;
    this.getAllChargeFixe(this.page);
  }

  save() {
    if (this.chargeFixeForm.valid) {
      const charge = new ChargeFixeModel();
      const typeCharge = new TypeChargeModel();
      typeCharge.id = Number(this.chargeFixeForm.controls['typeChargeFixe'].value);
      charge.montant = this.chargeFixeForm.controls['montant'].value;
      charge.typeChargeFixe = typeCharge;
      this.subscriptions.push(
        this.comptabiliteService.saveChargeFixe(charge).subscribe(
          (data) => {
            this.alerteService.success('Enregistrer avec succès');
            this.chargeFixeForm.reset();
            this.page = this.page - 1;
            this.getAllChargeFixe(this.page);
          },
          (err) => {
            console.log(err);
            this.alerteService.error('Echec de l\'opération');
          }
        )
      );
    }
  }

  edit() {
    if (this.chargeFixeForm.valid && this.chargeFixeEdit && this.chargeFixeEdit.id) {
      const typeCharge = new TypeChargeModel();
      typeCharge.id = Number(this.chargeFixeForm.controls['typeChargeFixe'].value);
      this.chargeFixeEdit.montant = this.chargeFixeForm.controls['montant'].value;
      this.chargeFixeEdit.typeChargeFixe = typeCharge;
      this.subscriptions.push(
        this.comptabiliteService.saveChargeFixe(this.chargeFixeEdit).subscribe(
          (data) => {
            this.alerteService.success('Modifier avec succès');
            this.chargeFixeForm.reset();
            this.page = this.page - 1;
            this.getAllChargeFixe(this.page);
          },
          (err) => {
            console.log(err);
            this.alerteService.error('Echec de l\'opération');
          }
        )
      );
    }
  }

  cancel() {
    this.isAdd = false;
    this.onAddTypeCharge = false;
    this.chargeFixeForm.reset();
  }

  onEdit(charge: any) {
    this.chargeFixeEdit = charge;
    this.initEditForm(charge);
    this.isAdd = true;
  }

  onDelete(charge: any) {
    charge.deleteAction = true;
  }

  deleteCharge(charge: any) {
    charge.deleteAction = false;
    charge.archive = true;
    charge.archiveDepense = true;
    this.subscriptions.push(
      this.comptabiliteService.deleteChargeFixe(charge.id).subscribe(
        (data) => {
          this.alerteService.success('Charge supprimer avec succès');
          this.page = this.page - 1;
          this.getAllChargeFixe(this.page);
        }, (err) => this.alerteService.error('Echec de l\'opération')
      )
    );
  }

  cancelDeleteAction(charge: any) {
    charge.deleteAction = false;
  }

  downloadPDF() {
    this.subscriptions.push(
        this.comptabiliteService.getAllChargefixe().subscribe(
            (data: any) => {
              const columns: any[] = ['Charge', 'Montant', 'Date'];
              const charges = data as ChargeFixeModel[];
              const pdfData = charges.map(charge => (
                  {Charge: charge.typeChargeFixe.libelle, Montant: charge.montant, Date: this.pdfService.formatDate(charge.date)}
              ));
              this.pdfService.generateTable('download', pdfData, columns, 'Liste des Charges fixes');
            }, (error) => console.log(error)
        )
    );
  }

  saveType() {
    if (this.typeChargeForm.valid) {
      const typeCharge = new TypeChargeModel();
      typeCharge.libelle = this.typeChargeForm.controls['libelle'].value;
      this.subscriptions.push(
        this.comptabiliteService.saveTypeChargeFixe(typeCharge).subscribe(
          (data) => {
            this.alerteService.success('Enregistrer avec succès');
            this.cancelType();
            this.page = this.page - 1;
            this.getAllTypeChargeFixe();
            this.getAllChargeFixe(this.page);
          },
          (err) => {
            console.log(err);
            this.alerteService.error('Echec de l\'opération');
          }
        )
      );
    }
  }
  editType() {
    if (this.typeChargeForm.valid && this.typeChargeEdit && this.typeChargeEdit.id) {
      this.typeChargeEdit.libelle = this.typeChargeForm.controls['libelle'].value;
      this.subscriptions.push(
        this.comptabiliteService.saveTypeChargeFixe(this.typeChargeEdit).subscribe(
          (data) => {
            this.alerteService.success('Modifier avec succès');
            this.cancelType();
            this.page = this.page - 1;
            this.getAllTypeChargeFixe();
            this.getAllChargeFixe(this.page);
          },
          (err) => {
            console.log(err);
            this.alerteService.error('Echec de l\'opération');
          }
        )
      );
    }
  }
  cancelType() {
    this.isAdd = true;
    this.onAddTypeCharge = false;
    this.typeChargeForm.reset();
  }
}
