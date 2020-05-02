export enum ErrorMessage {
  failed = 'Něco se pokazilo...',
  loginFailed = 'Nesprávné přihlašovací údaje',
  noCurrentUser = 'Pro použití aplikace se přihlašte',
  noGoogleToken = 'V současnosti je podporována registrace pouze za pomoci Google',
}

export enum ApiErrorMessage {
  invalidParameters = 'Zadané parametry neodpovídají požadovaným.',
  forbidden = 'Přístup byl odepřen.',
  notFound = 'Objekt nebyl nalezen.',
  conflict = 'Požadovaná operace je v konfiktu s existujícími daty.',
  internalServerError = 'Chyba na straně serveru. Opakujte požadavek později.',
}

export enum ApiErrorPrefix {
  Login = 'Nastala chyba během pokusu o přihlášení.',
  Register = 'Nastala chyba během pokusu o registraci.',
  GetCurrentUser = 'Nastala chyba během pokusu o získání přihlášeného uživatele.',
  GetPublicUsers = 'Nastala chyba během pokusu o získání veřejných profilů.',
}
