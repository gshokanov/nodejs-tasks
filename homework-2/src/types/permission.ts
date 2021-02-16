export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';
export type Permissions = Array<Permission>;
export const permissions: Permissions = ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'];
