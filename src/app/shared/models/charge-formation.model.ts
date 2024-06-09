import { ChargeFixeModel } from "./charge-fixe.model";
import { PlanningFormationModel } from "./planning-formation.model";

export class ChargeFormationModel {
  public id!: number;
  public date!: Date;
  public montantPayer!: number;
  public montantAPayer!: number;
  public montantRestant!: number;
  public archive!: boolean;
  public chargeFixe!: ChargeFixeModel;
  public planning!: PlanningFormationModel;
}
