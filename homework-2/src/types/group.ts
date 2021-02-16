import { Permissions } from './permission';

export interface Group {
    id?: string;
    name: string;
    permissions: Permissions;
}
