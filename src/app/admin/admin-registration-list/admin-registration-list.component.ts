import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';
import { SharedService } from 'src/app/service/shared.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as FileSaver from 'file-saver';
import { Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-admin-registration-list',
  templateUrl: './admin-registration-list.component.html',
  styleUrls: ['./admin-registration-list.component.css']
})
export class AdminRegistrationListComponent {
  headerBox: boolean = true;
  siteSearch: boolean = false
  panelOpenState = false;
  reg_data: any;
  base_url: any
  reg_filter_data: any;
  deletevalue: any;

  constructor(
    private _dialog: MatDialog,
    private _crud: CrudService,
    private _shared: SharedService,
    private _router: Router
  ) {

  }
  ngOnInit(): void {
    this._shared.base_img_url.subscribe(
      (res: any) => {
        this.base_url = res
      }
    )
    this._crud.get_registration_list().subscribe(
      (res: any) => {
        console.log(res);
        this.reg_data = res
        this.reg_filter_data = res
      }
    )
  }
  onHeaderBox() {
    this.headerBox = !this.headerBox;
    this.siteSearch = !this.siteSearch;
  }
  onSiteSearch() {
    this.headerBox = !this.headerBox;
    this.siteSearch = !this.siteSearch;
    this._crud.get_registration_list().subscribe(
      (res: any) => {
        console.log(res);
        this.reg_data = res
      }
    )
  }
  onRegEdit(data: any) {
    console.log(data);
    this._shared.shared_details.next(data)
    this._router.navigate(['/admin/registrationupdate'])
  }

  // for generate excel file here 
  excel() {
    let serialNo = 1;
    const data = this.reg_data.map((reg: any) => ({
      'Serial No.': serialNo++,
      'Name': reg.name,
      'Mobile': reg.Mobile,
      'Email': reg.Email,
      'Gender': reg.Gender,
      'Jati Name': reg.Jati_name,
      'Category Name': reg.category_name,
      'Party Name': reg.Party_name,
      'Car No': reg.car_no,
      'Weapon No': reg.Weapon_no,
      'City': reg.City,
      'Block': reg.Block,
      'Janpath Name': reg.Janpath_name,
      'Vidhansabha Name': reg.Vidhansabha_name,
      'Loksabha Name': reg.Loksabha_name,
      'Address': reg.Address,
      'Description': reg.Description,
    }));
    try {
      this.downloadExcel(data)
      this._shared.tostSuccessBottom("Excel download successfully")
    }
    catch {
      this._shared.tostErrorBottom("Excel not download")
    }
  }

  downloadExcel(data: any[]): void {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      ws['!cols'] = [{ width: 10 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 20 }, { width: 20 }];
      ws['!rows'] = [{ hpt: 20 }, { hpt: 20 }, { hpt: 20 }];
      ws['A1'].s = { font: { bold: true }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: 'FFFF00' } } };

      const excelBuffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Report.xlsx');
    } catch (error) {
      this._shared.tostErrorBottom("Data not found");
    }
  }




  onDelete(data: any): void { }


  onListSearch(filter: string) {
    this.reg_data = this.reg_filter_data.filter((data: any) => {
      if (data.fullname.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        return true;
      }

      if (data.Mobile.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        return true;
      }
      if (data.Alternatemobile.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        return true;
      }
      if (data.Email.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        return true;
      }
      if (data.Designation_name.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        return true;
      }
      if (data.Department_name.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        return true;
      }
      if (data.SubDept_name.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        return true;
      }
      if (data.Statename.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        return true;
      }
      if (data.City_name.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        return true;
      }
      if (data.AadharNo.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        return true;
      }
      if (data.PanNo.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        return true;
      }
      return false;
    }
    );
  }
}
