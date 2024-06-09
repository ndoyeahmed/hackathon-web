import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';

@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {

  constructor(private auth: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {console.log();},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401 || err.status === 403) {
              this.auth.logout();
            }
          }
        }
      )
    );
  }
}
