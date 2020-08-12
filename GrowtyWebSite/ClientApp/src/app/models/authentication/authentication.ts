export class User {
    id: number;
    username: string;
    token?: string;
}
export class LoginViewModel {
  email: string;
  password: string;
}

export class LoginCodeViewModel {
  twoFactorCode: string;

  public static instanceOfLoginCodeViewModel(object: any): object is LoginCodeViewModel {
    return 'twoFactorCode' in object;
  }
}
