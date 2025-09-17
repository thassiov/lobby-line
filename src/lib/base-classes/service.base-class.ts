import { setupLogger } from '../logger';

class BaseService {
  protected logger;

  constructor(moduleName: string) {
    this.logger = setupLogger(moduleName);
  }
}

export { BaseService };
