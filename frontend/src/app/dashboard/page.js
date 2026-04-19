import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function getProjects(token) {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/projects/', {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return redirect('/login');

  const projects = await getProjects(token);

  if (!projects) {
    return <div className="container"><p className="err-msg">Failed to load projects. Ensure backend is running.</p></div>;
  }

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '2rem'}}>
        <h2>Your Projects</h2>
        <Link href="/create" className="btn-primary">Generate New Video</Link>
      </div>
      <div className="project-list">
        {projects.length === 0 ? (
          <div className="glass-card text-center" style={{gridColumn: '1 / -1'}}>
            <p className="mb-1">You haven't generated any videos yet.</p>
          </div>
        ) : (
          projects.map(p => (
            <div key={p.id} className="project-card">
              <p style={{fontStyle:'italic', color:'var(--text-secondary)', marginBottom:'1rem'}}>"{p.prompt_text.substring(0, 80)}{p.prompt_text.length > 80 ? '...' : ''}"</p>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span className={`status-badge status-${p.status}`}>{p.status}</span>
                {p.video_url && <a href={p.video_url} target="_blank" className="btn-primary" style={{padding:'0.4rem 0.8rem', fontSize:'0.8rem'}}>View Video</a>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
