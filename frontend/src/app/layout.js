import './globals.css';
import Link from 'next/link';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Studio Pilot - AI Video Generation',
  description: 'Generate stunning videos via AI.',
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const hasToken = cookieStore.has('token');

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <nav className="navbar">
          <Link href="/" className="logo">Studio Pilot</Link>
          <div className="nav-links">
            {hasToken ? (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/pricing" style={{marginLeft:'2rem'}}>Pricing</Link>
                <Link href="/create" className="btn-primary" style={{marginLeft:'2rem'}}>Create Video</Link>
                <Link href="/api/logout" style={{marginLeft:'2rem', color:'#ff7675'}}>Logout</Link>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register" className="btn-primary" style={{marginLeft:'2rem'}}>Sign Up</Link>
              </>
            )}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
