import { StatistiqueDTO } from './../../shared/models/statistique-dto.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { ComptabiliteService } from '../services/comptabilite.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  subscriptions = [] as Subscription[];
  selectedFiltre = 'jour';
  searchForm!: FormGroup;
  moisList = [
    {id: '01', name: 'Janvier'},
    {id: '02', name: 'Février'},
    {id: '03', name: 'Mars'},
    {id: '04', name: 'Avril'},
    {id: '05', name: 'Mai'},
    {id: '06', name: 'Juin'},
    {id: '07', name: 'Juillet'},
    {id: '08', name: 'Aout'},
    {id: '09', name: 'Septembre'},
    {id: '10', name: 'Octobre'},
    {id: '11', name: 'Novembre'},
    {id: '12', name: 'Décembre'},
  ];

  annees = [] as number[];
  annee = '';
  moisDebut = 0;
  moisFin = 0;
  dateDebut = '';
  dateFin = '';

  statistiqueDto = new StatistiqueDTO();

  constructor(
    private comptaService: ComptabiliteService
  ) {
    this.initSearchForm();
  }

  ngOnInit(): void {
    this.getStatistique(this.dateDebut, this.dateFin);
    const anneeEnCours = Number(moment().year());
    this.annees.push(anneeEnCours);
    for (let i = 1; i <= 10; i++) {
      if (i === 1) {
        this.annees.push(anneeEnCours-1);
      } else {
        this.annees.push(anneeEnCours - i);
      }
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getStatistique(dateDebut: string, dateFin: string) {
    this.subscriptions.push(
      this.comptaService.getStatistiques(dateDebut, dateFin).subscribe(
        (data: any) => {
          this.statistiqueDto = data as StatistiqueDTO;
        }, (error) => console.log(error)
      )
    );
  }

  initSearchForm() {
    this.searchForm = new FormGroup({
      'filterType': new FormControl(this.selectedFiltre, [Validators.required]),
      'dateDebut': new FormControl(null, [Validators.required]),
      'dateFin': new FormControl(null, [Validators.required]),
      'moisDebut': new FormControl(null, [Validators.required]),
      'moisFin': new FormControl(null, [Validators.required]),
      'annee': new FormControl(null, [Validators.required]),
    });
  }

  onChangeFilterType(event: any) {
    this.searchForm.controls['filterType'].setValue(event.target.value);
    this.selectedFiltre = event.target.value;
  }

  search() {
    if (this.selectedFiltre === 'jour') {
      if (this.searchForm.controls['dateDebut'].value && this.searchForm.controls['dateFin'].value) {
        this.dateDebut = moment(this.searchForm.controls['dateDebut'].value).format('YYYY-MM-DD');
        this.dateFin = moment(this.searchForm.controls['dateFin'].value).format('YYYY-MM-DD');
        this.filterByDays(this.dateDebut, this.dateFin);
      } else {
        // this.toastService.showErrorToast('Erreur', 'Veuillez choisir les deux dates debut et fin SVP');
      }

    } else if (this.selectedFiltre === 'mois') {
      if (this.searchForm.controls['moisDebut'].value && this.searchForm.controls['moisFin'].value) {
        this.moisDebut = Number(this.searchForm.controls['moisDebut'].value);
        this.moisFin = Number(this.searchForm.controls['moisFin'].value);
        this.filterByMonth(this.moisDebut, this.moisFin);
      } else {
        // this.toastService.showErrorToast('Erreur', 'Veuillez choisir les deux dates debut et fin SVP');
      }
    } else if (this.selectedFiltre === 'annee') {
      if (this.searchForm.controls['annee'].value) {
        this.annee = this.searchForm.controls['annee'].value;
        this.filterByYear(this.annee);
      } else {
        // this.toastService.showErrorToast('Erreur', 'Veuillez choisir une année SVP');
      }
    } else {
      // console.log('default days');
    }
  }

  filterByDays(dateDebut: string, dateFin: string) {
    this.getStatistique(dateDebut, dateFin);
  }

  filterByMonth(mois1: number, mois2: number) {
    const year = moment().year();
    const dateDebut = moment(year + '-' + mois1 + '-' + this.getLastDateByMois(mois1, year)).format('YYYY-MM-DD');
    const dateFin = moment(year + '-' + mois2 + '-01').format('YYYY-MM-DD');
    this.getStatistique(dateDebut, dateFin);
  }

  filterByYear(year: string) {
    const dateFin = moment(year + '-' + '12-31').format('YYYY-MM-DD');
    const dateDebut = moment(year + '-' + '01-01').format('YYYY-MM-DD');
    this.getStatistique(dateDebut, dateFin);
  }

  getLastDateByMois(mois: number, year: number) {
    switch(mois) {
      case 1: case 3: case 5: case 7: case 8: case 10: case 12:
        return 31;
      case 4: case 6: case 9: case 11:
          return 30;
      case 2:
        if (year%400 === 0 || (year%100 !== 0 && year%4 === 0)) {
          return 29;
        } else {
          return 28;
        }
      default: return 0;
    }
  }

  getMonthNameByMonthId(m: string) {
    let moisName = '';
    this.moisList.forEach(mois => {
      if (mois.id === m) {
        moisName = mois.name;
      }
    });
    return moisName;
  }
}
