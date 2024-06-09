export class DepenseDTO {
  public id!: number;
  public date!: Date;
  public montant!: number;
  public depenseID!: number;
  public libelleDepense!: string;
  public planningID!: number;
  public archive!: boolean;
  public archiveDepense!: boolean;
  public deleteAction = false;
}
