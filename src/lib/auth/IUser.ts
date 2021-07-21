export default interface IUser {
    permissions: Array<any>;
    roles: Array<any>;
    tenantId: string;
    ownerId: string;
    email: string;
    id: number;
}
