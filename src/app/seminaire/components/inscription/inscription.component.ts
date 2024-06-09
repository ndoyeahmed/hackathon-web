import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlanningFormationModel } from 'src/app/shared/models/planning-formation.model';
import { SeminaireService } from '../../services/seminaire.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  planningFormations: PlanningFormationModel[] = [];
  page = 0;
  pageSize = 12;
  totalPage = 0;
  totalItems = 0;
  searchTerm = '';

  constructor(
    private seminaireService: SeminaireService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.getAllPlanningFormation();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  getAllPlanningFormation(page = 0) {
    this.subscriptions.push(
      this.seminaireService.getAllPlanningFormationNotArchive(page, this.pageSize).subscribe(
        {
          next: (data: any) => {
            this.planningFormations = data.results;
            this.page = data.currentPage + 1;
            this.totalPage = data.totalPages;
            this.totalItems = data.totalItems;
          }
        }
      )
    );
  }

  onPageChange(event: any) {
    this.getAllPlanningFormation(event-1);
  }

  onRegisterApprenant(planningID: number) {
    this.route.navigate(['/formation/apprenants/register/', planningID]);
  }

  onViewListApprenant(planningID: number) {
    this.route.navigate(['/formation/apprenants/list/', planningID]);
  }
}
