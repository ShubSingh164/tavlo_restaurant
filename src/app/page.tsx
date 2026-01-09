/**
 * Tavlo Restaurant ERP - Root Page
 * 
 * Redirects to the dashboard page.
 * 
 * @backend Replace with auth check - redirect to login if not authenticated
 */

import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to dashboard
  redirect('/dashboard');
}
