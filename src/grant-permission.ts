import { IPermissionHandler } from './interfaces';

export class GrantPermission implements IPermissionHandler {
  constructor(readonly action: string, readonly subject: string) {}

  handle(ability: any) {
    return ability.can(this.action, this.subject);
  }
}
