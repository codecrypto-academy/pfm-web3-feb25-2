import { Role } from './role.model';

export interface User {
    ethereumAddress: string;
    role: Role;
}