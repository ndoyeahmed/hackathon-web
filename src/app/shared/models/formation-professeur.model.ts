import { PlanningFormationModel } from "./planning-formation.model";

export class FormationProfesseurModel {
  public id!: number;
  public date!: Date;
  public brs!: number;
  public honoraireBrut!: number;
  public honoraireNet!: number;
  public archive!: boolean;
  public nombreHeure!: number;
  public montantHeure!: number;
  public avance!: number;
  public restant!: number;
  public statut!: boolean;
  public planningFormation!: PlanningFormationModel;
}
