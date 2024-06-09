import { FormationProfesseurModel } from "./formation-professeur.model";
import { FormationModel } from "./formation.model";
import { ProfesseurModel } from "./professeur.model";

export class PlanningFormationModel {
  public id!: number;
  public cout!: number;
  public libelle!: string;
  public dateDebut!: Date;
  public dateFin!: Date;
  public formation!: FormationModel;
  public professeur!: ProfesseurModel;
  public archive!: boolean;
  public deleteAction = false;
}
