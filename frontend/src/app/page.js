import Link from 'next/link';

export default function Home() {
  return (
    <div className="container" style={{justifyContent: 'center', alignItems: 'center'}}>
      <div className="text-center" style={{maxWidth: '800px'}}>
        <h1 style={{fontSize: '4rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #a29bfe, #6c5ce7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
          Scale Your Video Production with AI
        </h1>
        <p style={{fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.6'}}>
          Enter a prompt and instantly generate high-quality videos, completely voiced over,
          captioned, and ready to publish. Studio Pilot uses cutting-edge AI to automate
          the heavy lifting of content creation.
        </p>
        <Link href="/register" className="btn-primary" style={{fontSize: '1.2rem', padding: '1rem 2rem'}}>
          Start For Free
        </Link>
      </div>
    </div>
  );
}
