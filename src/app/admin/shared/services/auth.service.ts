import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FbAuthResponse, User} from "../../../shared/interfaces";
import {Observable, Subject, throwError} from "rxjs";
import { tap, catchError} from "rxjs/operators";
import {environment} from "../../../../environments/environment";

@Injectable({providedIn:'root'})
export class AuthService {

  public error$: Subject<string> = new Subject<string>()
  constructor(private http: HttpClient) {}

  get token():string | null {
    const expDate = new Date(localStorage.getItem('fb-token-exp')!)
    if(new Date() > expDate) {
      this.logout()
      return null
    }
    return localStorage.getItem('fb-token')
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true
    return this.http.post<any>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`
      , user).pipe(
        tap(this.setToken),
      catchError(this.handleError.bind(this))
    )
  }

  private handleError(error: HttpErrorResponse) {
      const {message} = error.error.error
      switch (message)  {
        case 'INVALID_EMAIL':
          this.error$.next('Неверный email')
          break
        case 'INVALID_PASSWORD':
          this.error$.next('Неверный пароль')
          break
        case 'EMAIL_NOT_FOUND':
          this.error$.next('Такого email нет')
          break
      }
    return throwError (message)
  }

  logout() {
    this.setToken(null)
  }

  isAuthenticated() {
    return !!this.token
  }

  private setToken(res: FbAuthResponse | null) {
    if(res) {
      const expiresDate = new Date(new Date().getTime() + +res.expiresIn *1000)
      localStorage.setItem('fb-token', res.idToken)
      localStorage.setItem('fb-token-exp', expiresDate.toString())
    } else localStorage.clear()

  }

}
