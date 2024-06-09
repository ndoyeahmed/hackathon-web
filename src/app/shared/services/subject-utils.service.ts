import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Alert } from '../models/alert';

@Injectable({
  providedIn: 'root'
})
export class SubjectUtilsService {
  alertSubject = new Subject<Alert>();
  constructor() { }
}
