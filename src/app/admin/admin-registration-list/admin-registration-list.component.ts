import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Directory, Filesystem } from '@capacitor/filesystem';
import write_blob from 'capacitor-blob-writer';
import { LocalNotifications } from '@capacitor/local-notifications';
import { FileOpener } from '@awesome-cordova-plugins/file-opener';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { CrudService } from 'src/app/service/crud.service';
const pdfMakeX = require('pdfmake/build/pdfmake');
const pdfFontsX = require('pdfmake/build/vfs_fonts');
pdfMakeX.vfs = pdfFontsX.pdfMake.vfs;

@Component({
  selector: 'app-admin-registration-list',
  templateUrl: './admin-registration-list.component.html',
  styleUrls: ['./admin-registration-list.component.css']
})
export class AdminRegistrationListComponent implements OnInit {
  reg_data: any;
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
  documentDefinition: any;
  constructor(
    private _Platform: Platform,
    private _crud: CrudService
  ) { }

  async ngOnInit() {
    this._crud.get_registration_list().subscribe(
      (res: any) => {
        console.log(res);
        this.reg_data = res;
      }
    )

    const granted = await LocalNotifications.requestPermissions();
    if (granted.display !== 'granted') {
      alert('Notifications permission not granted');
    }
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      const fileName = notification.notification.extra?.fileName;
      const fileType = notification.notification.extra?.fileType;
      if (fileName && fileType) {
        this.openFile(fileName, fileType);
      }
    });
  }

  async DownloadPDF() {
    try {
      this.documentDefinition = this.generateDocumentDefinition();
      const now = new Date();
      const timestamp = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
      const filename = `PDF_${timestamp}.pdf`;

      if (this._Platform.is('cordova') || this._Platform.is('mobile') || this._Platform.is('android')) {
        pdfMake.createPdf(this.documentDefinition).getBuffer(async (buffer: ArrayBuffer) => {
          await write_blob({
            path: filename,
            directory: Directory.Documents,
            blob: new Blob([buffer])
          });

          this.showNotification('PDF Downloaded', `Your PDF file ${filename} has been saved successfully.`, filename, 'application/pdf');
        });
      } else {
        pdfMake.createPdf(this.documentDefinition).download(filename);
        this.showNotification('PDF Downloaded', `Your PDF file ${filename} has been saved successfully.`, filename, 'application/pdf');
      }
    } catch (error) {
      alert("Error generating PDF");
    }
  }

  generateDocumentDefinition() {
    const content = [];
    content.push({ text: 'Registration Data', style: 'header' });
    content.push('\n');

    const tableHeaders = [
      { text: 'S.N.', style: 'tableHeader' },
      { text: 'Name', style: 'tableHeader' },
      { text: 'Mobile', style: 'tableHeader' },
      { text: 'Gender', style: 'tableHeader' },
    ];

    const tableBody = this.reg_data.map((reg: any, index: number) => [
      { text: (index + 1).toString(), style: 'tableBody' },
      { text: reg.name, style: 'tableBody' },
      { text: reg.Mobile, style: 'tableBody' },
      { text: reg.Gender, style: 'tableBody' },
    ]);

    const table = {
      headerRows: 1,
      widths: ['auto', '*', '*', '*'],
      body: [
        tableHeaders,
        ...tableBody
      ],
    };

    content.push({
      table: table,
      layout: 'lightHorizontalLines'
    });

    return {
      content: content,
      styles: {
        header: {
          fontSize: 20,
          bold: true
        },
        tableHeader: {
          bold: true,
          fontSize: 15,
          color: 'red'
        },
        tableBody: {
          fontSize: 15
        }
      },
      pageSize: 'A4',
      pageMargins: [10, 10, 10, 15],
    };
  }

  async showNotification(title: string, body: string, fileName: string, fileType: string) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id: 1,
          schedule: { at: new Date(Date.now() + 100) },
          sound: 'default',
          attachments: [],
          extra: { fileName, fileType }
        }
      ]
    });
  }

  async openFile(fileName: string, fileType: string) {
    try {
      const path = await Filesystem.getUri({
        directory: Directory.Documents,
        path: fileName
      });
      if (path && path.uri) {
        FileOpener.open(path.uri, fileType)
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error opening file' + JSON.stringify(e)));
      } else {
        alert('File path is null or undefined.');
      }
    } catch (error) {
      alert('Error retrieving file path:' + JSON.stringify(error));
    }
  }
}