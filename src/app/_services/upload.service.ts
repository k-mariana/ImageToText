import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UploadService {
  private baseApiUrl = 'https://api.api-ninjas.com/v1/imagetotext';
  private baseApiKey = '+vy5E2iQl6K5uGY1dszU4A==6kS9g6riDoKZn5oO';
 
  private httpClient = inject(HttpClient);

  upload(file: File):Observable<any> {
    const formData = new FormData(); 
    formData.append('image', file);

    return this.httpClient.post(this.baseApiUrl, formData, {
        headers: {
          'X-Api-Key': this.baseApiKey
        },
        reportProgress: true,
        observe: 'events'
      });
      
    }
}
