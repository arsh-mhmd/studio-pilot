'use client';

import { useState } from 'react';

export default function Pricing() {
  const [loading, setLoading] = useState(false);

  const startCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/proxy-stripe', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; 
      }
    } catch(err) {
      alert("Error starting checkout");
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{justifyContent: 'center', alignItems: 'center'}}>
      <div className="glass-card text-center" style={{padding: '3rem', maxWidth: '500px'}}>
        <h2 style={{fontSize:'2.5rem', marginBottom:'1rem'}}>Pro Plan</h2>
        <p style={{fontSize:'1.2rem', color:'var(--text-secondary)', marginBottom:'2rem'}}>
          Unlock unlimited API generations, high-resolution upscaling, and premium 4K models.
        </p>
        <h3 style={{fontSize:'2rem', marginBottom:'2rem'}}>$29.99 / month</h3>
        <button onClick={startCheckout} disabled={loading} className="btn-primary" style={{width:'100%', fontSize:'1.2rem', padding:'1rem'}}>
          {loading ? 'Routing to Stripe...' : 'Upgrade Now'}
        </button>
      </div>
    </div>
  );
}
