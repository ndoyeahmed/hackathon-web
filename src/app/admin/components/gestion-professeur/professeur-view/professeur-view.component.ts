import {Component, Input} from '@angular/core';
import {ProfesseurModel} from "../../../../shared/models/professeur.model";

@Component({
  selector: 'app-professeur-view',
  templateUrl: './professeur-view.component.html',
  styleUrls: ['./professeur-view.component.scss']
})
export class ProfesseurViewComponent {
@Input() professeur!: ProfesseurModel;
}
