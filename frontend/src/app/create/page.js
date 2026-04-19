'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateVideo() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [voice, setVoice] = useState('adam');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/proxy-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_text: prompt, voice_id: voice })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to create project');
      
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="center-box glass-card" style={{maxWidth:'600px'}}>
        <h2 className="text-center mb-2">Create New Video</h2>
        {error && <div className="err-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Prompt / Script</label>
            <textarea 
              rows="6" 
              required 
              placeholder="A futuristic city with flying cars at sunset..."
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>AI Voice Model</label>
            <select value={voice} onChange={(e)=>setVoice(e.target.value)}>
              <option value="adam">Adam (Deep & Professional)</option>
              <option value="rachel">Rachel (Calm & Clear)</option>
              <option value="drew">Drew (Energetic News)</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{width: '100%', marginTop: '1rem'}}>
            {loading ? 'Submitting...' : 'Generate Video'}
          </button>
        </form>
      </div>
    </div>
  );
}
