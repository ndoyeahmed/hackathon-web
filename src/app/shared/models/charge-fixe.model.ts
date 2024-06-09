import { TypeChargeModel } from "./type-charge.model";

export class ChargeFixeModel {
  public id!: number;
  public montant!: number;
  public archive!: boolean;
  public deleteAction!: boolean;
  public date!: any;
  public typeChargeFixe!: TypeChargeModel
}
