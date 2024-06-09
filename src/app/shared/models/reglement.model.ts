import { PaiementModel } from "./paiement.model";

export class ReglementModel {
  public id!: number;
  public date!: Date;
  public montant!: number;
  public paiement!: PaiementModel;
  public archive!: boolean;
  public deleteAction = false;
}
