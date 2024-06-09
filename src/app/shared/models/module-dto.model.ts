import {FormationModel} from "./formation.model";

export class ModuleDtoModel {
  public id!: number;
  public libelle!: string;
  public archive!: boolean;
  public formation!: FormationModel;
  public deleteAction = false;
}
