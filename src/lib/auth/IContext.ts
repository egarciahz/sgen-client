import { IUser } from '../../schema';

export interface AuthContext {
    user?: IUser | null;
    userId: string | null;
    token: string | null;
    logout(): void;
}
