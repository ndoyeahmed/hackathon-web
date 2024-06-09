export class EmployeResponseModel {
  public id!: number;
  public firstname!: string;
  public lastname!: string;
  public email!: string;
  public telephone!: string;
  public adresse!: string;
  public deleteAction = false;
  public dateDebut!: any;
  public dateFin!: any;
  public idContrat!: number;
  public salaireBrut!: number;
  public salaireNet!: number;
  public pourcentageRetenue!: number;
  public retenue!: number;
  public indemniteTransport!: number;
  public prime!: number;
}
