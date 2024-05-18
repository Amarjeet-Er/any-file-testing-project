import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-admin-registration-update',
  templateUrl: './admin-registration-update.component.html',
  styleUrls: ['./admin-registration-update.component.css']
})
export class AdminRegistrationUpdateComponent {

  UpdateRegistration!: FormGroup;
  image_url1: any;
  onUpdateBtn = 'Update'

  onChangeImg: boolean = true
  onCameraOpen: boolean = true
  onCondition: boolean = false;
  onChooseImg: boolean = true;
  selectedImg: boolean = true;
  documentView1: boolean = true;
  documentView2: boolean = true;
  documentSelect1: boolean = true;
  documentSelect2: boolean = true;

  WIDTH = 200;
  HEIGHT = 200;
  @ViewChild("video") public video!: ElementRef;
  @ViewChild("canvas") public canvas!: ElementRef;
  captures: string[] = [];
  error: any;
  editReg: any;

  cameraimg: any
  galleryimg: any
  priviewimg: any = ''
  base_url: any;

  designation_data: any;
  department_data: any;
  state_data: any;
  subdepartment_data: any;
  city_data: any;
  deptId: any;
  stateId: any;

  Aadhar_select: any;
  Aadhar_img_url: any = "../../../assets/images/documents.jpg"

  PanCard_select: any;
  PanCard_img_url: any = "../../../assets/images/documents.jpg"

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _crud: CrudService,
    private _shared: SharedService
  ) { }

  ngOnInit(): void {
    this._shared.base_img_url.subscribe(
      (res: any) => {
        this.base_url = res
      }
    )
    this.UpdateRegistration = this._fb.group({
      Id: [''],
      Name: ['', Validators.required],
      SurName: ['', Validators.required],
      Mobile: ['', Validators.required],
      Alternatemobile: [''],
      Email: ['', Validators.required],
      Designation: ['', Validators.required],
      Department: ['', Validators.required],
      subDepartment: ['', Validators.required],
      State: ['', Validators.required],
      City: ['', Validators.required],
      AadharNo: ['', Validators.required],
      PanNo: ['', Validators.required],
      Registration_image: [''],
      Document: [''],
      Document2: [''],
    });

    // Fetch data needed for dropdowns
    this.fetchDropdownData();

    // Subscribe to shared details
    this._shared.shared_details.subscribe(
      (res: any) => {
        this.editReg = res;
        this.deptId = this.editReg.Department;
        this.stateId = this.editReg.State;
        this.UpdateRegistration.patchValue(this.editReg);
        this.get_filter_by_sub_department(this.deptId);
        this.get_filter_by_city(this.stateId);
      }
    );
  }

  ngAfterViewInit(): void {
    this.setupDevices();
  }

  fetchDropdownData(): void {
    this._crud.get_select_designation().subscribe((res: any) => { this.designation_data = res })
    this._crud.get_select_department().subscribe((res: any) => { this.department_data = res })
    this._crud.get_select_state().subscribe((res: any) => { this.state_data = res })
  }

  get_filter_by_sub_department(Deptid: string) {
    this._crud.get_select_sub_dept(Deptid).subscribe(
      (res: any) => {
        this.subdepartment_data = res;
      }
    )
  }
  get_filter_by_city(state_id: string) {
    this._crud.get_select_city(state_id).subscribe(
      (res: any) => {
        this.city_data = res;
      }
    )
  }

  CameraOpen(): void {
    this.onCameraOpen = false;
    this.onChangeImg = true;
    this.onCondition = true;
    this.onChooseImg = false;
    this.selectedImg = false
  }

  async setupDevices(): Promise<void> {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = "You have no output video device";
        }
      } catch (e) {
        this.error = e;
      }
    }
  }

  capture(): void {
    if (this.video.nativeElement.srcObject) {
      this.onChooseImg = false;
      this.onCameraOpen = true;
      this.onChangeImg = true;
      this.drawImageToCanvas(this.video.nativeElement);
      this.canvas.nativeElement.toBlob((blob: any) => {
        const captureImg = new File([blob], 'captured_image.png', { lastModified: Date.now(), type: 'image/png' });
        this.cameraimg = captureImg;
        this._shared.tostSuccessTop('Successfully captured image.');
      });
    } else {
      alert('Video stream not initialized.');
      console.error("Video stream not initialized.");
    }
  }

  drawImageToCanvas(image: any): void {
    this.onCameraOpen = true;
    this.onChangeImg = true;
    this.canvas.nativeElement.getContext("2d").drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }

  onGallery(files: any): void {
    this.onChooseImg = false;
    this.onCondition = false;
    this.onChangeImg = false;
    this.onCameraOpen = true;
    this.selectedImg = false

    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (!mimeType.match(/image\/*/)) {
      console.log('Only images are supported.');
      return;
    }

    const reader = new FileReader();
    this.galleryimg = files[0];
    reader.onload = () => {
      this.priviewimg = reader.result;
    };
    reader.readAsDataURL(this.galleryimg);
  }

  // for select Aadhar Card
  onAadhar(files: any) {
    this.documentSelect1 = false
    this.documentView1 = false
    let reader = new FileReader();
    this.Aadhar_select = files[0];
    reader.onload = () => {
      this.Aadhar_img_url = reader.result;
    };
    reader.readAsDataURL(this.Aadhar_select);
  }

  // for select Pan Card
  onPanCard(files: any) {
    this.documentSelect2 = false
    this.documentView2 = false
    let reader = new FileReader();
    this.PanCard_select = files[0];
    reader.onload = () => {
      this.PanCard_img_url = reader.result;
      console.log(this.PanCard_select);
    };
    reader.readAsDataURL(this.PanCard_select);
  }

  onUpdate(): void {
    const defaultContent = '';
    const defaultBlob = new Blob([defaultContent], { type: '' });
    const fileToUpload = new File([defaultBlob], '', { type: '' });

    console.log(fileToUpload);

    console.log(this.UpdateRegistration.value);
    const Updatedata = new FormData()
    Updatedata.append('Id', this.UpdateRegistration.get('Id')?.value);
    Updatedata.append('Name', this.UpdateRegistration.get('Name')?.value);
    Updatedata.append('SurName', this.UpdateRegistration.get('SurName')?.value);
    Updatedata.append('Mobile', this.UpdateRegistration.get('Mobile')?.value);
    Updatedata.append('Alternatemobile', this.UpdateRegistration.get('Alternatemobile')?.value);
    Updatedata.append('Email', this.UpdateRegistration.get('Email')?.value);
    Updatedata.append('Designation', this.UpdateRegistration.get('Designation')?.value);
    Updatedata.append('Department', this.UpdateRegistration.get('Department')?.value);
    Updatedata.append('subDepartment', this.UpdateRegistration.get('subDepartment')?.value);
    Updatedata.append('State', this.UpdateRegistration.get('State')?.value);
    Updatedata.append('City', this.UpdateRegistration.get('City')?.value);
    Updatedata.append('AadharNo', this.UpdateRegistration.get('AadharNo')?.value);
    Updatedata.append('PanNo', this.UpdateRegistration.get('PanNo')?.value);
    if (this.galleryimg) {
      Updatedata.append('Registration_image', this.galleryimg);
    } else if (this.cameraimg) {
      Updatedata.append('Registration_image', this.cameraimg);
    } else {

      Updatedata.append('Registration_image', fileToUpload);
    }

    if (this.Aadhar_select) {
      Updatedata.append('Document', this.Aadhar_select)
    } else {
      Updatedata.append('Document', fileToUpload);
    }

    if (this.PanCard_select) {
      Updatedata.append('Document2', this.PanCard_select)
    } else {
      Updatedata.append('Document2', fileToUpload)
    }

    if (this.UpdateRegistration.valid) {
      this._crud.put_reg_form(Updatedata).subscribe(
        (res: any) => {
          console.log(res);
          this._shared.tostSuccessTop('Update Successfully...');
          this._router.navigate(['/admin/registrationlist']);
        },
        (error: any) => {
          console.log(error);
          this._shared.tostErrorTop('Not Update');
        }
      );
    }
  }
}