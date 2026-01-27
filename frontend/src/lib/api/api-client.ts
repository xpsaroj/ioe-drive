/**
 * API base URL configuration.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

/**
 * Type definition for a function that provides an authentication token.
 */
type TokenProvider = () => Promise<string | null>;

/**
 * Base API Client class to handle HTTP requests.
 */
class ApiClient {
    private baseUrl: string;
    private tokenProvider?: TokenProvider;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    // Set the token provider function
    setTokenProvider(provider: TokenProvider) {
        this.tokenProvider = provider;
    }

    // Get headers with optional authentication token (Todo: inject token provider through a higher-level provider)
    private async getHeaders(includeAuth: boolean = true): Promise<Headers> {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        if (includeAuth) {
            const token = await this.tokenProvider?.();
            if (token) {
                headers.append('Authorization', `Bearer ${token}`);
            }
        }

        return headers;
    }

    // Handle the response and parse JSON
    private async handleResponse(response: Response) {
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'API request failed');
        }

        return result;
    }

    /**
     * Make a GET request to the specified endpoint.
     * @param endpoint - The API endpoint to call.
     * @param includeAuth - Whether to include the authentication token.
     * @returns The response data.
     */
    async get<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: await this.getHeaders(includeAuth),
        });

        return this.handleResponse(response);
    }

    /**
     * Make a POST request to the specified endpoint.
     * @param endpoint - The API endpoint to call.
     * @param body - The request payload.
     * @param includeAuth - Whether to include the authentication token.
     * @returns The response data.
     */
    async post<T>(endpoint: string, body?: unknown, includeAuth: boolean = true): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: await this.getHeaders(includeAuth),
            body: body ? JSON.stringify(body) : undefined,
        });

        return this.handleResponse(response);
    }

    /**
     * Make a PATCH request to the specified endpoint.
     * @param endpoint - The API endpoint to call.
     * @param body - The request payload.
     * @param includeAuth - Whether to include the authentication token.
     * @returns The response data.
     */
    async patch<T>(endpoint: string, body?: unknown, includeAuth: boolean = true): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PATCH',
            headers: await this.getHeaders(includeAuth),
            body: body ? JSON.stringify(body) : undefined,
        });

        return this.handleResponse(response);
    }

    /**
     * Make a PUT request to the specified endpoint.
     * @param endpoint - The API endpoint to call.
     * @param body - The request payload.
     * @param includeAuth - Whether to include the authentication token.
     * @returns The response data.
     */
    async put<T>(endpoint: string, body?: unknown, includeAuth: boolean = true): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: await this.getHeaders(includeAuth),
            body: body ? JSON.stringify(body) : undefined,
        });

        return this.handleResponse(response);
    }

    /**
     * Make a DELETE request to the specified endpoint.
     * @param endpoint - The API endpoint to call.
     * @param includeAuth - Whether to include the authentication token.
     * @returns The response data.
     */
    async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: await this.getHeaders(includeAuth),
        });

        return this.handleResponse(response);
    }
}

/**
 * A singleton instance of the ApiClient for use throughout the application.
 */
export const apiClient = new ApiClient(API_BASE_URL);