import { CapitalsRegExp as Lu, LowercaseRegExp as Ll } from './letters';

export const idRegExp = new RegExp(/[1-9]+[0-9]*/);

export const emailRegExp = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

export const isbnRegExp = new RegExp(/^(?:\d{9}[\dXx]|\d{13})$/);

export const yearRegExp = new RegExp(/^[12][0-9]{3}$/);

export const nameRegExp = RegExp(`^[${Lu}${Ll}][${Ll}]*[.]?([ -'][${Lu}${Ll}][${Ll}']*[.]?)*$`);

const Lucz = 'A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞĀĂĄĆĈĊČĎĐĒĔĖĘĚĜĞĠĢĤĦĨĪĬĮİĲĴĶĹĻĽĿŁŃŅŇŊŌŎŐŒŔŖŘŚŜŞŠŢŤŦŨŪŬŮŰŲŴŶŸŹŻŽ';
const Llcz = 'a-zµßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿāăąćĉċčďđēĕėęěĝğġģĥħĩīĭįıĳĵķĸĺļľŀłńņňŉŋōŏőœŕŗřśŝşšţťŧũūŭůűųŵŷźżž';
export const nameShortenedRegExp = RegExp(`^[${Lucz}${Llcz}][${Llcz}]*[.]?([ -'][${Lucz}${Llcz}][${Llcz}']*[.]?)*$`);

export const databaseUrl = RegExp(/^(?:([^:/?#\s]+):\/{2})?(?:([^@/?#\s]+)@)?([^/?#\s]+)?(?:\/([^?#\s]*))?(?:[?]([^#\s]+))?\S*$/);

export const googleClientId = RegExp(/^[0-9]+[-][0-9a-z]+\.apps\.googleusercontent\.com$/);

export const date = RegExp(/^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\+[0-9]{4}$/); // has to correspond to DataFormat.date
