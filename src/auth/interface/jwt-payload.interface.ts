import { RoleType } from '../../shared/enum/role-type.enum';

export interface JwtPayload {
  readonly upn: string;
  readonly id: string;
  readonly email: string;
  readonly roles: RoleType[];
}
