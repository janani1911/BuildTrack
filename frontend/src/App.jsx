import { useEffect, useMemo, useState } from 'react';
import { Activity, Building2, CheckCircle2, ClipboardList, HardHat, LayoutDashboard, MapPin, Pencil, Plus, Search, Trash2, Wallet, X } from 'lucide-react';
import { createProject, deleteProject, getProjects, updateProject } from './api';

const emptyForm = { name: '', client: '', location: '', status: 'Planning', budget: '', description: '' };
const money = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(amount || 0));

export default function App() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function loadProjects() {
    setLoading(true); setError('');
    try { const response = await getProjects(); setProjects(response.data); }
    catch { setError('Could not connect to the backend. Check that NestJS and MongoDB are running.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadProjects(); }, []);

  const filteredProjects = useMemo(() => projects.filter((project) => {
    const matchesSearch = `${project.name} ${project.client} ${project.location}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (filter === 'All' || project.status === filter);
  }), [projects, search, filter]);

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter((p) => p.status === 'In Progress').length,
    completed: projects.filter((p) => p.status === 'Completed').length,
    budget: projects.reduce((sum, p) => sum + Number(p.budget || 0), 0),
  }), [projects]);

  function openCreate() { setEditingId(null); setForm(emptyForm); setShowForm(true); }
  function openEdit(project) {
    setEditingId(project._id);
    setForm({ name: project.name, client: project.client, location: project.location, status: project.status, budget: String(project.budget), description: project.description || '' });
    setShowForm(true);
  }
  async function handleSubmit(event) {
    event.preventDefault(); setSaving(true); setError(''); setNotice('');
    const payload = { ...form, budget: Number(form.budget) };
    try {
      if (editingId) { await updateProject(editingId, payload); setNotice('Project updated successfully.'); }
      else { await createProject(payload); setNotice('Project created successfully.'); }
      setShowForm(false); setForm(emptyForm); setEditingId(null); await loadProjects();
    } catch (err) { setError(err.response?.data?.message?.join?.(', ') || err.response?.data?.message || 'Could not save project. Please check the form and backend.'); }
    finally { setSaving(false); }
  }
  async function handleDelete(project) {
    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    try { await deleteProject(project._id); setNotice('Project deleted.'); await loadProjects(); }
    catch { setError('Could not delete this project.'); }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><HardHat size={23}/></div><div><strong>BuildTrack</strong><span>CONSTRUCTION SUITE</span></div></div>
      <div className="nav-label">WORKSPACE</div>
      <div className="nav-item active"><LayoutDashboard size={18}/> Overview</div>
      <div className="nav-item"><Building2 size={18}/> Projects <span className="nav-count">{projects.length}</span></div>
      <div className="nav-item"><ClipboardList size={18}/> Tasks</div>
      <div className="nav-item"><Wallet size={18}/> Budget</div>
      <div className="sidebar-bottom"><div className="avatar">BT</div><div><strong>BuildTrack Demo</strong><span>Project workspace</span></div></div>
    </aside>

    <main className="main-content">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div><div className="top-right"><span className="live-dot"></span> System online <div className="top-avatar">BT</div></div></header>
      <section className="page-heading"><div><div className="eyebrow">PROJECT CONTROL CENTER</div><h1>Good morning, Team <span>👋</span></h1><p>Here’s what’s happening across your construction projects.</p></div><button className="primary-btn" onClick={openCreate}><Plus size={18}/> Add project</button></section>

      {notice && <div className="notice success"><CheckCircle2 size={17}/>{notice}<button onClick={() => setNotice('')}><X size={16}/></button></div>}
      {error && <div className="notice error">{error}<button onClick={() => setError('')}><X size={16}/></button></div>}

      <section className="stats-grid">
        <Stat icon={<Building2/>} label="Total projects" value={stats.total} note="Across your workspace" tone="green"/>
        <Stat icon={<Activity/>} label="In progress" value={stats.active} note="Currently active" tone="orange"/>
        <Stat icon={<CheckCircle2/>} label="Completed" value={stats.completed} note="Successfully delivered" tone="blue"/>
        <Stat icon={<Wallet/>} label="Total project budget" value={money(stats.budget)} note="Combined project value" tone="purple"/>
      </section>

      <section className="projects-panel">
        <div className="panel-heading"><div><h2>All projects</h2><p>Manage and track your construction work.</p></div><div className="project-tools"><div className="search-box"><Search size={17}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..."/></div><select value={filter} onChange={(e) => setFilter(e.target.value)}><option>All</option><option>Planning</option><option>In Progress</option><option>Completed</option></select></div></div>
        <div className="table-wrap"><table><thead><tr><th>PROJECT NAME</th><th>CLIENT</th><th>LOCATION</th><th>STATUS</th><th>BUDGET</th><th>ACTIONS</th></tr></thead><tbody>
          {loading ? <tr><td colSpan="6" className="empty-state">Loading projects...</td></tr> : filteredProjects.length === 0 ? <tr><td colSpan="6" className="empty-state"><div className="empty-icon"><Building2/></div><strong>No projects found</strong><span>Add a project or change your search.</span></td></tr> : filteredProjects.map((project) => <tr key={project._id}>
            <td><div className="project-name"><div className="project-icon"><Building2 size={17}/></div><div><strong>{project.name}</strong><span>{project.description || 'Construction project'}</span></div></div></td>
            <td>{project.client}</td><td><span className="location-cell"><MapPin size={14}/>{project.location}</span></td>
            <td><Status status={project.status}/></td><td className="budget-cell">{money(project.budget)}</td>
            <td><div className="actions"><button title="Edit project" onClick={() => openEdit(project)}><Pencil size={16}/></button><button title="Delete project" onClick={() => handleDelete(project)}><Trash2 size={16}/></button></div></td>
          </tr>)}
        </tbody></table></div>
        <div className="table-footer">Showing <strong>{filteredProjects.length}</strong> of <strong>{projects.length}</strong> projects <button onClick={loadProjects}>Refresh list ↻</button></div>
      </section>
      <footer>BuildTrack <span>·</span> Construction project management <span>·</span> Learning project</footer>
    </main>

    {showForm && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}><section className="modal"><div className="modal-heading"><div><div className="eyebrow">PROJECT DETAILS</div><h2>{editingId ? 'Edit project' : 'Add new project'}</h2><p>Enter the basic information below.</p></div><button className="close-btn" onClick={() => setShowForm(false)}><X/></button></div>
      <form onSubmit={handleSubmit}><label>Project name<input required minLength="2" value={form.name} onChange={(e) => setForm({...form, name:e.target.value})} placeholder="e.g. Green Valley Residency"/></label><div className="form-row"><label>Client name<input required minLength="2" value={form.client} onChange={(e) => setForm({...form, client:e.target.value})} placeholder="Client or company"/></label><label>Location<input required minLength="2" value={form.location} onChange={(e) => setForm({...form, location:e.target.value})} placeholder="City / Site location"/></label></div><div className="form-row"><label>Budget (₹)<input required type="number" min="0" value={form.budget} onChange={(e) => setForm({...form, budget:e.target.value})} placeholder="e.g. 2500000"/></label><label>Status<select value={form.status} onChange={(e) => setForm({...form, status:e.target.value})}><option>Planning</option><option>In Progress</option><option>Completed</option></select></label></div><label>Description <span className="optional">(optional)</span><textarea rows="3" value={form.description} onChange={(e) => setForm({...form, description:e.target.value})} placeholder="A short project description..."/></label><div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-btn" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save changes' : 'Create project'}</button></div></form>
    </section></div>}
  </div>;
}

function Stat({ icon, label, value, note, tone }) { return <article className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></article>; }
function Status({ status }) { const cls = status === 'Completed' ? 'completed' : status === 'In Progress' ? 'progress' : 'planning'; return <span className={`status-pill ${cls}`}><i/>{status}</span>; }
