import { IUserPayload } from './user-payload.interface';

export interface GqlContext {
  user: IUserPayload;
}
