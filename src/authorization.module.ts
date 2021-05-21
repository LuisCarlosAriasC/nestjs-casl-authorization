import { Module } from '@nestjs/common';
import { AuthorizationAbilityFactory } from './authorization-ability.factory';
import { AuthorizationGuard } from './authorization.guard';

@Module({
  providers: [AuthorizationAbilityFactory, AuthorizationGuard],
  exports: [AuthorizationAbilityFactory, AuthorizationGuard]
})
export class AuthorizationModule {}
