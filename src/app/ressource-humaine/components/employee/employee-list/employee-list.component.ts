import {Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {ProfesseurModel} from "../../../../shared/models/professeur.model";
import {AlertService} from "../../../../shared/services/alert.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AdminService} from "../../../../admin/services/admin.service";
import {EmployeResponseModel} from "../../../../shared/models/employe-response.model";
import {RessourceHumaineService} from "../../../services/ressource-humaine.service";
import {ApprenantDTO} from "../../../../shared/models/apprenant-dto.model";
import {PaiementModel} from "../../../../shared/models/paiement.model";
import * as moment from "moment/moment";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RegelementSalaireModel} from "../../../../shared/models/regelement-salaire.model";
import {PdfService} from "../../../../shared/services/pdf.service";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;
  subscriptions: Subscription[] = [];
  employees = [] as EmployeResponseModel[];
  closeResult = '';
  modalBody = 'contrat';
  searchTerm = '';

  @Output() onEditEmployee: EventEmitter<EmployeResponseModel> = new EventEmitter();
  @Output() onSeeHonoraire: EventEmitter<any> = new EventEmitter();
  page = 0;
  pageSize = 5;
  totalPage!: number;
  totalItems!: number;
  employeeDetails = new EmployeResponseModel();
  salaireForm!: FormGroup;
  salaireEdit!: RegelementSalaireModel;
  reglements = [] as RegelementSalaireModel[];

  pageReglement = 0;
  pageSizeReglement = 5;
  totalPageReglement!: number;
  totalItemsReglement!: number;

  constructor(
    private alerteService: AlertService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private pdfService: PdfService,
    private resourceHumaineService: RessourceHumaineService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.getAllEmployees(this.page);
  }

  getAllEmployees(page = 0) {
    this.subscriptions.push(
      this.resourceHumaineService.getAllEmployees(page).subscribe({
        next: (data: any) => {
          this.employees = data.results;
          this.page = data.currentPage + 1;
          this.totalItems = data.totalItems;
          this.totalPage = data.totalPages;
        }
      })
    );
  }

  onEdit(employee: EmployeResponseModel) {
    this.onEditEmployee.emit(employee);
  }

  onDelete(employee: EmployeResponseModel) {
    employee.deleteAction = true;
  }

  cancelDeleteAction(employee: EmployeResponseModel) {
    employee.deleteAction = false;
  }

  deleteProfesseur(employee: EmployeResponseModel) {
    employee.deleteAction = false;
    this.subscriptions.push(
      this.resourceHumaineService.deleteEmploye(employee.id, employee.idContrat).subscribe(
        (data) => {
          this.alerteService.success('Employé supprimer avec succés');
          this.page = 0;
          this.getAllEmployees(this.page);
        }, (err) => this.alerteService.error('Echec de l\'opération')
      )
    );
  }

  onPageChange(event: any) {
    this.page = Number(event-1);
    this.getAllEmployees(this.page);
  }

  onPageChangeReglement(event: any) {
    this.pageReglement = Number(event-1);
    this.getAllReglements(this.pageReglement);
  }

  formatDate(date: any) {
    return moment(date).format('DD/MM/YYYY');
  }

  open(content: any, employee: EmployeResponseModel, modalBody = 'contrat') {
    // this.reglements = apprenant && apprenant.reglements ? apprenant.reglements : [];
    this.employeeDetails = employee;
    this.modalBody = modalBody;
    if (modalBody === 'historique') {
      this.initAddForm();
      this.getAllReglements(this.pageReglement);
    }
    this.modalService.open(
      content,
      {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
        backdrop: false
      }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  initAddForm() {
    this.salaireForm = new FormGroup({
      'salaireNet': new FormControl({value: this.employeeDetails.salaireNet, disabled: true}),
      'montant': new FormControl(null, [Validators.required]),
      'date': new FormControl({value: moment().format('YYYY-MM-DD'), disabled: true})
    });
  }

  initEditForm(regelment: RegelementSalaireModel) {
    this.salaireForm = new FormGroup({
      'salaireNet': new FormControl({value: this.employeeDetails.salaireNet, disabled: true}),
      'montant': new FormControl(regelment.montant, [Validators.required]),
      'date': new FormControl({value: moment(regelment.date).format('YYYY-MM-DD'), disabled: true})
    });
  }

  onShowRequiredMsgError(key: string) {
    const control = this.salaireForm.controls[key];
    return control.touched && control.hasError('required');
  }

  cancel() {
    this.salaireForm.reset();
    this.initAddForm();
  }

  save() {
    if (this.salaireForm.valid) {
      const reglementSalaire = {
        montant: Number(this.salaireForm.controls['montant'].value),
        date: moment(this.salaireForm.controls['date'].value).toDate(),
        contrat: this.employeeDetails.idContrat
      } as RegelementSalaireModel;
      this.subscriptions.push(
        this.resourceHumaineService.addReglement(reglementSalaire).subscribe(
          (data) => {
            this.alertService.success('Opération effectuée avec succès');
            this.cancel();
            this.getAllReglements(this.pageReglement);
          }, (error) => this.alertService.error('Echec de l\'opération')
        )
      );
    } else {
      this.salaireForm.markAllAsTouched();
    }
  }

  edit() {
    if (this.salaireForm.valid && this.salaireEdit && this.salaireEdit.id) {
      const reglementSalaire = {
        montant: Number(this.salaireForm.controls['montant'].value),
        date: moment(this.salaireForm.controls['date'].value).toDate(),
        contrat: this.employeeDetails.idContrat,
        id: this.salaireEdit.id
      } as RegelementSalaireModel;
      this.subscriptions.push(
        this.resourceHumaineService.updateReglement(reglementSalaire, this.salaireEdit.id).subscribe(
          (data) => {
            this.alertService.success('Opération effectuée avec succès');
            this.cancel();
            this.getAllReglements(this.pageReglement);
          }, (error) => this.alertService.error('Echec de l\'opération')
        )
      );
    } else {
      this.salaireForm.markAllAsTouched();
    }
  }

  onEditReglement(regelement: RegelementSalaireModel) {
    this.salaireEdit = regelement;
    this.initEditForm(regelement);
  }

  getAllReglements(page = 0) {
    this.subscriptions.push(
      this.resourceHumaineService.getAllReglementPerPage(this.employeeDetails.idContrat, page).subscribe({
        next: (data: any) => {
          this.reglements = data.results;
          this.pageReglement = data.currentPage + 1;
          this.totalItemsReglement = data.totalItems;
          this.totalPageReglement = data.totalPages;
        }
      })
    );
  }

  onDeleteReglement(regelement: RegelementSalaireModel) {
    regelement.deleteAction = true;
  }

  cancelDeleteActionReglement(regelement: RegelementSalaireModel) {
    regelement.deleteAction = false;
  }

  deleteReglement(regelement: RegelementSalaireModel) {
    regelement.deleteAction = false;
    this.subscriptions.push(
      this.resourceHumaineService.deleteReglement(regelement.id).subscribe(
        (data) => {
          this.alerteService.success('Supprimer avec succés');
          this.page = 0;
          this.getAllReglements(this.pageReglement);
        }, (err) => this.alerteService.error('Echec de l\'opération')
      )
    );
  }

  printFactureSalaire(reglement: RegelementSalaireModel) {
    const data = {
      montant: reglement.montant,
      date: reglement.date,
      contrat: this.employeeDetails
    };
    this.pdfService.generateFactureSalaire(data,)
  }

  printHistoriqueFactureSalaire(employee: EmployeResponseModel) {
    let reglementPdf = [] as RegelementSalaireModel[];
    this.subscriptions.push(
      this.resourceHumaineService.getAllReglement(employee.idContrat).subscribe({
        next: (data: any) => {
          reglementPdf = data;
        },
        error: () => console.log('err'),
        complete: () => {
          const columns: any[] = ['Date', 'Montant'];
          const pdfData = reglementPdf.map((reglement: any) => (
            {
              Date: this.formatDate(reglement.date),
              Montant: reglement.montant
            }
          ));
          this.pdfService.generateHistoriqueFactureSalaire(employee, pdfData, columns, 'print');
        }
      })
    );
  }
}
