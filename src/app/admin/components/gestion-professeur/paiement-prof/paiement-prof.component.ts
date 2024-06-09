import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/admin/services/admin.service';
import { FormationProfesseurModel } from 'src/app/shared/models/formation-professeur.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import {PdfService} from "../../../../shared/services/pdf.service";
import * as moment from "moment/moment";

@Component({
  selector: 'app-paiement-prof',
  templateUrl: './paiement-prof.component.html',
  styleUrls: ['./paiement-prof.component.scss']
})
export class PaiementProfComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  paiementForm!: FormGroup;
  paiementEdit!: FormationProfesseurModel;
  @Input() formationProf!: FormationProfesseurModel;
  @Output() onSavePaiement: EventEmitter<any> = new EventEmitter();
  reglements: any[] = [];

  constructor(
    private alerteService: AlertService,
    private adminService: AdminService,
    private pdfService: PdfService
    ) {}

    ngOnInit(): void {
      this.initAddForm();
    }
    ngOnDestroy(): void {
      this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe())
    }

    initAddForm() {
      this.paiementForm = new FormGroup({
        'brs': new FormControl(this.formationProf?.brs, [Validators.required, Validators.pattern("^[0-9]*$")]),
        'honoraireBrut': new FormControl({value: this.formationProf?.honoraireBrut, disabled: true}, [Validators.required, Validators.pattern("^[0-9]*$")]),
        'honoraireNet': new FormControl({value: this.formationProf?.honoraireNet, disabled: true}, [Validators.required, Validators.pattern("^[0-9]*$")]),
        'nombreHeure': new FormControl(this.formationProf?.nombreHeure, [Validators.required, Validators.pattern("^[0-9]*$")]),
        'montantHeure': new FormControl(this.formationProf?.montantHeure, [Validators.required, Validators.pattern("^[0-9]*$")]),
        'avance': new FormControl({value: this.formationProf?.avance, disabled: true}),
        'totalPayer': new FormControl(null),
        'restant': new FormControl({value: this.formationProf?.restant, disabled: true})
      });
    }

    edit() {}

    save() {
      if (this.paiementForm.valid) {
        const formationProfesseur = {
          id: this.formationProf.id,
          brs: Number(this.paiementForm.controls['brs'].value),
          honoraireBrut: Number(this.paiementForm.controls['honoraireBrut'].value),
          honoraireNet: Number(this.paiementForm.controls['honoraireNet'].value),
          montantHeure: Number(this.paiementForm.controls['montantHeure'].value),
          nombreHeure: Number(this.paiementForm.controls['nombreHeure'].value),
          avance: Number(this.paiementForm.controls['totalPayer'].value),
          restant: Number(this.paiementForm.controls['restant'].value),
          montant: Number(this.paiementForm.controls['totalPayer'].value),
          planningFormation: this.formationProf.planningFormation.id
        };

        let mypdfData = new FormationProfesseurModel();

        this.subscriptions.push(
          this.adminService.updateFormationProfesseur(this.formationProf?.id, formationProfesseur).subscribe(
            (data) => {
              this.alerteService.success('Paiement enregistrer avec succès');

              mypdfData = data as FormationProfesseurModel;

              this.paiementForm.reset();
              this.onSavePaiement.emit(true);
            }, (error) => this.alerteService.error('Echec de l\'opération'),
            () => {
              this.getAllReglementHonoraireByFormationProf(mypdfData.id, mypdfData);
            }
          )
        );
      }
    }

  formatDate(date: any) {
    return moment(date).format('DD/MM/YYYY');
  }

  getAllReglementHonoraireByFormationProf(formationProfId: number, myPdfData: FormationProfesseurModel) {
    this.subscriptions.push(
      this.adminService.getAllReglementHonoraireByFormationProf(formationProfId).subscribe({
        next: (data: any) => {
          this.reglements = data;
        },
        error: () => {},
        complete: () => {
          const columns: any[] = ['Date', 'Montant'];
          const pdfData = this.reglements.map((reglement: any) => (
            {
              Date: this.formatDate(reglement.date),
              Montant: reglement.montant
            }
          ));
          this.pdfService.generateRecu(myPdfData, pdfData, columns);
        }
      })
    );
  }

    cancel() {
      this.paiementForm.reset();
    }

    onChangeMontantHeureValue(event: any) {
      this.paiementForm.controls['montantHeure'].setValue(event.target.value);
      this.onCalculateHonoraire();
    }

    onChangeNombreHeureValue(event: any) {
      this.paiementForm.controls['nombreHeure'].setValue(event.target.value);
      this.onCalculateHonoraire();
    }

    onChangeBRSValue(event: any) {
      this.paiementForm.controls['brs'].setValue(event.target.value);
      this.onCalculateHonoraire();
    }

    onCalculateHonoraire() {
      if (this.paiementForm?.controls['nombreHeure']?.value && this.paiementForm?.controls['montantHeure']?.value) {
        this.paiementForm.controls['honoraireBrut'].setValue(
          Number(this.paiementForm.controls['nombreHeure'].value) * Number(this.paiementForm.controls['montantHeure'].value)
        );
      }

      if (this.paiementForm?.controls['honoraireBrut']?.value && this.paiementForm?.controls['brs']?.value) {
        this.paiementForm.controls['honoraireNet'].setValue(
          Number(this.paiementForm.controls['honoraireBrut'].value) - (
            (Number(this.paiementForm.controls['honoraireBrut'].value) * Number(this.paiementForm.controls['brs'].value)) / 100
            )
        );
        if (
          this.paiementForm?.controls['totalPayer']?.value
          && Number(this.paiementForm.controls['totalPayer'].value) <=
          Number(this.paiementForm.controls['honoraireNet'].value)
        ) {
          this.paiementForm.controls['restant'].setValue(
            Number(this.paiementForm.controls['honoraireNet'].value) -
            Number(this.paiementForm.controls['totalPayer'].value)
          );
        }
      }
    }

    onCalculateRestant(event: any) {
      this.paiementForm.controls['totalPayer'].setValue(event.target.value);
      if (this.paiementForm?.controls['honoraireNet']?.value) {
        if (
          this.paiementForm?.controls['totalPayer']?.value
          && (Number(this.paiementForm.controls['totalPayer'].value)
              +
              Number(this.paiementForm.controls['avance'].value)
          ) <=
          Number(this.paiementForm.controls['honoraireNet'].value)
        ) {
          this.paiementForm.controls['restant'].setValue(
            Number(this.paiementForm.controls['honoraireNet'].value) -
            (Number(this.paiementForm.controls['totalPayer'].value)
              +
              Number(this.paiementForm.controls['avance'].value)
          )
          );
        } else {
          this.alerteService.error('Le montant saisi est incorrect');
          this.paiementForm.controls['restant'].setValue(this.formationProf.restant);
        }
      } else {
        this.paiementForm.controls['restant'].setValue(this.formationProf.restant);
      }
    }

}
