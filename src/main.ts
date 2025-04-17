import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {provideToastr} from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations'

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), 
    provideAnimations(),
    provideToastr({
        positionClass: 'toast-bottom-right'
      })]  
}).catch(err => console.error(err));