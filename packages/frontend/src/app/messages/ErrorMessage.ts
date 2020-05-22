import { FailActionName, FailType } from '../modules/failSaga';

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

export enum GenericApiErrorMessage {
  invalidParameters = 'Zadané parametry neodpovídají požadovaným.',
  forbidden = 'Přístup byl odepřen.',
  notFound = 'Subjekt nebyl nalezen.',
  conflict = 'Požadovaná operace je v konfiktu s existujícími daty.',
  internalServerError = 'Chyba na straně serveru. Opakujte požadavek později.',
}

export enum ApiErrorMessageType {
  prefix = 'prefix',
  invalidParameters = 'invalidParameters',
  forbidden = 'forbidden',
  notFound = 'notFound',
  conflict = 'conflict',
}

type FailMessageRecord = {
  [name in FailType]: {
    [ApiErrorMessageType.prefix]: string;
    [ApiErrorMessageType.invalidParameters]?: string;
    [ApiErrorMessageType.forbidden]?: string;
    [ApiErrorMessageType.notFound]?: string;
    [ApiErrorMessageType.conflict]?: string;
  };
};

export const ApiError: FailMessageRecord = {
  [FailActionName.LOGIN_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o přihlášení.',
    [ApiErrorMessageType.invalidParameters]: 'Parametry zadané k přihlášení jsou chybné.',
    [ApiErrorMessageType.notFound]: 'Uživatel nenalezen. Pro použití aplikace je nutné se registrovat.',
  },
  [FailActionName.REGISTRATION_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o registraci.',
    [ApiErrorMessageType.invalidParameters]: 'Parametry zadané k registraci jsou chybné.',
    [ApiErrorMessageType.conflict]: 'Uživatel registrovaný pod tímto emailem již existuje.',
  },

  [FailActionName.READ_CURRENT_USER_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o získání přihlášeného uživatele.',
  },
  [FailActionName.READ_ALL_USERS_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o získání profilů přátel.',
  },
  [FailActionName.UPDATE_USER_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o editaci uživatele.',
  },
  [FailActionName.DELETE_USER_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o smazání uživatele.',
  },

  [FailActionName.READ_ALL_AUTHORS_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o získání autorů.',
  },
  [FailActionName.READ_ALL_BOOKS_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o získání knih.',
  },
  [FailActionName.READ_ALL_GENRES_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o získání žánrů.',
  },
  [FailActionName.READ_ALL_BOOK_DATA_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o získání knižních dat uživatele.',
  },
  [FailActionName.READ_ALL_LABELS_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o získání štítků.',
  },
  [FailActionName.READ_ALL_REVIEWS_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o získání recenzí.',
  },
  [FailActionName.READ_ALL_PERSONAL_BOOK_DATA_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o získání osobních dat ke knihám.',
  },

  [FailActionName.CREATE_BOOK_DATA_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o přidání knihy.',
  },
  [FailActionName.UPDATE_BOOK_DATA_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o editaci knihy.',
  },
  [FailActionName.DELETE_BOOK_DATA_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o smazání knihy.',
  },

  [FailActionName.CREATE_LABEL_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o přidání štítku.',
  },
  [FailActionName.UPDATE_LABEL_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o editaci štítku.',
  },
  [FailActionName.DELETE_LABEL_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o smazání štítku.',
  },

  [FailActionName.READ_ALL_FRIENDSHIP_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o získání přátel.',
  },

  [FailActionName.CREATE_FRIENDSHIP_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o přidání přátelství.',
  },
  [FailActionName.CONFIRM_FRIENDSHIP_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o potvrzení přátelství.',
  },
  [FailActionName.DELETE_FRIENDSHIP_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o smazání přátelství.',
  },

  [FailActionName.READ_WISHLIST_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o načtení wishlistu.',
  },
  [FailActionName.READ_ALL_BOOKED_BOOK_REQUESTS_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o načtení zamluvených knih.',
  },

  [FailActionName.CREATE_BOOK_REQUEST_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o přidání knihy do seznamu přání.',
  },
  [FailActionName.UPDATE_BOOK_REQUEST_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o editaci knihy v seznamu přání.',
  },
  [FailActionName.BOOK_BOOK_REQUEST_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o zamluvení knihy v seznamu přání.',
  },
  [FailActionName.DELETE_BOOK_REQUEST_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o odstranění knihy ze seznamu přání.',
  },

  [FailActionName.READ_ALL_BOOK_LOANS_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o načtení půjčovaných knih.',
  },
  [FailActionName.READ_ALL_BORROWED_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o načtení půjčených knih.',
  },

  [FailActionName.CREATE_BOOK_LOAN_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o zaznamenání půjčky.',
  },
  [FailActionName.UPDATE_BOOK_LOAN_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o editaci půjčky.',
  },
  [FailActionName.RETURN_BORROWED_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o zaznamenání vrácení knihy.',
  },
  [FailActionName.DELETE_BOOK_LOAN_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o odstranění záznamu půjčky.',
  },

  [FailActionName.READ_ALL_FRIENDS_BOOK_DATA_WITH_REVIEWS_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o získání dat s knihami přátel.',
  },
  [FailActionName.READ_ALL_FRIENDS_BOOK_REQUESTS_FAILED]: {
    [ApiErrorMessageType.prefix]: 'Nastala chyba během pokusu o záskání dat se seznamy přání přátel',
  },
};
