export enum ErrorMessage {
  offline = 'K použití aplikace je potřeba být online.',
  googleLoginFailed = 'Přihlášení pomocí Google selhalo.',
  googleRegistrationFailed = 'Registrace pomocí Google selhala.',
  noGoogleToken = 'K použití aplikace je potřeba registrace pomocí Google.',
  noCurrentUser = 'Pro použití aplikace je nutné se přihlásit.',
  loginFailed = 'Zadané přihlašovací údaje jsou neplatné.',
  failed = 'Něco se pokazilo...',
  userSearchNotFound = 'Uživatel nebyl nalezen',
  userSearchNotFoundDescription = 'Hleadný uživatel nebyl nalezen. Zkontrolujte si prosím správnost zadaných údajů.'
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
  getUsers = 'Nastala chyba během pokusu o získání profilů přátel.',
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

  createBookData = 'Nastala chyba během pokusu o přidání knihy.',
  updateBookData = 'Nastala chyba během pokusu o editaci knihy.',
  deleteBookData = 'Nastala chyba během pokusu o smazání knihy.',

  createLabel = 'Nastala chyba během pokusu o přidání štítku.',
  updateLabel = 'Nastala chyba během pokusu o editaci štítku.',
  deleteLabel = 'Nastala chyba během pokusu o smazání štítku.',

  getAllFriendship = 'Nastala chyba během pokusu o získání přátel.',

  createFriendship = 'Nastala chyba během pokusu o přidání přátelství.',
  updateFriendship = 'Nastala chyba během pokusu o potvrzení přátelství.',
  deleteFriendship = 'Nastala chyba během pokusu o smazání přátelství.',
  getSearchedUser = 'Nastala chyba během pokusu o nalezení uživatele.',

  getWishlist = 'Nastala chyba během pokusu o načtení wishlistu.',
  getAllBookedBookRequests = 'Nastala chyba během pokusu o načtení zamluvených knih.',

  createBookRequest = 'Nastala chyba během pokusu o přidání knihy do seznamu přání.',
  updateBookRequest = 'Nastala chyba během pokusu o editaci knihy v seznamu přání.',
  deleteBookRequest = 'Nastala chyba během pokusu o odstranění knihy ze seznamu přání.',

}
