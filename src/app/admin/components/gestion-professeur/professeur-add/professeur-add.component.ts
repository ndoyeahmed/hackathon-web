import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/admin/services/admin.service';
import { ProfesseurModel } from 'src/app/shared/models/professeur.model';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-professeur-add',
  templateUrl: './professeur-add.component.html',
  styleUrls: ['./professeur-add.component.scss']
})
export class ProfesseurAddComponent implements OnInit, OnDestroy {
  professeurForm!: FormGroup;
  subscriptions: Subscription[] = [];
  @Input() professeurEdit!: ProfesseurModel;
  @Output() onEditDone: EventEmitter<ProfesseurModel> = new EventEmitter();
  constructor(
    private adminService: AdminService,
    private alertService: AlertService
  ) {
    this.initAddForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    if (this.professeurEdit && this.professeurEdit.id) {
      this.initEditForm(this.professeurEdit);
    }
  }

  initAddForm() {
    this.professeurForm = new FormGroup({
      'nom': new FormControl(null, [Validators.required]),
      'prenom': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required]),
      'telephone': new FormControl(null, [Validators.required])
    });
  }

  initEditForm(professeur: ProfesseurModel) {
    this.professeurForm = new FormGroup({
      'nom': new FormControl(professeur.nom, [Validators.required]),
      'prenom': new FormControl(professeur.prenom, [Validators.required]),
      'email': new FormControl(professeur.email, [Validators.required]),
      'telephone': new FormControl(professeur.telephone, [Validators.required])
    });
  }

  save() {
    if (this.professeurForm.valid) {
      const professeur = new ProfesseurModel();
      professeur.nom = this.professeurForm.controls['nom'].value;
      professeur.prenom = this.professeurForm.controls['prenom'].value;
      professeur.email = this.professeurForm.controls['email'].value;
      professeur.telephone = this.professeurForm.controls['telephone'].value;

      this.subscriptions.push(
        this.adminService.addProfesseur(professeur).subscribe(
          (data: any) => {
            this.alertService.success('professeur enregistrer avec succès')
            this.cancel();
          }, (err) => this.alertService.error('Echec de l\'opération')
        )
      );
    }
  }

  edit() {
    if (this.professeurEdit && this.professeurEdit.id && this.professeurForm.valid) {
      this.professeurEdit.nom = this.professeurForm.controls['nom'].value;
      this.professeurEdit.prenom = this.professeurForm.controls['prenom'].value;
      this.professeurEdit.email = this.professeurForm.controls['email'].value;
      this.professeurEdit.telephone = this.professeurForm.controls['telephone'].value;
      this.subscriptions.push(
        this.adminService.updateProfesseur(this.professeurEdit).subscribe(
          (data: any) => {
            this.alertService.success('professeur mis à jour avec succès')
            this.cancel();
            this.professeurEdit = new ProfesseurModel();
            this.onEditDone.emit(this.professeurEdit);
          }, (err) => this.alertService.error('Echec de l\'opération')
        )
      );
    }
  }

  cancel() {
    this.professeurForm.reset();
  }

}
