import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormationModel } from 'src/app/shared/models/formation.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AdminService } from '../../services/admin.service';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModuleDtoModel} from "../../../shared/models/module-dto.model";
import {ParametragesService} from "../../../seminaire/services/parametrages.service";

@Component({
  selector: 'app-gestion-formation',
  templateUrl: './gestion-formation.component.html',
  styleUrls: ['./gestion-formation.component.scss']
})
export class GestionFormationComponent implements OnInit, OnDestroy {
  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;
  closeResult = '';
  view = 'modules-list';

  isAdd = false;
  formations!: FormationModel[];
  formationForm!: FormGroup;
  formationEdit!: FormationModel;
  subscriptions: Subscription[] = [];
  formationView!: FormationModel;

  modules: ModuleDtoModel[] = [];

  page = 0;
  pageSize = 5;
  totalPage!: number;
  totalItems!: number;
  searchTerm = '';

  isAddModule = false;
  moduleForm!: FormGroup;
  moduleEdit!: ModuleDtoModel;
  pageModule = 0;
  pageSizeModule = 5;
  totalPageModule!: number;
  totalItemsModule!: number;

  constructor(
    private alerteService: AlertService,
    private adminService: AdminService,
    private parameterService: ParametragesService,
    private modalService: NgbModal
  ) {
    this.initAddForm();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
  ngOnInit(): void {
    this.getAllFormation();
  }

  getAllFormation(page = 0) {
    this.subscriptions.push(
      this.adminService.getAllFormationNotArchive(page).subscribe({
        next: (data: any) => {
          this.formations = data.results;
          this.page = data.currentPage + 1;
          this.totalItems = data.totalItems;
          this.totalPage = data.totalPages;
        }
      })
    );
  }

  getAllModulesByFormation(formationId: number, page = 0) {
    this.subscriptions.push(
      this.parameterService.getModulesByFormationPerPage(formationId, page).subscribe({
        next: (data: any) => {
          this.modules = data.results;
          this.pageModule = data.currentPage + 1;
          this.totalItemsModule = data.totalItems;
          this.totalPageModule = data.totalPages;
        }
      })
    );
  }

  initAddForm() {
    this.formationForm = new FormGroup({
      'libelle': new FormControl(null, [Validators.required])
    });
  }

  initEditForm(formation: FormationModel) {
    this.formationForm = new FormGroup({
      'libelle': new FormControl(formation.libelle, [Validators.required])
    });
  }

  onEdit(formation: FormationModel) {
    this.formationEdit = formation;
    this.isAdd = true;
    this.initEditForm(formation);
  }

  onDelete(formation: FormationModel) {
    formation.deleteAction = true;
  }

  cancelDeleteAction(formation: FormationModel) {
    formation.deleteAction = false;
  }

  deleteFormation(formation: FormationModel) {
    formation.deleteAction = false;
    this.subscriptions.push(
      this.adminService.deleteFormation(formation.id).subscribe(
        (data) => {
          this.alerteService.success('Formation supprimer avec succés');
          this.cancel();
          this.page = 0;
          this.getAllFormation(this.page);
        }, (err) => this.alerteService.error('Echec de l\'opération')
      )
    );
  }

  edit() {
    if (this.formationForm.valid && this.formationEdit && this.formationEdit.id) {
      this.formationEdit.libelle = this.formationForm.controls['libelle'].value;
      this.subscriptions.push(
        this.adminService.updateFormation(this.formationEdit).subscribe(
          (data: any) => {
            this.alerteService.success('formation mis à jour avec succés');
            this.cancel();
            this.page = 0;
            this.getAllFormation(this.page);
          }, (err) => {
            this.alerteService.error('Echec de l\'opération');
          }
        )
      );
    }
  }

  save() {
    if (this.formationForm.valid) {
      const formation = new FormationModel();
      formation.libelle = this.formationForm.controls['libelle'].value;
      this.subscriptions.push(
        this.adminService.addFormation(formation).subscribe(
          (data: any) => {
            this.alerteService.success('formation enregistrer avec succés');
            this.cancel();
            this.page = 0;
            this.getAllFormation(this.page);
          }, (err) => {
            this.alerteService.error('Echec de l\'opération');
          }
        )
      );
    }
  }

  cancel() {
    this.formationForm.reset();
    this.isAdd = false;
  }

  onPageChange(event: any) {
    this.page = Number(event-1);
    this.getAllFormation(this.page);
  }

  editModule() {
    if (this.moduleForm.valid && this.moduleEdit && this.moduleEdit.id) {
      this.moduleEdit.libelle = this.moduleForm.controls['module'].value;
      this.subscriptions.push(
        this.parameterService.updateModule(this.moduleEdit).subscribe(
          (data: any) => {
            this.alerteService.success('module mis à jour avec succés');
            this.cancelModuleSave();
            this.getAllModulesByFormation(this.formationView.id, this.pageModule);
          }, (err) => {
            this.alerteService.error('Echec de l\'opération');
          }
        )
      );
    }
  }

  saveModule() {
    if (this.moduleForm.valid) {
      const module = new ModuleDtoModel();
      module.libelle = this.moduleForm.controls['module'].value;
      module.formation = this.formationView;
      this.subscriptions.push(
        this.parameterService.saveModule(module).subscribe(
          (data: ModuleDtoModel) => {
            this.alerteService.success('module enregistrer avec succés');
            this.cancelModuleSave();
            this.getAllModulesByFormation(this.formationView.id, this.pageModule);
          }, (err) => {
            this.alerteService.error('Echec de l\'opération');
          }
        )
      );
    }
  }

  cancelModuleSave() {
    this.moduleForm.reset();
    this.isAddModule = false;
  }

  initAddModuleForm() {
    this.moduleForm = new FormGroup({
      'module': new FormControl(null, [Validators.required])
    });
  }

  initEditModuleForm(module: ModuleDtoModel) {
    this.moduleForm = new FormGroup({
      'module': new FormControl(module.libelle, [Validators.required])
    });
  }

  onEditModule(module: ModuleDtoModel) {
    this.moduleEdit = module;
    this.isAddModule = true;
    this.initEditModuleForm(module);
  }

  onDeleteModule(module: ModuleDtoModel) {
    module.deleteAction = true;
  }

  cancelModuleDeleteAction(module: ModuleDtoModel) {
    module.deleteAction = false;
  }

  deleteModule(module: ModuleDtoModel) {
    module.deleteAction = false;
    this.subscriptions.push(
      this.parameterService.deleteModule(module.id).subscribe(
        (data) => {
          this.alerteService.success('Module supprimer avec succés');
          this.cancelModuleSave();
          this.getAllModulesByFormation(this.formationView.id, this.pageModule)
        }, (err) => this.alerteService.error('Echec de l\'opération')
      )
    );
  }

  open(content: any, view = 'modules-list', formation: FormationModel) {
    this.view = view;
    this.formationView = formation;
    this.getAllModulesByFormation(formation.id, this.pageModule);
    this.initAddModuleForm();

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

  onPageChangeModule(event: any) {
    this.pageModule = Number(event-1);
    this.getAllModulesByFormation(this.formationView.id, this.pageModule);
  }
}
