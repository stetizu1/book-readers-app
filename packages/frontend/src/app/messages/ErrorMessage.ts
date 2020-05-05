export enum ErrorMessage {
  offline = 'K použití aplikace je potřeba být online.',
  googleLoginFailed = 'Přihlášení pomocí Google selhalo.',
  googleRegistrationFailed = 'Registrace pomocí Google selhala.',
  noGoogleToken = 'K použití aplikace je potřeba registrace pomocí Google.',
  noCurrentUser = 'Pro použití aplikace je nutné se přihlásit.',
  loginFailed = 'Zadané přihlašovací údaje jsou neplatné.',
  failed = 'Něco se pokazilo...',
}

export enum ApiErrorMessage {
  invalidParameters = 'Zadané parametry neodpovídají požadovaným.',
  forbidden = 'Přístup byl odepřen.',
  notFound = 'Subjekt nebyl nalezen.',
  conflict = 'Požadovaná operace je v konfiktu s existujícími daty.',
  internalServerError = 'Chyba na straně serveru. Opakujte požadavek později.',
}

export enum ApiErrorPrefix {
  login = 'Nastala chyba během pokusu o přihlášení.',
  register = 'Nastala chyba během pokusu o registraci.',
  getCurrentUser = 'Nastala chyba během pokusu o získání přihlášeného uživatele.',
  getPublicUsers = 'Nastala chyba během pokusu o získání veřejných profilů.',
  updateUser = 'Nastala chyba během pokusu o editaci uživatele.',
  deleteUser = 'Nastala chyba během pokusu o smazání uživatele.',
}
