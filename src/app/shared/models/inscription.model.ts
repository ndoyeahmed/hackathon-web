import { ApprenantModel } from "./apprenant.model";
import { PlanningFormationModel } from "./planning-formation.model";

export class InscriptionModel {
  public id!: number;
  public date!: Date;
  public apprenant!: ApprenantModel;
  public planning!: PlanningFormationModel;
  public archive!: boolean;
}
