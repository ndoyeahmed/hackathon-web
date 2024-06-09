import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/admin/services/admin.service';
import { ProfesseurModel } from 'src/app/shared/models/professeur.model';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-professeur-list',
  templateUrl: './professeur-list.component.html',
  styleUrls: ['./professeur-list.component.scss']
})
export class ProfesseurListComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  professeurs = [] as ProfesseurModel[];
  closeResult = '';
  searchTerm = '';

  @Output() onEditProfesseur: EventEmitter<ProfesseurModel> = new EventEmitter();
  @Output() onSeeHonoraire: EventEmitter<any> = new EventEmitter();
  page = 0;
  pageSize = 5;
  totalPage!: number;
  totalItems!: number;

  constructor(
    private alerteService: AlertService,
    private modalService: NgbModal,
    private adminService: AdminService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.getAllProfesseur(this.page);
  }

  getAllProfesseur(page = 0) {
    this.subscriptions.push(
      this.adminService.getAllProfesseurNotArchive(page).subscribe({
        next: (data: any) => {
          this.professeurs = data.results;
          this.page = data.currentPage + 1;
          this.totalItems = data.totalItems;
          this.totalPage = data.totalPages;
        }
      })
    );
  }

  onEdit(professeur: ProfesseurModel) {
    this.onEditProfesseur.emit(professeur);
  }

  onDelete(professeur: ProfesseurModel) {
    professeur.deleteAction = true;
  }

  cancelDeleteAction(professeur: ProfesseurModel) {
    professeur.deleteAction = false;
  }

  deleteProfesseur(professeur: ProfesseurModel) {
    professeur.deleteAction = false;
    this.subscriptions.push(
      this.adminService.deleteProfesseur(professeur.id).subscribe(
        (data) => {
          this.alerteService.success('Professeur supprimer avec succés');
          this.page = 0;
          this.getAllProfesseur(this.page);
        }, (err) => this.alerteService.error('Echec de l\'opération')
      )
    );
  }

  onPageChange(event: any) {
    this.page = Number(event-1);
    this.getAllProfesseur(this.page);
  }

  showHonoraireEnCours(professeur: ProfesseurModel) {
    this.onSeeHonoraire.emit({
      professeur: professeur,
      typeHonoraire: 'encours'
    });
  }
  showHonorairePayer(professeur: ProfesseurModel) {
    this.onSeeHonoraire.emit({
      professeur: professeur,
      typeHonoraire: 'payer'
    });
  }
}
