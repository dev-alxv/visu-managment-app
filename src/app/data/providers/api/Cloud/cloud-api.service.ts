import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiConfig } from "../api.config";
import { ICloudFileDescription } from "src/app/data/interfaces/descriptions/api/common/description";

@Injectable({
  providedIn: 'root'
})
export class CloudApiService {

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfig
  ) { }

  public upload(uploadData: File[]): Observable<ICloudFileDescription[]> {

    const formData = new FormData();

    const uploadFilesRequestUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Upload_Files_To_Cloud' });

    for (const file of uploadData) {
      formData.append('files', file);
    }

    return this.http.post<ICloudFileDescription[]>(uploadFilesRequestUrl.href, formData);
  }
}
