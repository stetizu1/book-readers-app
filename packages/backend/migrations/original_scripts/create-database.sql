DROP TABLE IF EXISTS borrowed;
DROP TABLE IF EXISTS book_request;
DROP TABLE IF EXISTS has_label;
DROP TABLE IF EXISTS label;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS personal_book_data;
DROP TABLE IF EXISTS book_data;
DROP TABLE IF EXISTS genre;
DROP TYPE IF EXISTS FORMAT;
DROP TABLE IF EXISTS written_by;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS author;
DROP TABLE IF EXISTS friendship;
DROP TABLE IF EXISTS user_data;


CREATE TABLE user_data
(
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(50) UNIQUE NOT NULL,
    publicProfile BOOLEAN            NOT NULL,
    password      VARCHAR(50),
    name          VARCHAR(50),
    description   VARCHAR,
    image         BYTEA,
    CONSTRAINT mail_check CHECK (email LIKE '_%@_%._%')
);

CREATE TABLE friendship
(
    fromUserId INTEGER,
    toUserId   INTEGER,
    confirmed  BOOLEAN NOT NULL,
    PRIMARY KEY (fromUserId, toUserId),
    CONSTRAINT user_data_fk_user_data_from
        FOREIGN KEY (fromUserId)
            REFERENCES user_data (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
    CONSTRAINT user_data_fk_user_data_to
        FOREIGN KEY (toUserId)
            REFERENCES user_data (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE author
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE book
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE written_by
(
    authorId INTEGER,
    bookId   INTEGER,
    PRIMARY KEY (authorId, bookId),
    CONSTRAINT writtenBy_fk_author
        FOREIGN KEY (authorId)
            REFERENCES author (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
    CONSTRAINT writtenBy_fk_book
        FOREIGN KEY (bookId)
            REFERENCES book (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TYPE FORMAT AS ENUM (
    'paperback',
    'hardcover',
    'ebook',
    'audiobook',
    'other'
    );

CREATE TABLE genre
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE book_data
(
    id            SERIAL PRIMARY KEY,
    bookId        INTEGER NOT NULL,
    userId        INTEGER,
    publisher     VARCHAR,
    yearPublished CHAR(4),
    isbn          CHAR(20),
    image         BYTEA,
    format        FORMAT,
    genreId       INTEGER,
    CONSTRAINT isbn CHECK (isbn NOT LIKE '%[^(0-9X- )]%'),
    CONSTRAINT book_data_fk_book
        FOREIGN KEY (bookId)
            REFERENCES book (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
    CONSTRAINT book_data_fk_user_data
        FOREIGN KEY (userId)
            REFERENCES user_data (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
    CONSTRAINT book_data_fk_genre
        FOREIGN KEY (genreId)
            REFERENCES genre (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE personal_book_data
(
    bookDataId INTEGER,
    dateRead   TIMESTAMP WITHOUT TIME ZONE,
    comment    VARCHAR,
    PRIMARY KEY (bookDataId),
    CONSTRAINT personal_book_data_fk_book_data
        FOREIGN KEY (bookDataId)
            REFERENCES book_data (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE review
(
    bookDataId INTEGER,
    stars      SMALLINT,
    comment    VARCHAR,
    PRIMARY KEY (bookDataId),
    CONSTRAINT review_fk_book_data
        FOREIGN KEY (bookDataId)
            REFERENCES book_data (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE label
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR,
    description VARCHAR,
    userId      INTEGER NOT NULL,
    CONSTRAINT label_fk_user_data
        FOREIGN KEY (userId)
            REFERENCES user_data (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE has_label
(
    bookDataId INTEGER,
    labelId    INTEGER,
    PRIMARY KEY (bookDataId, labelId),
    CONSTRAINT has_label_fk_book_data
        FOREIGN KEY (bookDataId)
            REFERENCES book_data (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
    CONSTRAINT has_label_fk_label
        FOREIGN KEY (labelId)
            REFERENCES label (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE book_request
(
    userId               INTEGER,
    bookId               INTEGER,
    userBookingId        INTEGER,
    comment              VARCHAR,
    createdByBookingUser BOOLEAN,
    PRIMARY KEY (userId, bookId),
    CONSTRAINT book_request_fk_user_data
        FOREIGN KEY (userId)
            REFERENCES user_data (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
    CONSTRAINT book_request_fk_user_data_booker
        FOREIGN KEY (userBookingId)
            REFERENCES user_data (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
    CONSTRAINT book_request_fk_book
        FOREIGN KEY (bookId)
            REFERENCES book_data (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE borrowed
(
    userId         INTEGER,
    bookId         INTEGER,
    userBorrowedId INTEGER,
    nonUserName    VARCHAR,
    comment        VARCHAR,
    created        TIMESTAMP WITHOUT TIME ZONE,
    until          TIMESTAMP WITHOUT TIME ZONE,
    returned       BOOLEAN,
    PRIMARY KEY (userId, bookId),
    CONSTRAINT borrowed_fk_user
        FOREIGN KEY (userId)
            REFERENCES user_data (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
    CONSTRAINT borrowed_fk_user_borrowed
        FOREIGN KEY (userBorrowedId)
            REFERENCES user_data (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
    CONSTRAINT borrowed_fk_book
        FOREIGN KEY (bookId)
            REFERENCES book_data (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

