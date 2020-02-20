import { Permissions } from './permission';

export interface Group {
    id?: number;
    name: string;
    permissions: Permissions;
}
