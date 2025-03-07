import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// Services
import { HttpService } from './http.service'


// Import envirnoment variable
import { environment } from '../../../environments/environment';

@Injectable()
export class FileService {
  

  private upadateuserprofile = environment.SERVER_URL + '/file/upload';
  constructor(
    private http: HttpService
  ) { }


  updateImage(user) {
    const body = JSON.stringify(user);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(this.upadateuserprofile, body, { headers: headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error.json()));
    
}
}
