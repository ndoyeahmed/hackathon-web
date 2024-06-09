import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';

const url = environment.url;
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.startsWith('/api')) {
      request = request.clone({
        url: url + request.url
      });
    }
    if (this.authenticationService.token()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authenticationService.token()}`
        }
      });
    }
    return next.handle(request);
  }
}
