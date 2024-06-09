import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ApprenantModel } from 'src/app/shared/models/apprenant.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { SeminaireService } from '../../services/seminaire.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningFormationModel } from 'src/app/shared/models/planning-formation.model';
import { ApprenantDTO } from 'src/app/shared/models/apprenant-dto.model';
import { ReglementModel } from 'src/app/shared/models/reglement.model';
import { PaiementModel } from 'src/app/shared/models/paiement.model';
import { MontantPaiementDTO } from 'src/app/shared/models/MontantPaiementDTO.model';
import {ChargeFixeModel} from "../../../shared/models/charge-fixe.model";
import {PdfService} from "../../../shared/services/pdf.service";
import * as moment from 'moment';
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-apprenant-list',
  templateUrl: './apprenant-list.component.html',
  styleUrls: ['./apprenant-list.component.scss']
})
export class ApprenantListComponent implements OnInit {
  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;
  closeResult = '';
  subscriptions: Subscription[] = [];
  searchTerm = '';

  page!: number;
  pageSize = 5;
  totalPage!: number;
  totalItems!: number;
  apprenants: ApprenantDTO[] = [];
  reglements: ReglementModel[] = [];
  paiement!: PaiementModel;
  montantTotalPaiement!: MontantPaiementDTO;

  planning!: PlanningFormationModel;
  planningID!: number;

  constructor(private seminaireService: SeminaireService,
    private alerteService: AlertService,
    private modalService: NgbModal,
    private _activatedRoute: ActivatedRoute, private pdfService: PdfService,
    private _route: Router) {}
  ngOnInit(): void {
    this.planningID = Number(this._activatedRoute.snapshot.params['planningID']);
    if (this.planningID) {
      this.getPlanningById(this.planningID);
      this.getListApprenantByPlanningID(this.page, this.planningID);
    } else {
      this._route.navigate(['/formation/inscription']);
    }
  }

  getPlanningById(planningID: number) {
    this.subscriptions.push(
      this.seminaireService.getPlanningByID(planningID).subscribe(
        (data: any) => this.planning = data as PlanningFormationModel,
        (error) => this._route.navigate(['/formation/inscription']),
      )
    );
  }

  getListApprenantByPlanningID(page = 0, planningID: number) {
    this.subscriptions.push(
      this.seminaireService.getAllApprenantByPlanningIDPerPage(planningID, page, this.pageSize).subscribe(
        (data: any) => {
          this.apprenants = data.results;
          this.page = data.currentPage + 1;
          this.totalPage = data.totalPages;
          this.totalItems = data.totalItems;
          this.montantTotalPaiement = data.total_avance_reliquat;
        }, (error) => console.log(error)
      )
    );
  }

  onPageChange(event: any) {
    this.page = event - 1;
    this.getListApprenantByPlanningID(this.page, this.planning.id);
  }

  open(content: any, apprenant: ApprenantDTO) {
    // this.reglements = apprenant && apprenant.reglements ? apprenant.reglements : [];
    this.paiement = apprenant && apprenant.paiement ? apprenant.paiement : new PaiementModel();
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

  onEdit(apprenant: ApprenantDTO) {
    this._route.navigate(['/formation/apprenants/edit/', apprenant.id]);
  }

  deleteApprenant(apprenant: ApprenantDTO) {
    apprenant.deleteAction = false;
    this.subscriptions.push(
      this.seminaireService.deleteInscriptionApprenant(apprenant && apprenant.id ? apprenant.id : 0).subscribe(
        (data) => {
          this.alerteService.success('Inscription supprimer avec succès');
          this.getListApprenantByPlanningID(this.page, this.planning.id);
        }, (err) => this.alerteService.error('Echec de l\'opération')
      )
    );
  }

  cancelDeleteAction(apprenant: ApprenantDTO) {
    apprenant.deleteAction = false;
  }

  onDelete(apprenant: ApprenantDTO) {
    apprenant.deleteAction = true;
  }
  onViewListPlanning() {
    this._route.navigate(['/formation/inscription']);
  }

  onRegisterApprenant() {
    this._route.navigate(['/formation/apprenants/register/', this.planning.id]);
  }

  onAddReglement(event: boolean) {
    if (event) {
      this.page = this.page - 1;
      this.getListApprenantByPlanningID(this.page, this.planning.id);
    }
  }

  downloadPDF() {
    this.subscriptions.push(
        this.seminaireService.getAllApprenantByPlanningID(this.planningID).subscribe(
            (data: any) => {
              const columns: any[] = ['Nom', 'Prenom', 'Email', 'Telephone', 'Avance', 'Reliquat'];
              const apprenants = data as ApprenantDTO[];
              if (apprenants && apprenants.length > 0) {
                const pdfData = apprenants.map(apprenant => (
                  {
                    Nom: apprenant.nom,
                    Prenom: apprenant.prenom,
                    Email: apprenant.email,
                    Telephone: apprenant.telephone,
                    Avance: apprenant.paiement?.avance,
                    Reliquat: apprenant.paiement?.reliquat,
                  }
                ));
                this.pdfService.generateTable('download', pdfData, columns, 'Liste des Apprenants');
              }
            }, (error) => console.log(error)
        )
    );
  }

  formatDate(date: any) {
    return moment(date).format('DD/MM/YYYY');
  }
  downloadPaiementsApprenantPDF(apprenant: ApprenantDTO) {
    const apprenantID = apprenant && apprenant.id ? apprenant.id : 0;
    const paiementID = apprenant && apprenant.paiement && apprenant.paiement.id ? apprenant.paiement.id : 0;
   this.subscriptions.push(
      this.seminaireService.getAllReglementPDf(paiementID, this.planningID, apprenantID).subscribe(
        (data: any) => {
          const columns: any[] = ['Date', 'Montant'];
          if (data.reglements && data.reglements.length > 0) {
            const pdfData = data.reglements.map((reglement: any) => (
              {
                Date: this.formatDate(reglement.date),
                Montant: reglement.montant
              }
            ));
            this.pdfService.generateFactureApprenant(data, pdfData, columns, 'Reçu des paiements');
          }
        }, (error) => console.log(error)
      )
    );
  }
}
