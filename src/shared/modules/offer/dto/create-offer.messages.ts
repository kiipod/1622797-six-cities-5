export const CreateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  date: {
    invalidFormat: 'Date must be a valid ISO date',
  },
  preview: {
    maxLength: 'Too short for field «photos»',
  },
  photos: {
    invalidFormat: 'Photos must be an array',
    maxLength: 'Too short for field «photos»',
    invalidSize: 'Should always be 6 images',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000',
  },
  city: {
    invalid: 'City must be one of: Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf',
  },
  houseType: {
    invalid: 'houseType must be one of: apartment, house, room, hotel',
  },
  isPremium: {
    invalidFormat: 'isPremium must be a boolean',
  },
  comforts: {
    invalidFormat: 'Comforts must be an array',
    invalid: 'Must be Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels, Fridge',
  },
  guests: {
    invalidFormat: 'Guests must be an integer',
    minValue: 'Minimum guest amount is 1',
    maxValue: 'Maximum guest amount is 10',
  },
  rooms: {
    invalidFormat: 'Rooms must be an integer',
    minValue: 'Minimum room amount is 1',
    maxValue: 'Maximum room amount is 8',
  },
  authorId: {
    invalidId: 'authorId field must be a valid id',
  },
  location: {
    invalidFormat: 'Latitude or longitude must be a coordinate',
  }
} as const;
