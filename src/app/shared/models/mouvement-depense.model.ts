import { DepenseModel } from "./depense.model";
import { PlanningFormationModel } from "./planning-formation.model";

export class MouvementDepenseModel {
  public id!: number;
  public date!: Date;
  public montant!: number;
  public depense!: DepenseModel;
  public planning!: PlanningFormationModel;
  public archive!: boolean;
}
