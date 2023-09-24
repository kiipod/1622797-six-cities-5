import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { Offer, UserRole, CitiesName, Comforts, HouseType } from '../../types/index.js';
import chalk from 'chalk';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error(chalk.red('File was not read'));
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(
        ([
          title,
          description,
          date,
          city,
          preview,
          photos,
          isPremium,
          isFavorite,
          rating,
          houseType,
          rooms,
          guests,
          price,
          comforts,
          name,
          email,
          avatar,
          password,
          role,
          latitude,
          longitude,
        ]) => ({
          title: title,
          description: description,
          date: new Date(date),
          city: { name: CitiesName[city as keyof typeof CitiesName] },
          preview: preview,
          photos: photos.split(';'),
          isPremium: isPremium === 'true',
          isFavorite: isFavorite === 'true',
          rating: Number.parseInt(rating, 10),
          houseType: HouseType[houseType as keyof typeof HouseType],
          rooms: Number.parseInt(rooms, 10),
          guests: Number.parseInt(guests, 10),
          price: Number.parseInt(price, 10),
          comforts: comforts.split(';').map((comfort) => Comforts[comfort as keyof typeof Comforts]),
          author: {
            name: name,
            email: email,
            avatar: avatar,
            password: password,
            role: UserRole[role as keyof typeof UserRole],
          },
          location: {
            latitude: Number.parseFloat(latitude),
            longitude: Number.parseFloat(longitude),
          },
        })
      );
  }
}
