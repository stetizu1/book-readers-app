const homeMessages = {
  stop: {
    header: 'Stop',
    description: 'Odlož nákup na později. Někdo pro tebe něco má...',
  },
  lastAdded: {
    header: 'Poslední knihy přidané do knihovny',
    emptyMessage: 'Ve vaší knihovně nejsou žádné knihy. Přidejte knihy do své knihovny, půjčujte je přátelům, sdílejte hodnocení.',
  },
  lastAddedWish: {
    header: 'Poslední knihy přidané do wishlistu',
    emptyMessage: 'Ve vašem wishlistu nejsou žádné knihy. Přidejte knihy do svého wishlistu, abyste ukázali svá přání přátelům. Přátelé si budou moct tyto knihy zamlouvat a vám se zobrazí, zda si můžete knihu koupit, nebo má někdo nějakou zamluvenou.',
  },
  expiringBorrowed: {
    header: 'Expirující výpůjčky',
    emptyMessage: 'Nemáte půjčené žádné knihy. Knihy vám může zapůjčit kdokoli z přátel, stejně tak vy můžete půjčit knihu příteli.',
    labels: {
      until: 'Do',
      return: 'Půjčeno od',
    },
  },
  stats: {
    header: 'Statistiky',
    labels: {
      booksInLibrary: 'Knih v knihovně',
      friends: 'Přátel',
      givenReviews: 'Uděleno hodnocení',
      borrowedBooks: 'Knih půjčených od přátel',
      activeBookLoans: 'Knih půjčených přátelům',
    },
  },
};

const bookLoanMessages = {
  pageHeader: 'Knihy půjčené přátelům',
  pageHeaderBorrowed: 'Knihy půjčené od přátel',

  addHeader: 'Vytvoření zápůjčky knihy',
  editHeader: 'Editace zapůjčení knihy',
  detailHeader: 'Detail zápůjčky',

  subHeader: 'O zapůjčení',

  labels: {
    book: 'Kniha',
    comment: 'Poznámka',
    nonUserName: 'Půjčeno na jméno',
    borrowedTo: 'Zapůjčeno uživateli',
    borrowedFrom: 'Půjčeno od',
    until: 'Půjčeno do',
  },

  deleteDialog: {
    header: 'Odebrat zapůjčení',
    description: 'Jste si jistí, že chcete odebrat údaje o zapůjčení? Tato možnost nenávratně smaže data o půjčce. Pokud chcete data zachovat, zvolte vrácení knihy. V~následující verzi aplikace bude možné zobrazit vrácené knihy, nikoli však smazané.', // todo fix after functionality add
  },
  nonUserNameTooltip: 'Jméno uživatele slouží pro případ, že půjčujete knihu mimo uživatele aplikace, či pro případné jiné pojmenování uživatele. Jméno je zachováno i když si uživatel zruší účet.',
};

const friendshipMessages = {
  pageHeader: 'Přátelé',
  pageSubHeaders: {
    confirmed: 'Schválení',
    requests: 'Žádosti',
    pending: 'Čekající na schválení',
  },

  addHeader: 'Přidat přítele',

  descriptions: {
    searching: 'Email hledaného uživatele',
    pending: 'Čeká na potvrzení...',
    alreadyFriend: 'Nalezený uživatel již je v přátelích',
  },
  deleteDialog: {
    header: 'Odebrat přítele',
    description: 'Jste si jistí, že chcete odebrat přítele?',
  },
};

const labelsMessages = {
  pageHeader: 'Správa štítků',

  addHeader: 'Přidání štítku',
  editHeader: 'Úprava štítku',

  labels: {
    name: 'Jméno štítku',
    description: 'Popis štítku',
  },
  deleteDialog: {
    header: 'Odstranit štítek',
    description: 'Jste si jistí, že chcete odstranit štítek?',
  },
};

const libraryMessages = {
  pageHeader: 'Knihovna',

  addHeader: 'Přidat knihu',
  editHeader: 'Upravit údaje o knize',
  detailHeader: 'Detail knihy',

  subHeaders: {
    bookData: 'Informace o knize',
    personalBookData: 'Osobní údaje',
    review: 'Hodnocení',
    labels: 'Štítky',
  },

  labels: {
    bookData: {
      bookName: 'Jméno knihy',
      authorName: 'Jméno autora',
      format: 'Formát',
      publisher: 'Nakladatelství',
      yearPublished: 'Rok vydání',
      isbn: 'ISBN',
      genre: 'Žánr',
    },
    personalBookData: {
      dateRead: 'Přečteno',
      comment: 'Komentář',
    },
    review: {
      stars: 'Číselné hodnocení',
      comment: 'Slovní hodnocení',
    },
  },

  deleteDialog: {
    header: 'Odstranit knihu',
    description: 'Jste si jistí, že chcete odstranit knihu?',
  },

  emptyLabels: 'Zatím nemáte žádné štítky. Vytvořte si je v knihovně.',
};

const loginMessages = {
  loginCard: {
    header: 'Přihlášení',
    description: 'V současné verzi je podporováno přihlášení pouze pomocí Google.',
  },
  registerCard: {
    header: 'Registrace',
    description: 'V současné verzi je podporována registrace pouze pomocí Google.',
  },
};

const profileMessages = {
  header: 'Profil',
  addHeader: 'Založení profilu',
  editHeader: 'Editace profilu',
  labels: {
    email: 'Email',
    name: 'Jméno',
    publicProfile: 'Veřejný profil',
    description: 'O uživateli',
  },
  deleteDialog: {
    header: 'Odstranit uživatele',
    description: 'Jste si jistí, že chcete odstranit uživatele?',
  },
  publicProfileTooltip: 'Při nastavení profilu jako veřejného si budou moct zobrazit vaše recenze, a k nim obecné údaje o knihách, i uživatelé mimo Váš okruh přátel.',
};

const reviewsMessages = {
  pageHeader: 'Recenze přátel',
  pageHeaderOwn: 'Vlastní recenze',
};

const wishlistMessages = {
  pageHeader: 'Seznam přání',

  addHeader: 'Přidat knihu do přání',
  editHeader: 'Editovat knihu v seznamu přání',
  detailHeader: 'Detail přání knihy',

  labels: {
    next: 'Další údaje',
    comment: 'Poznámka',
    createdByBooking: 'Přidáno přítelem',
    booked: 'Zamluveno',
  },
  deleteDialog: {
    header: 'Odstranit přání',
    description: 'Jste si jistí, že chcete odstranit přání knihy?',
  },
  emptyDescription: 'Zatím jste si nezamluvili žádnou knihu z wishlistů přátel. Zobrazte si wishlisty přátel a vyberte jim knihu.',
};

export const PageMessages = {
  home: homeMessages,

  bookLoan: bookLoanMessages,
  friendship: friendshipMessages,
  labels: labelsMessages,
  library: libraryMessages,
  login: loginMessages,
  profile: profileMessages,
  reviews: reviewsMessages,
  wishlist: wishlistMessages,

  notFound: {
    header: 'Nenalezeno',
    description: 'Požadovaná stránka nebyla nalezena',
  },
  unknownError: {
    header: 'Nastala chyba',
    description: 'Nastala neznámá chyba. Zkuste obnovit stránku.',
  },

  nothing: '...Žádná data k zobrazení...',

};
