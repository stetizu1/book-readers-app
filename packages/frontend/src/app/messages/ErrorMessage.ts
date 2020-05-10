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

  getAllAuthors = 'Nastala chyba během pokusu o získání autorů.',
  getAllBooks = 'Nastala chyba během pokusu o získání knih.',
  getAllGenres = 'Nastala chyba během pokusu o získání žánrů.',
  getAllBookData = 'Nastala chyba během pokusu o získání knižních dat uživatele.',
  getAllLabels = 'Nastala chyba během pokusu o získání štítků.',
  getAllReviews = 'Nastala chyba během pokusu o získání recenzí.',
  getAllPersonalBookData = 'Nastala chyba během pokusu o získání osobních dat ke knihám.',

  getBookData = 'Nastala chyba během pokusu o získání dat ke knize.',

  updateBookData = 'Nastala chyba během pokusu o editaci knihy.',
  deleteBookData = 'Nastala chyba během pokusu o smazání knihy.',
}
