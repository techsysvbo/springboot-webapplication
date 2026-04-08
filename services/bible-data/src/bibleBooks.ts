export interface BibleBookData {
  id: number;
  name: string;
  abbreviation: string;
  testament: 'OT' | 'NT';
  order: number;
  chapters: number;
}

export const BIBLE_BOOKS: BibleBookData[] = [
  // Old Testament
  { id: 1,  name: 'Genesis',          abbreviation: 'Gen',  testament: 'OT', order: 1,  chapters: 50 },
  { id: 2,  name: 'Exodus',           abbreviation: 'Exod', testament: 'OT', order: 2,  chapters: 40 },
  { id: 3,  name: 'Leviticus',        abbreviation: 'Lev',  testament: 'OT', order: 3,  chapters: 27 },
  { id: 4,  name: 'Numbers',          abbreviation: 'Num',  testament: 'OT', order: 4,  chapters: 36 },
  { id: 5,  name: 'Deuteronomy',      abbreviation: 'Deut', testament: 'OT', order: 5,  chapters: 34 },
  { id: 6,  name: 'Joshua',           abbreviation: 'Josh', testament: 'OT', order: 6,  chapters: 24 },
  { id: 7,  name: 'Judges',           abbreviation: 'Judg', testament: 'OT', order: 7,  chapters: 21 },
  { id: 8,  name: 'Ruth',             abbreviation: 'Ruth', testament: 'OT', order: 8,  chapters: 4  },
  { id: 9,  name: '1 Samuel',         abbreviation: '1Sam', testament: 'OT', order: 9,  chapters: 31 },
  { id: 10, name: '2 Samuel',         abbreviation: '2Sam', testament: 'OT', order: 10, chapters: 24 },
  { id: 11, name: '1 Kings',          abbreviation: '1Kgs', testament: 'OT', order: 11, chapters: 22 },
  { id: 12, name: '2 Kings',          abbreviation: '2Kgs', testament: 'OT', order: 12, chapters: 25 },
  { id: 13, name: '1 Chronicles',     abbreviation: '1Chr', testament: 'OT', order: 13, chapters: 29 },
  { id: 14, name: '2 Chronicles',     abbreviation: '2Chr', testament: 'OT', order: 14, chapters: 36 },
  { id: 15, name: 'Ezra',             abbreviation: 'Ezra', testament: 'OT', order: 15, chapters: 10 },
  { id: 16, name: 'Nehemiah',         abbreviation: 'Neh',  testament: 'OT', order: 16, chapters: 13 },
  { id: 17, name: 'Esther',           abbreviation: 'Esth', testament: 'OT', order: 17, chapters: 10 },
  { id: 18, name: 'Job',              abbreviation: 'Job',  testament: 'OT', order: 18, chapters: 42 },
  { id: 19, name: 'Psalms',           abbreviation: 'Ps',   testament: 'OT', order: 19, chapters: 150 },
  { id: 20, name: 'Proverbs',         abbreviation: 'Prov', testament: 'OT', order: 20, chapters: 31 },
  { id: 21, name: 'Ecclesiastes',     abbreviation: 'Eccl', testament: 'OT', order: 21, chapters: 12 },
  { id: 22, name: 'Song of Solomon',  abbreviation: 'Song', testament: 'OT', order: 22, chapters: 8  },
  { id: 23, name: 'Isaiah',           abbreviation: 'Isa',  testament: 'OT', order: 23, chapters: 66 },
  { id: 24, name: 'Jeremiah',         abbreviation: 'Jer',  testament: 'OT', order: 24, chapters: 52 },
  { id: 25, name: 'Lamentations',     abbreviation: 'Lam',  testament: 'OT', order: 25, chapters: 5  },
  { id: 26, name: 'Ezekiel',          abbreviation: 'Ezek', testament: 'OT', order: 26, chapters: 48 },
  { id: 27, name: 'Daniel',           abbreviation: 'Dan',  testament: 'OT', order: 27, chapters: 12 },
  { id: 28, name: 'Hosea',            abbreviation: 'Hos',  testament: 'OT', order: 28, chapters: 14 },
  { id: 29, name: 'Joel',             abbreviation: 'Joel', testament: 'OT', order: 29, chapters: 3  },
  { id: 30, name: 'Amos',             abbreviation: 'Amos', testament: 'OT', order: 30, chapters: 9  },
  { id: 31, name: 'Obadiah',          abbreviation: 'Obad', testament: 'OT', order: 31, chapters: 1  },
  { id: 32, name: 'Jonah',            abbreviation: 'Jonah',testament: 'OT', order: 32, chapters: 4  },
  { id: 33, name: 'Micah',            abbreviation: 'Mic',  testament: 'OT', order: 33, chapters: 7  },
  { id: 34, name: 'Nahum',            abbreviation: 'Nah',  testament: 'OT', order: 34, chapters: 3  },
  { id: 35, name: 'Habakkuk',         abbreviation: 'Hab',  testament: 'OT', order: 35, chapters: 3  },
  { id: 36, name: 'Zephaniah',        abbreviation: 'Zeph', testament: 'OT', order: 36, chapters: 3  },
  { id: 37, name: 'Haggai',           abbreviation: 'Hag',  testament: 'OT', order: 37, chapters: 2  },
  { id: 38, name: 'Zechariah',        abbreviation: 'Zech', testament: 'OT', order: 38, chapters: 14 },
  { id: 39, name: 'Malachi',          abbreviation: 'Mal',  testament: 'OT', order: 39, chapters: 4  },
  // New Testament
  { id: 40, name: 'Matthew',          abbreviation: 'Matt', testament: 'NT', order: 40, chapters: 28 },
  { id: 41, name: 'Mark',             abbreviation: 'Mark', testament: 'NT', order: 41, chapters: 16 },
  { id: 42, name: 'Luke',             abbreviation: 'Luke', testament: 'NT', order: 42, chapters: 24 },
  { id: 43, name: 'John',             abbreviation: 'John', testament: 'NT', order: 43, chapters: 21 },
  { id: 44, name: 'Acts',             abbreviation: 'Acts', testament: 'NT', order: 44, chapters: 28 },
  { id: 45, name: 'Romans',           abbreviation: 'Rom',  testament: 'NT', order: 45, chapters: 16 },
  { id: 46, name: '1 Corinthians',    abbreviation: '1Cor', testament: 'NT', order: 46, chapters: 16 },
  { id: 47, name: '2 Corinthians',    abbreviation: '2Cor', testament: 'NT', order: 47, chapters: 13 },
  { id: 48, name: 'Galatians',        abbreviation: 'Gal',  testament: 'NT', order: 48, chapters: 6  },
  { id: 49, name: 'Ephesians',        abbreviation: 'Eph',  testament: 'NT', order: 49, chapters: 6  },
  { id: 50, name: 'Philippians',      abbreviation: 'Phil', testament: 'NT', order: 50, chapters: 4  },
  { id: 51, name: 'Colossians',       abbreviation: 'Col',  testament: 'NT', order: 51, chapters: 4  },
  { id: 52, name: '1 Thessalonians',  abbreviation: '1Th',  testament: 'NT', order: 52, chapters: 5  },
  { id: 53, name: '2 Thessalonians',  abbreviation: '2Th',  testament: 'NT', order: 53, chapters: 3  },
  { id: 54, name: '1 Timothy',        abbreviation: '1Tim', testament: 'NT', order: 54, chapters: 6  },
  { id: 55, name: '2 Timothy',        abbreviation: '2Tim', testament: 'NT', order: 55, chapters: 4  },
  { id: 56, name: 'Titus',            abbreviation: 'Titus',testament: 'NT', order: 56, chapters: 3  },
  { id: 57, name: 'Philemon',         abbreviation: 'Phlm', testament: 'NT', order: 57, chapters: 1  },
  { id: 58, name: 'Hebrews',          abbreviation: 'Heb',  testament: 'NT', order: 58, chapters: 13 },
  { id: 59, name: 'James',            abbreviation: 'Jas',  testament: 'NT', order: 59, chapters: 5  },
  { id: 60, name: '1 Peter',          abbreviation: '1Pet', testament: 'NT', order: 60, chapters: 5  },
  { id: 61, name: '2 Peter',          abbreviation: '2Pet', testament: 'NT', order: 61, chapters: 3  },
  { id: 62, name: '1 John',           abbreviation: '1Jn',  testament: 'NT', order: 62, chapters: 5  },
  { id: 63, name: '2 John',           abbreviation: '2Jn',  testament: 'NT', order: 63, chapters: 1  },
  { id: 64, name: '3 John',           abbreviation: '3Jn',  testament: 'NT', order: 64, chapters: 1  },
  { id: 65, name: 'Jude',             abbreviation: 'Jude', testament: 'NT', order: 65, chapters: 1  },
  { id: 66, name: 'Revelation',       abbreviation: 'Rev',  testament: 'NT', order: 66, chapters: 22 },
];

export const BOOK_BY_ID = new Map(BIBLE_BOOKS.map(b => [b.id, b]));
export const BOOK_BY_ABBR = new Map(BIBLE_BOOKS.map(b => [b.abbreviation.toLowerCase(), b]));
export const BOOK_BY_NAME = new Map(BIBLE_BOOKS.map(b => [b.name.toLowerCase(), b]));
