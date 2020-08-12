"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var authentication_1 = require("../../models/authentication/authentication");
var AuthenticationService = /** @class */ (function () {
    function AuthenticationService(http, baseUrl) {
        this.http = http;
        this.baseUrl = baseUrl;
        this.currentUserSubject = new rxjs_1.BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }
    Object.defineProperty(AuthenticationService.prototype, "currentUserValue", {
        get: function () {
            return this.currentUserSubject.value;
        },
        enumerable: false,
        configurable: true
    });
    AuthenticationService.prototype.login = function (email, password) {
        var _this = this;
        var model = new authentication_1.LoginViewModel();
        model.email = email;
        model.password = password;
        return this.http.post(this.baseUrl + "account/login", model)
            .pipe(operators_1.map(function (result) {
            //store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(result));
            _this.currentUserSubject.next(result);
            return result;
        }));
    };
    AuthenticationService.prototype.loginWithCode = function (token) {
        var _this = this;
        var body = new authentication_1.LoginCodeViewModel();
        body.twoFactorCode = token;
        return this.http.post(this.baseUrl + "account/loginWithCode", body)
            .pipe(operators_1.map(function (result) {
            //store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(result));
            _this.currentUserSubject.next(result);
            return result;
        }));
    };
    AuthenticationService.prototype.logout = function () {
        // remove user from local storage to log user out
        this.currentUserSubject.next(null);
        localStorage.removeItem('currentUser');
    };
    AuthenticationService = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __param(1, core_1.Inject('BASE_URL'))
    ], AuthenticationService);
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map