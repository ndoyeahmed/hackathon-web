import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PlanningFormationModel } from 'src/app/shared/models/planning-formation.model';
import { SeminaireService } from '../../services/seminaire.service';
import { Subscription } from 'rxjs';
import { PlanningDtoModel } from 'src/app/shared/models/planning-dto.model';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit, OnDestroy {
  @ViewChild('nav') nav: any;
  active = 2;
  subscriptions: Subscription[] = [];
  planningFormations: PlanningDtoModel[] = [];
  page = 0;
  pageSize = 5;
  totalPage = 0;
  totalItems = 0;
  totalCout = 0;

  planningEdit!: PlanningFormationModel;

  constructor(
    private seminaireService: SeminaireService
    ) {
      seminaireService.notifAddFormSubject.subscribe(
        (data) => {
          if (data.name === 'update_list') {
            this.page = data.page;
            this.getAllPlanningFormation(this.page);
            this.getTotalCoutPlanning();
          }
        }
      )
    }

  ngOnInit(): void {
    this.getAllPlanningFormation();
    this.getTotalCoutPlanning();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  getAllPlanningFormation(page = 0) {
    this.subscriptions.push(
      this.seminaireService.getAllPlanningFormationNotArchive(page).subscribe(
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

  getTotalCoutPlanning() {
    this.subscriptions.push(
      this.seminaireService.getTotalCoutPlanning().subscribe(
        {
          next: (data: any) => {
            this.totalCout = data.totalCout;
          }
        }
      )
    );
  }

  onEditPlanning(planning: PlanningFormationModel) {
    this.planningEdit = planning;
    this.nav.select(1);
  }

  onNavChange() {
    setTimeout(()=> {
      this.planningEdit = new PlanningFormationModel();
    });
  }
}
