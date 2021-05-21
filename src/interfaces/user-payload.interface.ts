import { IPermission } from './permission.interface';

export interface IUserPayload {
  userId: string;
  permissions: IPermission[];
}
