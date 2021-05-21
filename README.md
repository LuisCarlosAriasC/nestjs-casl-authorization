<h1 align="center"></h1>

<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="150" alt="Nest Logo" />
  </a>
</div>

<h3 align="center">NestJS CASL Authorization</h3>

<div align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://img.shields.io/badge/built%20with-NestJs-red.svg" alt="Built with NestJS">
  </a>
</div>

This package contains CASL integration for NestJS microservices

## Instructions

### Installation

```bash
yarn add nestjs-casl-authorization
```

### Importing Module

```typescript
import { Module } from '@nestjs/common';
import {
  AuthorizationModule,
} from 'nestjs-casl-authorization';

@Module({
  imports: [
    AuthorizationModule
  ],
})
export class AppModule {}
```

## Use guard

### Global guard

You can use the Authorization guard for all your resolvers, you just have to include it in the providers section of the app.module

```typescript
import { Module } from '@nestjs/common';
import {
  AuthorizationModule,
  AuthorizationGuard,
} from 'nestjs-casl-authorization';

@Module({
  imports: [
    AuthorizationModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
})
export class AppModule {}
```

### Scoped guard

Import Authorize decorator and implement it on the desired resolver

```typescript
import { Resolver } from '@nestjs/graphql';
import { Authorize } from 'nestjs-casl-authorization';

@Authorize()
@Resolver(() => MyResolverDTO)
export class MyResolver {
  constructor() {}
}
```

In your resolver you can implement the GrantPermission interface and the CheckPermissions to grant permissions to a user with an action and a scope.

```typescript
import { Resolver, Query } from '@nestjs/graphql';
import
import {
  Authorize,
  CheckPermissions,
  GrantPermission
} from 'nestjs-casl-authorization';

// This Authorize decorator can be avoided if the guard is globally scoped.
@Authorize()
@Resolver(() => MyResolverDTO)
export class MyResolver {
  constructor() {}

  /* If the user coming from the context has this permission
  { action: 'read', scope: 'my-resolver.hello' }, permission will be granthed */
  @CheckPermissions(new GrantPermission('read', 'my-resolver.hello'))
  @Query(() => String)
  public async hello(): Promise<DeleteOneResponseDTO> {
    return 'Hello'
  }
}
```

## Create permissions

You can implement your permissions by implementing the IPermissionHandler
interface providing an action and a subject

```typescript
import { IPermissionHandler } from 'nestjs-casl-authorization';

export class MyPermission implements IPermissionHandler {
  constructor(readonly action: string, readonly subject: string) {}

  handle(ability: any) {
    return ability.can(this.action, this.subject);
  }
}
```

In your resolver you can implement your custom permission with the
CheckPermissions decorator by providing the action and a scope.

```typescript
import { Resolver, Query } from '@nestjs/graphql';
import { MyPermission } from './my-permission.ts';
import
import {
  Authorize,
  CheckPermissions,
} from 'nestjs-casl-authorization';

// This Authorize decorator can be avoided if the guard is globally scoped.
@Authorize()
@Resolver(() => MyResolverDTO)
export class MyResolver {
  constructor() {}

  /* If the user coming from the context has this permission
  { action: 'read', scope: 'my-resolver.hello' }, permission will be granthed */
  @CheckPermissions(new MyPermission('read', 'my-resolver.hello'))
  @Query(() => String)
  public async hello(): Promise<DeleteOneResponseDTO> {
    return 'Hello'
  }
}
```


## Implementation with Graphql Federation

There may be some cases where you need to import the user from the context, in this case we get an user object from the headers to implement authorization through services. To do so yo can import the "getUserFromContext" custom helper. It will add an IUserPaylod inteface to the request context that we will be able to use in the resolvers.

### Importing Sync

```typescript
import { Module } from '@nestjs/common';
import {
  AuthorizationModule,
  getUserFromContext,
} from 'nestjs-casl-authorization';

@Module({
  imports: [
    AuthorizationModule,
    GraphQLFederationModule.forRoot({
      context: async ({ req, request }): Promise<GqlContext> => {
        return await getUserFromContext({ req, request });
      },
    }),
  ],
})
export class AppModule {}
```

If you need info from the user in the context you can use the CurrentUser
decorator.

```typescript
import { Resolver, Query } from '@nestjs/graphql';
import { MyPermission } from './my-permission.ts';
import
import {
  Authorize,
  CheckPermissions,
  CurrentUser,
  IUserPayload
} from 'nestjs-casl-authorization';

// This Authorize decorator can be avoided if the guard is globally scoped.
@Authorize()
@Resolver(() => MyResolverDTO)
export class MyResolver {
  constructor() {}

  /* If the user coming from the context has this permission
  { action: 'read', scope: 'my-resolver.hello' }, permission will be granthed */
  @CheckPermissions(new MyPermission('read', 'my-resolver.hello'))
  @Query(() => String)
  public async hello(
      @CurrentUser() user: IUserPayload
  ): Promise<DeleteOneResponseDTO> {
    return `Hello user: ${JSON.stringify(user)}`
  }
}
```

## Change Log

See [Changelog](CHANGELOG.md) for more information.

## Author

**Luis Carlos Arias**

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.