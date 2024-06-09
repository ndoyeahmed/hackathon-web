import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ProfesseurModel} from "../../../../shared/models/professeur.model";
import {AlertService} from "../../../../shared/services/alert.service";
import {RessourceHumaineService} from "../../../services/ressource-humaine.service";
import {EmployeResponseModel} from "../../../../shared/models/employe-response.model";

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent implements OnInit, OnDestroy {
  employeForm!: FormGroup;
  subscriptions: Subscription[] = [];
  @Input() employeEdit!: EmployeResponseModel;
  @Output() onEditDone: EventEmitter<any> = new EventEmitter();

  constructor(
    private alertService: AlertService,
    private resourceHumaineService: RessourceHumaineService
  ) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    if (this.employeEdit && this.employeEdit.id) {
      this.initEditForm(this.employeEdit);
    } else {
      this.initAddForm();
    }
  }

  initAddForm() {
    this.employeForm = new FormGroup({
      'nom': new FormControl(null, [Validators.required]),
      'prenom': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'telephone': new FormControl(null, [Validators.required]),
      'adresse': new FormControl(null, [Validators.required]),
      'dateDebut': new FormControl(null, [Validators.required]),
      'dateFin': new FormControl(null, [Validators.required]),
      'salaireBrut': new FormControl(null, [Validators.required]),
      'salaireNet': new FormControl({value: null, disabled: true}, [Validators.required]),
      'pourcentageRetenue': new FormControl({value: 5, disabled: true}, [Validators.required]),
      'retenue': new FormControl({value: null, disabled: true}, [Validators.required]),
      'transport': new FormControl(null, [Validators.required]),
      'prime': new FormControl(null, [Validators.required])
    });
  }

  initEditForm(employe: EmployeResponseModel) {
    this.employeForm = new FormGroup({
      'nom': new FormControl(employe.firstname, [Validators.required]),
      'prenom': new FormControl(employe.lastname, [Validators.required]),
      'email': new FormControl(employe.email, [Validators.required]),
      'telephone': new FormControl(employe.telephone, [Validators.required]),
      'adresse': new FormControl(employe.adresse, [Validators.required]),
      'dateDebut': new FormControl(employe.dateDebut, [Validators.required]),
      'dateFin': new FormControl(employe.dateFin, [Validators.required]),
      'salaireBrut': new FormControl(employe.salaireBrut, [Validators.required]),
      'salaireNet': new FormControl({value: employe.salaireNet, disabled: true}, [Validators.required]),
      'pourcentageRetenue': new FormControl({value: employe.pourcentageRetenue, disabled: true}, [Validators.required]),
      'retenue': new FormControl({value: employe.retenue, disabled: true}, [Validators.required]),
      'transport': new FormControl(employe.indemniteTransport, [Validators.required]),
      'prime': new FormControl(employe.prime, [Validators.required])
    });
  }

  save() {
    if (this.employeForm.valid) {
      const employe = {
        firstname: this.employeForm.controls['nom'].value,
        lastname: this.employeForm.controls['prenom'].value,
        email: this.employeForm.controls['email'].value,
        telephone: this.employeForm.controls['telephone'].value,
        adresse: this.employeForm.controls['adresse'].value,
        dateDebut: this.employeForm.controls['dateDebut'].value,
        dateFin: this.employeForm.controls['dateFin'].value,
        salaireBrut: this.employeForm.controls['salaireBrut'].value,
        salaireNet: this.employeForm.controls['salaireNet'].value,
        pourcentageRetenue: this.employeForm.controls['pourcentageRetenue'].value,
        retenue: this.employeForm.controls['retenue'].value,
        indemniteTransport: this.employeForm.controls['transport'].value,
        prime: this.employeForm.controls['prime'].value
      }
      this.subscriptions.push(
        this.resourceHumaineService.addEmploye(employe).subscribe(
          (data) => {
            this.alertService.success('Opération effectuée avec succès');
            this.employeForm.reset();
          }, (error) => this.alertService.error('Echec de l\'opération')
        )
      );
    } else {
      this.employeForm.markAllAsTouched();
    }
  }

  edit() {
    if (this.employeForm.valid && this.employeEdit && this.employeEdit.id) {
      const employe = {
        id: this.employeEdit.id,
        firstname: this.employeForm.controls['nom'].value,
        lastname: this.employeForm.controls['prenom'].value,
        email: this.employeForm.controls['email'].value,
        telephone: this.employeForm.controls['telephone'].value,
        adresse: this.employeForm.controls['adresse'].value,
        idContrat: this.employeEdit.idContrat,
        dateDebut: this.employeForm.controls['dateDebut'].value,
        dateFin: this.employeForm.controls['dateFin'].value,
        salaireBrut: this.employeForm.controls['salaireBrut'].value,
        salaireNet: this.employeForm.controls['salaireNet'].value,
        pourcentageRetenue: this.employeForm.controls['pourcentageRetenue'].value,
        retenue: this.employeForm.controls['retenue'].value,
        indemniteTransport: this.employeForm.controls['transport'].value,
        prime: this.employeForm.controls['prime'].value
      };
      this.subscriptions.push(
        this.resourceHumaineService.updateEmploye(employe, this.employeEdit.id).subscribe(
          (data) => {
            this.alertService.success('Opération effectuée avec succès');
            this.employeForm.reset();
          }, (error) => this.alertService.error('Echec de l\'opération')
        )
      );
    } else {
      this.employeForm.markAllAsTouched();
    }
  }

  calculateRetenue() {
    // retenu = salaireBrut + indemnitetransport - (5% salaireBrut)
    const salaireBrut = Number(this.employeForm.controls['salaireBrut'].value);
    const indemniteTransport = Number(this.employeForm.controls['transport'].value);
    const pourcentageRetenue = Number(this.employeForm.controls['pourcentageRetenue'].value);
    if (salaireBrut && pourcentageRetenue && indemniteTransport) {
      const retenu = (salaireBrut + indemniteTransport) - ((pourcentageRetenue*(salaireBrut + indemniteTransport))/100);
      this.employeForm.controls['salaireNet'].setValue(retenu);
      this.employeForm.controls['retenue'].setValue(((pourcentageRetenue*(salaireBrut + indemniteTransport))/100));
    } else {
      this.employeForm.controls['retenue'].setValue(null);
    }
  }

  calculateSalaireNet() {
    const salaireNet = Number(this.employeForm.controls['salaireNet'].value);
    const prime = Number(this.employeForm.controls['prime'].value);
    if (prime && salaireNet) {
      //const salaireNet = retenue + ((prime*retenue)/100);
      this.employeForm.controls['salaireNet'].setValue(salaireNet + prime);
    } else {
      this.employeForm.controls['salaireNet'].setValue(salaireNet);
    }
  }

  cancel() {
    this.employeForm.reset();
  }

  onShowRequiredMsgError(key: string) {
    const control = this.employeForm.controls[key];
    return control.touched && control.hasError('required');
  }
  onShowEmailMsgError(key: string) {
    const control = this.employeForm.controls[key];
    return control.touched && control.hasError('email');
  }
}
