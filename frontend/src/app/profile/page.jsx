import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchProfile } from '../../lib/api';

/**
 * User Profile Page
 * 
 * Rendering Strategy: SSR (Server-Side Rendering)
 * Performance & Caching:
 * 1. Because this page contains private, user-specific data, it MUST NOT be cached
 *    globally by Next.js or a CDN.
 * 2. By using `cookies()`, Next.js automatically opts this page into dynamic rendering (SSR).
 *    This means the HTML is generated on the server for EVERY request.
 * 3. The `fetchProfile` function uses `cache: 'no-store'` to ensure fresh data is always
 *    fetched from the Express backend using the user's session token.
 */
export default async function ProfilePage() {
  // In Next.js 15+, cookies() is an async function or requires await depending on exact version.
  // Next 16 might require awaiting cookies.
  const cookieStore = await cookies();
  
  // Assuming the Express backend sets a 'session_token' cookie upon login
  const token = cookieStore.get('session_token')?.value;

  // If there is no token, redirect the user to the login page
  if (!token) {
    redirect('/login');
  }

  // Fetch the private profile data dynamically on the server
  const profileResponse = await fetchProfile(token);
  const profile = profileResponse?.data;

  // If the token is invalid or expired, the backend returns null/error
  if (!profile) {
    redirect('/login');
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg dark:bg-gray-800">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            User Profile
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Personal details and application. (Dynamically rendered via SSR)
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0 dark:border-gray-700">
          <dl className="sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-700">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Full name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">
                {profile ? `${profile.firstName} ${profile.lastName}` : 'Loading...'}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">
                {profile?.email || 'N/A'}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Account Status
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">
                {profile?.role || 'User'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
