import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ITableData } from "../../interfaces/itable-data";
import { MatPaginator } from '@angular/material/paginator';
import { TableDataService } from '../../services/table-data.service';
// import { Ma} from '@angular/material/'
import { IResponseData } from "./../../interfaces/iresponse-data";
import { debounceTime, filter } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { IProfileData } from '../../interfaces/iprofile-data';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  //FormGroup and MatTable
  tableForm: FormGroup;
  profileForm: FormGroup;
  tableData = new MatTableDataSource<ITableData>();
  displayedColumns: string[] = ['episodeId', 'title', 'openingCrawl', 'director', 'producer', 'releaseDate'];
  
  datePipe: DatePipe;
  isProfileVisible: boolean = false;
  profileDetails: IProfileData;
  isProfileEditing: boolean = false;
  isDateSet: boolean = false;
  imgURL: any;
  imageEditing: boolean = false;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private tableDataService: TableDataService, private formBuilder: FormBuilder, private commonService: CommonService) { }

  ngOnInit() {
    this.datePipe = new DatePipe('en');
    this.imgURL = "assets/images/penguine.jpeg";

    this.tableForm = this.formBuilder.group({
      filterInput: [],
      fromDate: new FormControl(),
      toDate: new FormControl()
    })

    this.profileForm = this.formBuilder.group({
      name: new FormControl(),
      email: new FormControl(),
      phoneNo: new FormControl()
    })
    
    this.getData();
  }

  /**
   * To get Profile and Table data into the component
   */
  getData(){
    this.commonService.showSpinner();
    this.tableDataService.fetchTableData().subscribe((res: IResponseData) => {
        console.log('api data ', res);
        const result = res.results.map((data: ITableData) => {
          const {title, episode_id, director, producer} = data;
          const release_date = new Date(data.release_date);
          const opening_crawl = data.opening_crawl.slice(0, 70);
          return {title, episode_id, opening_crawl, director, producer, release_date};
        })
        console.log('modified table data', result);
        this.commonService.hideSpinner();
        this.createTable(result);
    }, error => {
      //create error handling
      console.log('error', error);
    });

    this.tableDataService.fetchProfileData().subscribe((res: IProfileData) => {
      console.log('profile data ', res);
      this.profileDetails = res;
      this.profileForm.patchValue({
        name: res.name,
        email: res.email,
        phoneNo: res.phone_no
      });
    }, error => {
      console.log('profile error ', error);
    })
  }

  /**
   * Getter for fromDate field
   */
  get fromDate(){
    return this.tableForm.get('fromDate').value;
  }

  /**
   * Getter for toDate field
   */
  get toDate(){
    return this.tableForm.get('toDate').value;
  }

  /**
   * Used to set Date Filter on Click od Submit Button
   */
  applyDateFilter(){
    // console.log('submit0');
    if(this.toDate && this.fromDate){
      this.isDateSet = true;
      this.tableData.filter = this.commonService.dateFilterCode;
    }
    else{
      this.commonService.openSnackBar('Please Fill Both Dates', 'error');
    }
  }

  /**
   * Fill Table Data and handle its filterPredicate
   * @param data Table data
   */
  createTable(data: ITableData[]){
    this.tableData.data = data;
    this.tableData.paginator = this.paginator;

    this.tableForm.controls.filterInput.valueChanges
      .pipe(debounceTime(100))
      .subscribe(res => {
        // console.log('search log', res);
        if(res !== ''){
          this.tableData.filter = res;
        }
        else if(this.isDateSet === true){
          this.tableData.filter = this.commonService.dateFilterCode;
        }
      })

    this.tableData.filterPredicate = (data, filter) => {
      console.log('data', data);
      console.log('filter', filter);
      const wholeData = JSON.stringify(data);
      if(filter === this.commonService.dateFilterCode){ //only date
        console.log('only date');
        return data.release_date >= this.fromDate && data.release_date <= this.toDate;
      }
      else if(this.isDateSet === false){ //only search bar
        console.log('only search');
        return wholeData.toString().trim().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      }
      else{ //both search and date
        console.log('search and date');
        if(data.release_date >= this.fromDate && data.release_date <= this.toDate){
          return wholeData.toString().trim().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        }
        return false
      }
    }
  }

  /**
   * To Toggle Profile Tab between hide and show
   */
  toggleProfile(){
    this.isProfileVisible = !this.isProfileVisible;
  }

  /**
   * To edit profile details
   */
  toggleProfileEdit(){
    if(this.isProfileEditing == true){
      this.profileForm.patchValue({
        name: this.profileDetails.name,
        email: this.profileDetails.email,
        phoneNo: this.profileDetails.phone_no
      });
    }
    this.isProfileEditing = !this.isProfileEditing;
  }

  /**
   * Save/Close the Profile Detail Editing
   */
  saveProfileDetails(){
    this.isProfileEditing = false;
  }

  /**
   * Display Logic of Selcted File
   * @param files Selected File from Local
   */
  preview(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.message = "Only images are supported.";
      console.log('Only images are supported.');
      return;
    }
 
    var reader = new FileReader();
    // this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
      this.imageEditing = false
    }
  }

  /**
   * Toggle Image Edit between hide and show
   */
  toggleImageEdit(){
    this.imageEditing = !this.imageEditing;
  }

}

