import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/admin/services/admin.service';
import { FormationProfesseurModel } from 'src/app/shared/models/formation-professeur.model';

@Component({
  selector: 'app-reglement-honoraire',
  templateUrl: './reglement-honoraire.component.html',
  styleUrls: ['./reglement-honoraire.component.scss']
})
export class ReglementHonoraireComponent implements OnInit, OnDestroy {

  @Input() formationProfesseurID!: number ;
  subscriptions: Subscription[] = [];
  reglements: any[] = [];
  totalReglement = 0;

  page!: number;
  pageSize = 5;
  totalPage!: number;
  totalItems!: number;
  searchTerm = '';

  constructor(
    private adminService: AdminService
    ) {}

  ngOnInit(): void {
    this.getAllReglementHonoraireByFormationProf(this.formationProfesseurID);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe())
  }

  getAllReglementHonoraireByFormationProf(formationProfId: number, page = 0) {
    this.subscriptions.push(
      this.adminService.getAllReglementHonoraireByFormationProfPerPage(formationProfId, page, this.pageSize).subscribe({
        next: (data: any) => {
          this.reglements = data.results;
          this.page = data.currentPage + 1;
          this.totalPage = data.totalPages;
          this.totalItems = data.totalItems;
          this.totalReglement = this.reglements.reduce((sum, data) => sum + data.montant, 0);
        }
      })
    );
  }

  onPageChange(event: any) {
    this.page = event - 1;
    this.getAllReglementHonoraireByFormationProf(this.formationProfesseurID, this.page);
  }
}

