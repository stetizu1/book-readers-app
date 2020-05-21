export enum ErrorMessage {
  offline = 'K použití aplikace je potřeba být online.',
  noGoogleToken = 'K použití aplikace je potřeba registrace pomocí Google.',
  noCurrentUser = 'Pro použití aplikace je nutné se přihlásit.',
  loginFailed = 'Zadané přihlašovací údaje jsou neplatné.',

  userSearchNotFound = 'Uživatel nebyl nalezen',
  userSearchNotFoundDescription = 'Hleadný uživatel nebyl nalezen. Zkontrolujte si prosím správnost zadaných údajů.',
  noBookToBorrow = 'Není možné zapůjčit knihu',
  noBookToBorrowDescription = 'Pro zapůjčení knihy je nutné mít tuto knihu v knihovně.',
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

  readCurrentUser = 'Nastala chyba během pokusu o získání přihlášeného uživatele.',
  readUsers = 'Nastala chyba během pokusu o získání profilů přátel.',
  updateUser = 'Nastala chyba během pokusu o editaci uživatele.',
  deleteUser = 'Nastala chyba během pokusu o smazání uživatele.',

  readAllAuthors = 'Nastala chyba během pokusu o získání autorů.',
  readAllBooks = 'Nastala chyba během pokusu o získání knih.',
  readAllGenres = 'Nastala chyba během pokusu o získání žánrů.',
  readAllBookData = 'Nastala chyba během pokusu o získání knižních dat uživatele.',
  readAllLabels = 'Nastala chyba během pokusu o získání štítků.',
  readAllReviews = 'Nastala chyba během pokusu o získání recenzí.',
  readAllPersonalBookData = 'Nastala chyba během pokusu o získání osobních dat ke knihám.',

  readBookData = 'Nastala chyba během pokusu o získání dat ke knize.',

  createBookData = 'Nastala chyba během pokusu o přidání knihy.',
  updateBookData = 'Nastala chyba během pokusu o editaci knihy.',
  deleteBookData = 'Nastala chyba během pokusu o smazání knihy.',

  createLabel = 'Nastala chyba během pokusu o přidání štítku.',
  updateLabel = 'Nastala chyba během pokusu o editaci štítku.',
  deleteLabel = 'Nastala chyba během pokusu o smazání štítku.',

  readAllFriendship = 'Nastala chyba během pokusu o získání přátel.',

  createFriendship = 'Nastala chyba během pokusu o přidání přátelství.',
  updateFriendship = 'Nastala chyba během pokusu o potvrzení přátelství.',
  deleteFriendship = 'Nastala chyba během pokusu o smazání přátelství.',
  readSearchedUser = 'Nastala chyba během pokusu o nalezení uživatele.',

  readWishlist = 'Nastala chyba během pokusu o načtení wishlistu.',
  readAllBookedBookRequests = 'Nastala chyba během pokusu o načtení zamluvených knih.',

  createBookRequest = 'Nastala chyba během pokusu o přidání knihy do seznamu přání.',
  updateBookRequest = 'Nastala chyba během pokusu o editaci knihy v seznamu přání.',
  deleteBookRequest = 'Nastala chyba během pokusu o odstranění knihy ze seznamu přání.',

  readAllBookLoans = 'Nastala chyba během pokusu o načtení půjčovaných knih.',
  readAllBorrowed = 'Nastala chyba během pokusu o načtení půjčených knih.',

  createBookLoan = 'Nastala chyba během pokusu o zaznamenání půjčky.',
  updateBookLoan = 'Nastala chyba během pokusu o editaci půjčky.',
  returnBorrowed = 'Nastala chyba během pokusu o zaznamenání vrácení knihy.',
  deleteBorrowed = 'Nastala chyba během pokusu o odstranění záznamu půjčky.',

  readAllFriendsBookData = 'Nastala chyba během pokusu o získání dat s knihami přátel.',
  readAllFriendsBookRequest = 'Nastala chyba během pokusu o záskání dat se seznamy přání přátel'
}
