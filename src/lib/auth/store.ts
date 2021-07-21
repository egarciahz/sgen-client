export const TOKEN_KEY = 'jwt-token-stractor';

export function tokenStractor(useBearer = true): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    return token && useBearer ? `Bearer ${token}` : token;
}

export function storeToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}
