import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorResponse } from '../models/common/common';
import { AuthenticationService } from '../services';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      var response = new ErrorResponse();
      response.statusCode = err.status;
      response.message = err.error;

      if (err.status == 401 || err.status == 403) {
        this.authenticationService.logout();
        this.router.navigate(['']);
      }

      return throwError(response);
    }))
  }
}
