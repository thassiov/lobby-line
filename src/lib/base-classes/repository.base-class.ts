import { setupLogger } from '../logger';

class BaseRepository {
  protected logger;

  constructor(moduleName: string) {
    this.logger = setupLogger(moduleName);
  }
}

export { BaseRepository };
