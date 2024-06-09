export class PlanningDtoModel {
  public id!: number;
  public cout!: number;
  public libelle!: string;
  public dateDebut!: Date;
  public dateFin!: Date;
  public formation!: string;
  public formationId!: number;
  public nomProf!: string;
  public prenomProf!: string;
  public professeurId!: number;
  public archive!: boolean;
  public deleteAction = false;
}
