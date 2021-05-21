import { Ability, AbilityTuple, MongoQuery, Subject } from '@casl/ability';

export interface IPermissionHandler {
  handle(
    ability: Ability<
      AbilityTuple<string, Subject>,
      MongoQuery<Record<string | number | symbol, unknown>>
    >,
  ): boolean;
}

export type PermissionHandlerCallback = (
  ability: Ability<
    AbilityTuple<string, Subject>,
    MongoQuery<Record<string | number | symbol, unknown>>
  >,
) => boolean;

export type PermissionHandler = IPermissionHandler | PermissionHandlerCallback;
