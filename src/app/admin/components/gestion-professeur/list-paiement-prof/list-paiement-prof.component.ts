import { Subscription } from 'rxjs';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/admin/services/admin.service';
import { ProfesseurModel } from 'src/app/shared/models/professeur.model';
import { FormationProfesseurModel } from 'src/app/shared/models/formation-professeur.model';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from "moment/moment";
import {PdfService} from "../../../../shared/services/pdf.service";

@Component({
  selector: 'app-list-paiement-prof',
  templateUrl: './list-paiement-prof.component.html',
  styleUrls: ['./list-paiement-prof.component.scss']
})
export class ListPaiementProfComponent implements OnInit {
  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;
  modalContentValue = 'paiement';
  closeResult = '';
  @Input() typeHonoraire!: string;
  @Input() professeur!: ProfesseurModel;
  subscriptions: Subscription[] = [];
  formationsProfesseurs: FormationProfesseurModel[] = [];
  formationProf!: FormationProfesseurModel;
  page = 0;
  pageSize = 5;
  totalPage!: number;
  totalItems!: number;
  searchTerm = '';
  reglements: any[] = [];
  constructor(
    private adminService: AdminService,
    private modalService: NgbModal,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    if (this.typeHonoraire) {
      this.getAllFormationByTypeHonoraire(this.typeHonoraire);
    }
  }

  getAllFormationByTypeHonoraire(type: string) {
    if (type === 'encours') {
      this.getAllFormationProfEncoursByProfesseurID();
    } else {
      this.getAllFormationProfPayerByProfesseurID();
    }
  }

  getAllFormationProfEncoursByProfesseurID() {
    this.subscriptions.push(
      this.adminService.getAllFormationProfesseurNotArchiveEncoursByProfesseurPerPage(this.professeur.id, this.page, this.pageSize)
      .subscribe({
        next: (data: any) => {
          this.formationsProfesseurs = data.results;
          this.page = data.currentPage + 1;
          this.totalItems = data.totalItems;
          this.totalPage = data.totalPages;
        }
      })
    );
  }

  getAllFormationProfPayerByProfesseurID() {
    this.subscriptions.push(
      this.adminService.getAllFormationProfesseurNotArchivePayerByProfesseurPerPage(this.professeur.id, this.page, this.pageSize)
      .subscribe({
        next: (data: any) => {
          this.formationsProfesseurs = data.results;
          this.page = data.currentPage + 1;
          this.totalItems = data.totalItems;
          this.totalPage = data.totalPages;
        }
      })
    );
  }

  onPageChange(event: any) {
    this.page = Number(event-1);
    this.getAllFormationByTypeHonoraire(this.typeHonoraire);
  }

  onSavePaiement(event: any) {
    if (event) {
      this.modalService.dismissAll();
      this.getAllFormationByTypeHonoraire(this.typeHonoraire);
    }
  }

  open(content: any, formationProfesseur: FormationProfesseurModel, contentValue: string) {
    this.formationProf = formationProfesseur;
    this.modalContentValue = contentValue;
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

  onDownloadFacture(formationProf: FormationProfesseurModel) {
    this.getAllReglementHonoraireByFormationProf(formationProf.id, formationProf);
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

}
