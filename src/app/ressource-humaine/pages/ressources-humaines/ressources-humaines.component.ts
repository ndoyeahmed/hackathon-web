import {Component, ViewChild} from '@angular/core';
import {EmployeResponseModel} from "../../../shared/models/employe-response.model";

@Component({
  selector: 'app-ressources-humaines',
  templateUrl: './ressources-humaines.component.html',
  styleUrls: ['./ressources-humaines.component.scss']
})
export class RessourcesHumainesComponent {
  @ViewChild('nav') nav: any;
  active = 2;

  employeEdit!: EmployeResponseModel;

  constructor() {
  }
  onNavChange(event: any) {
    setTimeout(() => {
      this.employeEdit = new EmployeResponseModel();
    })
  }

  onEditEmployee(employee: EmployeResponseModel) {
    this.employeEdit = employee;
    this.nav.select(1);
  }
}
