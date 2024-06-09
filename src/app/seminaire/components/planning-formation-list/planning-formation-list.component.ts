import { PlanningDtoModel } from './../../../shared/models/planning-dto.model';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { PlanningFormationModel } from 'src/app/shared/models/planning-formation.model';
import { SeminaireService } from '../../services/seminaire.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { FormationModel } from 'src/app/shared/models/formation.model';
import { ProfesseurModel } from 'src/app/shared/models/professeur.model';
import {PdfService} from "../../../shared/services/pdf.service";
import {Item} from "../../../shared/components/multi-dropdown/multi-dropdown.model";

@Component({
  selector: 'app-planning-formation-list',
  templateUrl: './planning-formation-list.component.html',
  styleUrls: ['./planning-formation-list.component.scss']
})
export class PlanningFormationListComponent {
  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;
  closeResult = '';
  subscriptions: Subscription[] = [];
  searchTerm = '';
  view = 'depenses';
  @Input()
  totalCout !: number;

  @Output() editEvent: EventEmitter<any> = new EventEmitter();
  @Input()
  page!: number;
  @Input()
  pageSize!: number;
  @Input()
  totalPage!: number;
  @Input()
  totalItems!: number;
  @Input()
  plannings: PlanningDtoModel[] = [];

  planningFormation!: PlanningDtoModel;
  modulesPlanning: any[] = [];

  constructor(private seminaireService: SeminaireService,
    private alerteService: AlertService,
    private pdfService: PdfService,
    private modalService: NgbModal) {}

  onPageChange(event: any) {
    this.seminaireService.notifAddFormSubject.next(
      {
        name: 'update_list',
        page: Number(event-1)
      }
    );
  }

  getModulePlanningByPlanningId(planningId: number) {
    this.subscriptions.push(
        this.seminaireService.getModulePllaningByPlanningId(planningId).subscribe(
            (data: any) => {
              this.modulesPlanning = data;
            }, (error) => console.log(error)
        )
    );
  }

  open(content: any, planning: PlanningDtoModel, view = 'depenses') {
    this.view = view;
    if (view === 'modules') {
      this.getModulePlanningByPlanningId(planning.id);
    }
    this.planningFormation = planning;
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

  onEdit(planning: PlanningDtoModel) {
    const planningform = new PlanningFormationModel();
    planningform.id = planning.id;
    planningform.cout = planning.cout;
    planningform.dateDebut = planning.dateDebut;
    planningform.dateFin = planning.dateFin;
    planningform.libelle = planning.libelle;
    const formation = new FormationModel();
    formation.id = planning.formationId;
    formation.libelle = planning.formation;
    const prof = new ProfesseurModel();
    prof.id = planning.professeurId;
    prof.nom = planning.nomProf;
    prof.prenom = planning.prenomProf;
    planningform.formation = formation;
    planningform.professeur = prof;
    this.editEvent.emit(planningform);
  }

  deletePlanning(planning: PlanningDtoModel) {
    planning.deleteAction = false;
    this.subscriptions.push(
      this.seminaireService.archivePlanning(planning.id).subscribe(
        (data) => {
          this.alerteService.success('Dépense supprimer avec succès');
          this.seminaireService.notifAddFormSubject.next(
            {
              name: 'update_list',
              page: 0
            }
          );
        }, (err) => this.alerteService.error('Echec de l\'opération')
      )
    );
  }

  cancelDeleteAction(planning: PlanningDtoModel) {
    planning.deleteAction = false;
  }

  onDelete(planning: PlanningDtoModel) {
    planning.deleteAction = true;
  }

  downloadPDF() {
    this.subscriptions.push(
      this.seminaireService.getListPlanningPdf().subscribe(
        (data: any) => {
          const columns: any[] = ['formation', 'cout', 'debut', 'fin', 'depense'];
          this.pdfService.generateTable('download', data, columns, 'Liste des formations plannifiées');
        }, (error) => console.log(error)
      )
    );
  }
}
