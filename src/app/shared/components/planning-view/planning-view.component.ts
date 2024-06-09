import { Component, Input } from '@angular/core';
import { PlanningFormationModel } from 'src/app/shared/models/planning-formation.model';

@Component({
  selector: 'app-planning-view',
  templateUrl: './planning-view.component.html',
  styleUrls: ['./planning-view.component.scss']
})
export class PlanningViewComponent {
  @Input() planning!: PlanningFormationModel;
}
