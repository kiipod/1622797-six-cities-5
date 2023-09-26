import { resolve } from 'node:path';
import { Command } from './command.interface.js';
import { readFileSync } from 'node:fs';
import chalk from 'chalk';

type PackageJsonConfig = {
  version: string;
}

const isPackageJSONConfig = (value: unknown) : value is PackageJsonConfig => (
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  Object.hasOwn(value, 'version')
);

export class VersionCommand implements Command {

  constructor(
    private readonly filePath: string = './package.json'
  ) {}

  private readVersion() : string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf-8');
    const importedContent : unknown = JSON.parse(jsonContent);

    if (!isPackageJSONConfig(importedContent)) {
      throw new Error(chalk.red('failed to parse json content'));
    }

    return importedContent.version;
  }

  getName(): string {
    return '--version';
  }

  public execute(..._parameters: string[]): void {
    try {
      const version = this.readVersion();
      console.info(chalk.bgGreen(version));
    } catch (error: unknown) {
      console.error(chalk.red(`Failed to read version from ${this.filePath}`));

      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
    }
  }
}
