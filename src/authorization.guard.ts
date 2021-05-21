import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { AuthorizationAbilityFactory } from './authorization-ability.factory';
import { PermissionHandler } from './interfaces/permission-handler.interface';
import { CHECK_PERMISSIONS_KEY } from './decorators/check-permissions.decorator';
import { Ability, AbilityTuple, MongoQuery, Subject } from '@casl/ability';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { IUserPayload } from './interfaces/user-payload.interface';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authorizationAbilityFactory: AuthorizationAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context);
    const policyHandlers =
      this.reflector.get<PermissionHandler[]>(
        CHECK_PERMISSIONS_KEY,
        gqlContext.getHandler(),
      ) || [];
    if (!gqlContext.getContext().user) {
      return false;
    }
    const user: IUserPayload = gqlContext.getContext().user;
    const permissions = user.permissions.map((p) => ({
      action: p.action,
      subject: p.subject,
    }));
    const ability = this.authorizationAbilityFactory.createForUser(permissions);
    return policyHandlers.some((handler) =>
      this.execPermissionHandler(handler, ability),
    );
  }

  private execPermissionHandler(
    handler: PermissionHandler,
    ability: Ability<
      AbilityTuple<string, Subject>,
      MongoQuery<Record<string | number | symbol, unknown>>
    >,
  ) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
