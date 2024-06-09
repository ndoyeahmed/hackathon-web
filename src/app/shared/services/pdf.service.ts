import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';
import {Content, StyleDictionary, TDocumentDefinitions} from "pdfmake/interfaces";

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: 'root'
})
export class PdfService {
  urlImage: any;
  recuPageSize = 300;

  constructor(private http: HttpClient) {
    this.getImageFromAsset();
  }

  async getImageFromAsset() {
    // await this.http.get('assets/images/logo.jpg', { responseType: 'blob' })
    await this.http.get('/assets/image/entete.jpeg', { responseType: 'blob' })
      .toPromise().then((res: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          this.urlImage = '' + base64data;
          localStorage.setItem('urlImage', this.urlImage);
        }

        reader.readAsDataURL(res);
      }).catch(error => {
        console.log(error);
      });
  }

  formatDate(date: any) {
    return moment(date).format('DD/MM/YYYY');
  }

  getHeader() {
    return {
      margin: [0, 0, 0, 0],
          columns: [
      {
        // if you specify both width and height - image will be stretched
        image: 'logo',
        fit: [100, 100],
        width: 50,
      },
      {
        margin: [10, 0, 0, 0],
        stack: [
          {text: "Groupe de Recherche d'Informations Fiables (GRIF)", style: 'enteteBold'},
          {text: "Scat Urbam (Allées Camp Pénal - derrière Auchan)", style: 'entete'},
          {text: "www.grifsn.com / grifsn2@gmail.com", style: 'entete'},
          {text: "Tel : 78 752 99 14 / 76 952 01 78 / 33 846 48 68", style: 'entete'},
          {text: "RC SN.DKR.2021.A.052 NINEA 008285084", style: 'entete'},
        ]
      }
    ]
    } as Content;
  }

  getStyles() {
    return {
      factureStyle: {
        fontSize: 15,
        bold: true,
        alignment: 'center',
        decoration: 'underline'
      },
      headerBold: {
        fontSize: 13,
        bold: true,
        alignment: 'center',
      },
      enteteBold: {
        fontSize: 13,
        bold: true,
        alignment: 'center',
      },
      headerBoldRecu: {
        fontSize: 13,
        bold: true
      },
      header: {
        fontSize: 13,
        bold: true,
        alignment: 'center',
        color: '#717070'
      },
      entete: {
        fontSize: 13,
        bold: true,
        alignment: 'center',
        color: '#717070'
      },
      headerSimple: {
        fontSize: 13,
        bold: true,
        color: '#717070'
      },

      title:{
        fontSize: 11,
        bold: false,
        italics: true
      },
      normal:{
        fontSize: 12
      },
      totalamount:{
        fontSize: 12,
        alignment: 'center'
      },
      bottom_title:{
        fontSize: 10,
        bold: true,
        italics: true
      },
      tables: {
        fontSize: 11
      },
      headers: {
        fontSize: 11,
        bold: true
      }
    } as StyleDictionary;
  }
  async generateTable(param:string, data: any[], columns: any[], title: string) {
    const url = localStorage.getItem('urlImage');
    if (this.urlImage) {
      const docDefinition: TDocumentDefinitions = {

        content: [
          this.getHeader(),
          {
            margin: [0, 20, 0, 50],
            canvas: [
              {
                type: 'line',
                x1: -500, y1: 0,
                x2: 1000, y2: 0,
                lineWidth: 1
              }
            ]
          },
          {
            margin: [0, 0, 0, 30],
            text: title,
            style: 'factureStyle'
          },
          this.table(data, columns),
        ],
        pageOrientation: 'portrait',
        images: {
          logo: url ?? ''
        },
        styles: this.getStyles()
      };

      const filename = title + moment() + '.pdf'

      if (param == 'download') {
        pdfMake.createPdf(docDefinition).download(filename);
      }else if(param == 'print'){
        pdfMake.createPdf(docDefinition).print();

      }
    }
  }

  buildTableBody(data: any[], columns: any[]) {
    let body = [];

    body.push(columns);

    data.forEach(function(row) {
      const dataRow: any[] = [];

      columns.forEach(function(column) {
        dataRow.push(row[column] ? row[column].toString() : '');
      })

      body.push(dataRow);
    });

    return body;
  }

  table(data: any[], columns: any[]) {
    const widths: string[] = [];
    columns.forEach((col) => {
      widths.push((100/columns.length) + '%');
    })
    return {
      width: '*',
      table: {
        headerRows: 1,
        widths: widths,
        body: this.buildTableBody(data, columns)
      }
    };
  }

  async generateRecu( data: any, reglements: any[], columns: any[], param:string = 'print') {
    const url = localStorage.getItem('urlImage');
    if (this.urlImage) {
      const docDefinition: TDocumentDefinitions = {

        content: [
          this.getHeader(),
          {
            margin: [0, 20, 0, 50],
            canvas: [
              {
                type: 'line',
                x1: -500, y1: 0,
                x2: 1000, y2: 0,
                lineWidth: 1
              }
            ]
          },
          {
            margin: [0, 0, 0, 30],
            text: 'Reçu de Paiement',
            style: 'factureStyle'
          },
          {
            text: 'Date : ' + this.formatDate(data.date),
            alignment: 'right',
            style: 'title'
          },
          {
            margin: [0, 0, 0, 30],
            stack: [
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Professeur: ', style: 'headerBold', width: 'auto'}, {text: data.professeur.nom + ' ' + data.professeur.prenom, style: 'header'}], columnGap: 1
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Formation: ', style: 'headerBold', width: 'auto'}, {text: data.planningFormation.formation.libelle, style: 'header'}], columnGap: 1
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Montant par heure: ', style: 'headerBold', width: 'auto'}, {text: data.montantHeure, style: 'header'}], columnGap: 1
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Montant à Payer: ', style: 'headerBold', width: 'auto'}, {text: data.honoraireNet, style: 'header'}], columnGap: 1
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Montant Restant: ', style: 'headerBold', width: 'auto'}, {text: data.restant, style: 'header'}], columnGap: 1
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Montant Avancé: ', style: 'headerBold', width: 'auto'}, {text: data.avance, style: 'header'}], columnGap: 1
              }
            ]
          },
          this.table(reglements, columns)


        ],
        pageOrientation: 'portrait',
        images: {
          logo: url ?? ''
        },
        styles:{
          factureStyle: {
            fontSize: 15,
            bold: true,
            alignment: 'center',
            decoration: 'underline'
          },
          headerBold: {
            fontSize: 13,
            bold: true,
          },
          enteteBold: {
            fontSize: 13,
            bold: true,
            alignment: 'center',
          },
          header: {
            fontSize: 13
          },
          entete: {
            fontSize: 13,
            bold: true,
            alignment: 'center',
            color: '#717070'
          },
          title:{
            fontSize: 11,
            bold: false,
            italics: true
          }
        }
      };

      const filename = 'recu_paiement' + moment() + '.pdf'

      if (param == 'download') {
        pdfMake.createPdf(docDefinition).download(filename);
      }else if(param == 'print'){
        pdfMake.createPdf(docDefinition).print();

      }
    }
  }

  async generateFactureApprenant( data: any, reglements: any[], columns: any[], title: string, param:string = 'print',) {
    const url = localStorage.getItem('urlImage');
    if (this.urlImage) {
      const docDefinition: TDocumentDefinitions = {

        content: [
          this.getHeader(),
          {
            margin: [0, 20, 0, 50],
            canvas: [
              {
                type: 'line',
                x1: -500, y1: 0,
                x2: 1000, y2: 0,
                lineWidth: 1
              }
            ]
          },
          {
            margin: [0, 0, 0, 30],
            text: title,
            style: 'factureStyle'
          },
          {
            text: 'Générer à la date du : ' + this.formatDate(new Date()),
            alignment: 'right',
            style: 'title'
          },
          {
            margin: [0, 0, 0, 30],
            stack: [
              {
                margin: [0, 0, 0, 10],
                columns: [
                  {text: 'Nom & Prénom: ', style: 'headerBoldRecu', width: 150},
                  {text: data.nom + ' ' + data.prenom, style: 'headerSimple'}
                ], columnGap: 0
              },
              {
                margin: [0, 0, 0, 10],
                columns: [
                  {text: 'Formation: ', style: 'headerBoldRecu', width: 150},
                  {text: data.formation, style: 'headerSimple'},
                ], columnGap: 0
              },
              {
                margin: [0, 0, 0, 10],
                columns: [
                  {text: 'Cout de la formation: ', style: 'headerBoldRecu', width: 150},
                  {text: data.coutFormation, style: 'headerSimple'}
                ], columnGap: 0
              },
              {
                margin: [0, 0, 0, 10],
                columns: [
                  {text: 'Total versé: ', style: 'headerBoldRecu', width: 150},
                  {text: data.totalVerse, style: 'headerSimple'},
                ], columnGap: 0
              },
              {
                margin: [0, 0, 0, 10],
                columns: [
                  {text: 'Total Restant: ', style: 'headerBoldRecu', width: 150},
                  {text: data.totalRestant, style: 'headerSimple'}
                ], columnGap: 0
              }
            ]
          },
          this.table(reglements, columns),
        ],
        pageOrientation: 'portrait',
        images: {
          logo: url ?? ''
        },
        styles: this.getStyles()
      };

      const filename = 'recu_paiement' + moment() + '.pdf'

      if (param == 'download') {
        pdfMake.createPdf(docDefinition).download(filename);
      }else if(param == 'print'){
        pdfMake.createPdf(docDefinition).print();

      }
    }
  }
  async generateHistoriqueFactureSalaire( data: any, reglements: any[], columns: any[], param:string = 'print') {
    const url = localStorage.getItem('urlImage');
    if (this.urlImage) {
      const docDefinition: TDocumentDefinitions = {

        content: [
          this.getHeader(),
          {
            margin: [0, 20, 0, 50],
            canvas: [
              {
                type: 'line',
                x1: -500, y1: 0,
                x2: 1000, y2: 0,
                lineWidth: 1
              }
            ]
          },
          {
            margin: [0, 0, 0, 30],
            text: 'Historique des Paiement',
            style: 'factureStyle'
          },
          {
            margin: [0, 0, 0, 30],
            text: 'Date : ' + this.formatDate(data.date),
            alignment: 'right',
            style: 'title'
          },
          {
            margin: [0, 0, 0, 30],
            stack: [
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Nom & Prénom: ', style: 'headerBold', width: 'auto'}, {text: data.firstname + ' ' + data.lastname, style: 'header'}], columnGap: 30
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Date: ', style: 'headerBold', width: 'auto'}, {text: this.formatDate(data.date), style: 'header'}], columnGap: 30
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Salaire Brut: ', style: 'headerBold', width: 'auto'}, {text: data.salaireBrut + ' FCFA', style: 'header'}], columnGap: 30
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Indemnité: ', style: 'headerBold', width: 'auto'}, {text: data.indemniteTransport + ' FCFA', style: 'header'}], columnGap: 30
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Retenue: ', style: 'headerBold', width: 'auto'}, {text: data.retenue + ' FCFA', style: 'header'}], columnGap: 30
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Prime: ', style: 'headerBold', width: 'auto'}, {text: data.prime + ' FCFA', style: 'header'}], columnGap: 30
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Net à payer: ', style: 'headerBold', width: 'auto'}, {text: data.salaireNet + ' FCFA', style: 'header'}], columnGap: 30
              }
            ]
          },
          this.table(reglements, columns)


        ],
        pageOrientation: 'portrait',
        images: {
          logo: url ?? ''
        },
        styles:{
          factureStyle: {
            fontSize: 15,
            bold: true,
            alignment: 'center',
            decoration: 'underline'
          },
          headerBold: {
            fontSize: 13,
            bold: true,
          },
          enteteBold: {
            fontSize: 13,
            bold: true,
            alignment: 'center',
          },
          header: {
            fontSize: 13,
            alignment: 'right'
          },
          entete: {
            fontSize: 13,
            bold: true,
            alignment: 'center',
            color: '#717070'
          },
          title:{
            fontSize: 11,
            bold: false,
            italics: true
          }
        }
      };

      const filename = 'recu_paiement' + moment() + '.pdf'

      if (param == 'download') {
        pdfMake.createPdf(docDefinition).download(filename);
      }else if(param == 'print'){
        pdfMake.createPdf(docDefinition).print();

      }
    }
  }
  async generateFactureSalaire( data: any, param:string = 'print') {
    const url = localStorage.getItem('urlImage');
    if (this.urlImage) {
      const docDefinition: TDocumentDefinitions = {

        content: [
          this.getHeader(),
          {
            margin: [0, 20, 0, 50],
            canvas: [
              {
                type: 'line',
                x1: -500, y1: 0,
                x2: 1000, y2: 0,
                lineWidth: 1
              }
            ]
          },
          {
            margin: [0, 0, 0, 30],
            text: 'Reçu Paiement',
            style: 'factureStyle'
          },
          {
            margin: [0, 0, 0, 30],
            text: 'Date : ' + this.formatDate(data.date),
            alignment: 'right',
            style: 'title'
          },
          {
            margin: [0, 0, 0, 30],
            stack: [
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Nom & Prénom: ', style: 'headerBold', width: 'auto'}, {text: data.contrat.firstname + ' ' + data.contrat.lastname, style: 'header'}], columnGap: 30
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Date ', style: 'headerBold', width: 'auto'}, {text: this.formatDate(data.date), style: 'header'}], columnGap: 30
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Salaire Brut: ', style: 'headerBold', width: 'auto'}, {text: data.contrat.salaireBrut + ' FCFA', style: 'header'}], columnGap: 30
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Indemnité: ', style: 'headerBold', width: 'auto'}, {text: data.contrat.indemniteTransport + ' FCFA', style: 'header'}], columnGap: 30
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Retenue: ', style: 'headerBold', width: 'auto'}, {text: data.contrat.retenue + ' FCFA', style: 'header'}], columnGap: 30
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Prime: ', style: 'headerBold', width: 'auto'}, {text: data.contrat.prime + ' FCFA', style: 'header'}], columnGap: 30
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Net à payer: ', style: 'headerBold', width: 'auto'}, {text: data.contrat.salaireNet + ' FCFA', style: 'header'}], columnGap: 30
              },
              {
                margin: [0, 0, 0, 30],
                columns: [{text: 'Montant versé: ', style: 'headerBold', width: 'auto'}, {text: data.montant + ' FCFA', style: 'header'}], columnGap: 30
              }
            ]
          }
        ],
        pageOrientation: 'portrait',
        images: {
          logo: url ?? ''
        },
        styles:{
          factureStyle: {
            fontSize: 15,
            bold: true,
            alignment: 'center',
            decoration: 'underline'
          },
          headerBold: {
            fontSize: 13,
            bold: true,
          },
          enteteBold: {
            fontSize: 13,
            bold: true,
            alignment: 'center',
          },
          header: {
            fontSize: 13,
            alignment: 'right'
          },
          entete: {
            fontSize: 13,
            bold: true,
            alignment: 'center',
            color: '#717070'
          },
          title:{
            fontSize: 11,
            bold: false,
            italics: true
          }
        }
      };

      const filename = 'recu_paiement' + moment() + '.pdf'

      if (param == 'download') {
        pdfMake.createPdf(docDefinition).download(filename);
      }else if(param == 'print'){
        pdfMake.createPdf(docDefinition).print();

      }
    }
  }
}
