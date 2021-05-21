import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../authorization.guard';

export const Authorize = (): any => {
  return applyDecorators(UseGuards(AuthorizationGuard));
};
