export interface Dog {
  Imie: string;
  Plec: string;
  Rasa: string;
  Wiek: number;
  userId: string;
  photo: string;
  opis: string;
  voivodeship: string;
}

export interface DogWithId extends Dog {
  id: string;
}

export type Dogs = Record<string, Dog>;
