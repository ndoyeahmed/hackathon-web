import { FormationProfesseurModel } from "./formation-professeur.model";

export class PaiementHonoraireModel {
  public id!: number;
  public avance!: number;
  public date!: Date;
  public montant!: number;
  public restant!: number;
  public archive!: boolean;
  public formationProfesseur!: FormationProfesseurModel;
}
