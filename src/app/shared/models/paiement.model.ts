import { InscriptionModel } from "./inscription.model";

export class PaiementModel {
  public id!: number;
  public avance!: number;
  public reliquat!: number;
  public total!: number;
  public inscription!: InscriptionModel;
  public archive!: boolean;
}
