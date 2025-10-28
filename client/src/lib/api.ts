const API_BASE_URL = "/api/v1";

interface ApiOptions extends RequestInit {
  data?: unknown;
}

async function apiCall<T>(
  url: string,
  method: string,
  options?: ApiOptions
): Promise<T> {
  const { data, headers, ...rest } = options || {};

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || "An API error occurred");
  }

  // Handle 204 No Content for DELETE or other empty responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T; // Return an empty object for void responses
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(url: string, options?: Omit<ApiOptions, 'data' | 'method'>) =>
    apiCall<T>(url, "GET", options),
  post: <T>(url: string, data: unknown, options?: OOmit<ApiOptions, 'data' | 'method'>) =>
    apiCall<T>(url, "POST", { ...options, data }),
};