import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableDataService {

  constructor(private http: HttpClient) { }

  /**
   * To Fetch Table Data
   */
  fetchTableData(){
    return this.http.get(environment.api_url);
  }

  /**
   * To Fetch Profile Data
   */
  fetchProfileData(){
    return this.http.get(environment.profile_url);
  }
}
