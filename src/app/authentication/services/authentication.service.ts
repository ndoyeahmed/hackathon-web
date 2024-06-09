import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  SECRET = 'smartmaskosc2020';
  errCon = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private modalService: NgbModal
  ) { }

  async authenticationProcess(url: string, body: any) {
    await this.http.post<any>(url, body).toPromise()
      .then((data) => {
        this.setSession(data).then(x => {
          this.identity().subscribe((user: any) => {
            if (user.passwordChanged) {
              if (this.hasAuthority(['ADMIN'], user)) {
                this.storeUser(user)
                  .then(() => {
                    this.router.navigate(['/comptability/dashboard']);
                  });
              } else {
                this.storeUser(user)
                  .then(() => {
                    this.router.navigate(['/formation/planning']);
                  });
              }
            } else {
              this.router.navigate(['/login/reset-password', body.email]);
            }

          }, (error: any) => console.log(error));
        });
      }).catch((error1) => {this.errCon = true;});
    return this.errCon;
  }

  async login(credentials: any) {
    return this.authenticationProcess('/api/v1/auth/authenticate', {email: credentials.login, password: credentials.password});
  }

  resetPassword(value: any) {
    return this.http.put('/api/v1/reset-password', value);
  }

  async setSession(authResult: any) {

    localStorage.removeItem('id_token');
    localStorage.setItem('id_token', authResult.token);
  }

  async storeUser(user: any) {
    localStorage.removeItem('mdd_user');
    localStorage.setItem('mdd_user',JSON.stringify(user));
    // this.storage.store('mdd_user', this.convertText('encrypt', user));
  }

  token() {
    return localStorage.getItem('id_token')?.toString();
  }

  /*public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }*/

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('mdd_user');
    this.modalService.dismissAll();
    this.router.navigate(['/login']);
  }

  public identity() {
    return this.http.get<any>('/api/v1/connected-user');
  }

  hasAuthority(authorities: string[], user: any): boolean {
    for (const authority of authorities) {
      if (user.role === authority) {
        return true;
      }
    }
    return false;
  }
}
