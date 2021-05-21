import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { PermissionHandler } from '../interfaces/permission-handler.interface';

export const CHECK_PERMISSIONS_KEY = 'check_permission';
export const CheckPermissions = (
  ...handlers: PermissionHandler[]
): CustomDecorator<string> => SetMetadata(CHECK_PERMISSIONS_KEY, handlers);
