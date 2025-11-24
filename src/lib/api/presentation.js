const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const fetchWithAuth = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response.json();
};

export const presentationAPI = {
  create: async (data) => {
    return fetchWithAuth(`${API_BASE}/presentation`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/presentation${queryString ? `?${queryString}` : ""}`;
    return fetchWithAuth(url);
  },

  getById: async (id) => {
    return fetchWithAuth(`${API_BASE}/presentation/${id}`);
  },

  update: async (id, data) => {
    return fetchWithAuth(`${API_BASE}/presentation/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`${API_BASE}/presentation/${id}`, {
      method: "DELETE",
    });
  },

  duplicate: async (id) => {
    return fetchWithAuth(`${API_BASE}/presentation/${id}/duplicate`, {
      method: "POST",
    });
  },
};