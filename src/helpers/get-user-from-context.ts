import { USER_HEADER } from '../constants/headers';
import { GqlContext } from '../interfaces/gql-context.interface';
import { IUserPayload } from '../interfaces/user-payload.interface';

/*
  Get user context from request
*/
export const getUserFromContext = async ({
  req,
  request,
}: {
  req: any;
  request: any;
}): Promise<GqlContext | undefined> => {
  // Express context
  if (req) {
    if (String(req.body?.query).includes('ApolloGetServiceDefinition')) {
      return;
    }
    const user: IUserPayload = JSON.parse(request.headers[USER_HEADER]);
    return { user };
  }
  // Fastify context
  if (request) {
    if (String(request.body?.query).includes('ApolloGetServiceDefinition')) {
      return;
    }
    const user: IUserPayload = JSON.parse(request.headers[USER_HEADER]);
    return { user };
  }
  return;
};
