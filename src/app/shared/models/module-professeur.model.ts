import {ProfesseurModel} from "./professeur.model";
import {ModuleDtoModel} from "./module-dto.model";

export class ModuleProfesseurModel {
  public code?: string;
  public module?: ModuleDtoModel;
  public professeur?: ProfesseurModel;
}
