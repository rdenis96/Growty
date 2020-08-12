"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginCodeViewModel = exports.LoginViewModel = exports.User = void 0;
var User = /** @class */ (function () {
    function User() {
    }
    return User;
}());
exports.User = User;
var LoginViewModel = /** @class */ (function () {
    function LoginViewModel() {
    }
    return LoginViewModel;
}());
exports.LoginViewModel = LoginViewModel;
var LoginCodeViewModel = /** @class */ (function () {
    function LoginCodeViewModel() {
    }
    LoginCodeViewModel.instanceOfLoginCodeViewModel = function (object) {
        return 'twoFactorCode' in object;
    };
    return LoginCodeViewModel;
}());
exports.LoginCodeViewModel = LoginCodeViewModel;
//# sourceMappingURL=authentication.js.map