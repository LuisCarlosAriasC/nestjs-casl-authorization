import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IUserPayload } from '../interfaces/user-payload.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): IUserPayload => {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().user;
  },
);
