import { Injectable } from '@nestjs/common';
import {
  Ability,
  MongoQuery,
  SubjectRawRule,
  SubjectType,
} from '@casl/ability';

@Injectable()
export class AuthorizationAbilityFactory {
  createForUser(
    permissions: SubjectRawRule<
      string,
      SubjectType,
      MongoQuery<Record<string | number | symbol, unknown>>
    >[],
  ): Ability {
    return new Ability(permissions);
  }
}
