/**
 * API utility functions for the Next.js frontend.
 * This file centralizes all data fetching and defines the caching strategies
 * for different types of data (Catalog, Inventory, User Profile).
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://next-ecom-production.up.railway.app/';

/**
 * Fetch Product Catalog
 * Strategy: Time-based ISR
 * Supports filtering by category, brand, search, and pagination.
 */
export async function fetchCatalog(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v1/products${query ? `?${query}` : ''}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error('Failed to fetch catalog');
    const data = await res.json();

    // The backend returns ApiResponse structure: { success, message, data: { products, pagination } }
    return data.data?.products || [];
  } catch (error) {
    console.error('Error fetching catalog:', error);
    return [];
  }
}

/**
 * Fetch Single Product Detail
 * Strategy: Time-based ISR
 * Similar to the full catalog, we cache individual product data.
 */
export async function fetchProduct(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/products/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error('Failed to fetch product');
    return await res.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

/**
 * Fetch Inventory/Stock Level
 * Strategy: No Cache (Dynamic)
 * Stock levels change rapidly, so we bypass the cache entirely
 * and always fetch fresh data directly from the Express backend.
 */
export async function fetchInventory(productId) {
  try {
    // cache: 'no-store' ensures this request is never cached by Next.js
    const res = await fetch(`${API_BASE_URL}/v1/inventory/${productId}`, {
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch inventory');
    return await res.json();
  } catch (error) {
    console.error(`Error fetching inventory for ${productId}:`, error);
    return null;
  }
}

/**
 * Fetch User Profile
 * Strategy: Private / No Cache
 * User profiles contain sensitive data. We must not cache this globally.
 * In a real app, you would pass session cookies or a JWT token here.
 */
export async function fetchProfile(token) {
  try {
    // cache: 'no-store' prevents Next.js from caching private data.
    const res = await fetch(`${API_BASE_URL}/v1/users/profile`, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Profile fetch failed:', res.status, errorData);
      throw new Error(errorData.message || 'Failed to fetch profile');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * User Login
 */
export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/v1/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

/**
 * User Signup
 */
export async function signupUser(userData) {
  const res = await fetch(`${API_BASE_URL}/v1/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Signup failed');
  return data;
}

/**
 * Admin Login
 */
export async function loginAdmin(email, password) {
  // Assuming a separate endpoint for admin login, or same endpoint checking role.
  // Using a distinct endpoint for the example.
  const res = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Admin login failed');
  return data;
}
