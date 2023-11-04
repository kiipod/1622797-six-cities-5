import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { ApplicationError, ValidationErrorField } from '../libs/rest/index.js';

// Функция отвечает за генерацию рандомных значений
export function generateRandomValue(min:number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

// Функция отвечает за получение рандомных значений
export function getRandomItems<T>(items: T[]):T[] {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

// Функция отвечает за получение рандомного значения
export function getRandomItem<T>(items: T[]):T {
  return items[generateRandomValue(0, items.length - 1)];
}

// Функция отвечает за получение сообщения ошибки
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

// Функция отвечает за преобразование DTO
export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}

// Функция отвечает за создание объекта с ошибкой
export function createErrorObject(errorType: ApplicationError, error: string, details: ValidationErrorField[] = []) {
  return { errorType, error, details };
}

// Функция отвечает за трансформацию списка ошибок
export function reduceValidationErrors(errors: ValidationError[]): ValidationErrorField[] {
  return errors.map(({ property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));
}

// Функция отвечает за получение хоста сервера
export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}
