import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormationModel } from 'src/app/shared/models/formation.model';
import { PlanningFormationModel } from 'src/app/shared/models/planning-formation.model';
import { ProfesseurModel } from 'src/app/shared/models/professeur.model';
import { SeminaireService } from '../../services/seminaire.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ParametragesService } from '../../services/parametrages.service';
import {Item} from "../../../shared/components/multi-dropdown/multi-dropdown.model";
import {ModuleProfesseurModel} from "../../../shared/models/module-professeur.model";
import { v4 as uuid } from 'uuid';
import {ModuleDtoModel} from "../../../shared/models/module-dto.model";

@Component({
  selector: 'app-planning-formation-add',
  templateUrl: './planning-formation-add.component.html',
  styleUrls: ['./planning-formation-add.component.scss']
})
export class PlanningFormationAddComponent implements OnInit, OnDestroy {
  @Output() planningEmitter = new EventEmitter<PlanningFormationModel>();
  planningForm!: FormGroup;
  subscriptions: Subscription[] = [];
  planningFormation = new PlanningFormationModel();
  selectedProf = 0;
  selectedFormation = 0;
  selectedModule = 0;
  moduleProfList: ModuleProfesseurModel[] = [];
  formations = [] as FormationModel[];
  items = [] as Item[];
  selectedItems = [] as Item[];
  professeurs = [] as ProfesseurModel[];
  modules: ModuleDtoModel[] = [];

  @Input() planningEdit!: PlanningFormationModel;

  constructor(
    private seminaireService: SeminaireService,
    private alertService: AlertService,
    private parametrageService: ParametragesService
    ) { }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    this.getAllFormations();
    this.getAllProfesseurs();
    if (this.planningEdit && this.planningEdit.id) {
      this.getModulePlanningByPlanningId(this.planningEdit.id);
      this.getModulesByFormation(this.planningEdit.formation.id);
      this.initEditForm(this.planningEdit);
    } else {
      this.initAddForm();
    }
  }

  initAddForm() {
    this.planningForm = new FormGroup({
      'libelle': new FormControl(null),
      'formation': new FormControl(this.selectedFormation, Validators.required),
      'module': new FormControl(this.selectedModule),
      'dateDebut': new FormControl(null, Validators.required),
      'dateFin': new FormControl(null, Validators.required),
      'professeur': new FormControl(this.selectedProf),
      'cout': new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  initEditForm(planning: PlanningFormationModel) {
    this.planningForm = new FormGroup({
      'libelle': new FormControl(planning.libelle),
      'formation': new FormControl(planning.formation.id, Validators.required),
      'module': new FormControl(null),
      'dateDebut': new FormControl(this.formatDate(planning.dateDebut), Validators.required),
      'dateFin': new FormControl(this.formatDate(planning.dateFin), Validators.required),
      'professeur': new FormControl(null),
      'cout': new FormControl(planning.cout, [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  formatDate(date: any) {
    return moment(date).format('YYYY-MM-DD');
  }

  getAllFormations() {
    this.subscriptions.push(
      this.parametrageService.getFormations().subscribe({
        next: (data: FormationModel[]) => {
          this.formations = data;
          this.items = this.formations.map((f) => ({id: f.id, name: f.libelle} as Item));
        }
      })
    );
  }

  getAllProfesseurs() {
    this.subscriptions.push(
      this.parametrageService.getProfesseurs().subscribe({
        next: (data: ProfesseurModel[]) => {
          this.professeurs = data;
        }
      })
    );
  }

  getModulesByFormation(formationId: number) {
    this.subscriptions.push(
      this.parametrageService.getModulesByFormation(formationId).subscribe({
        next: (data: ModuleDtoModel[]) => {
          this.modules = data;
        }
      })
    );
  }

  savePlannig() {
    if (this.planningForm.valid && this.moduleProfList.length > 0) {
      const planningRequest = {
       libelle: this.planningForm.controls["libelle"].value,
       dateDebut: moment(this.planningForm.controls["dateDebut"].value).toDate(),
       dateFin: moment(this.planningForm.controls["dateFin"].value).toDate(),
       cout: Number(this.planningForm.controls["cout"].value),
       professeurId: Number(this.planningForm.controls["professeur"].value),
       formationId: Number(this.planningForm.controls["formation"].value),
        moduleProfesseurDtos: this.moduleProfList
      };
      this.subscriptions.push(
        this.seminaireService.addPlanning(planningRequest).subscribe(
          (success: any) => {
            this.seminaireService.notifAddFormSubject.next(
              {
                name: 'update_list',
                page: 0
              }
            );
            this.alertService.success('Planning enregistrer avec succès');
            this.cancel();
          }, (error: any) => {
            this.alertService.error('Echec de l\'opération');
          }
        )
      );
    }
  }

  cancel() {
    this.planningForm.reset();
    this.planningEdit = new PlanningFormationModel();
    this.moduleProfList = [];
    this.selectedFormation = 0;
    this.selectedModule = 0;
    this.selectedProf = 0;
  }

  editPlannig() {
    if (this.planningForm.valid && this.planningEdit && this.planningEdit.id && this.moduleProfList.length > 0) {
      const planningRequest = {
        id: this.planningEdit.id,
        libelle: this.planningForm.controls["libelle"].value,
        dateDebut: moment(this.planningForm.controls["dateDebut"].value).toDate(),
        dateFin: moment(this.planningForm.controls["dateFin"].value).toDate(),
        cout: Number(this.planningForm.controls["cout"].value),
        professeurId: Number(this.planningForm.controls["professeur"].value),
        formationId: Number(this.planningForm.controls["formation"].value),
        moduleProfesseurDtos: this.moduleProfList
      };
      this.subscriptions.push(
        this.seminaireService.editPlanning(planningRequest).subscribe(
          (success: any) => {
            this.seminaireService.notifAddFormSubject.next(
              {
                name: 'update_list',
                page: 0
              }
            );
            this.alertService.success('Planning modifié avec succès');
            this.cancel();
          }, (error: any) => {
            this.alertService.error('Echec de l\'opération');
          }
        )
      );
    }
  }

  getModulePlanningByPlanningId(planningId: number) {

    this.subscriptions.push(
        this.seminaireService.getModulePllaningByPlanningId(this.planningEdit.id).subscribe(
            (data: any) => {
              this.moduleProfList = data;
              this.moduleProfList.forEach(mp => mp.code = uuid());
            }, (error) => console.log(error)
        )
    );
  }

  addModuleProf() {
    const module = this.modules.find(module => module.id === Number(this.planningForm.controls['module'].value));
    const professeur = this.professeurs.find(prof => prof.id === Number(this.planningForm.controls['professeur'].value));
    if (module && professeur) {
      const moduleProf = new ModuleProfesseurModel();
      moduleProf.module = module;
      moduleProf.professeur = professeur;
      if (this.checkItemExist(moduleProf)) {
        this.alertService.error('Cette affectation existe déja');
      } else {
        moduleProf.code = uuid();
        this.moduleProfList.push(moduleProf);
      }
    } else {
      this.alertService.error('Veuillez selectionner un module et un professeur');
    }
  }

  deleteItemFromList(moduleProf: ModuleProfesseurModel) {
    this.moduleProfList = this.moduleProfList.filter(md => moduleProf.code !== md.code)
  }
  checkItemExist(moduleProf: ModuleProfesseurModel) {
    for (let md of this.moduleProfList) {
      if (md.module?.id === moduleProf.module?.id && md.professeur?.id === moduleProf.professeur?.id) {
        return true;
      }
    }
    return false;
  }

  onChangeFormation(event: Event) {
    this.getModulesByFormation(Number(this.planningForm.controls['formation'].value));
  }
}
