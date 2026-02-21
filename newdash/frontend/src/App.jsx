import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { 
  Zap, Users, CreditCard, Shield, 
  RefreshCw, LayoutDashboard, UserPlus, Trash2 
} from 'lucide-react';

const App = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '',
    monthly_budget: 500
  });

  const fetchData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/analytics/dashboard/');
      setData(res.data);
      setLoading(false);
      setTimeout(() => setIsSyncing(false), 800);
    } catch (err) {
      console.error("Fetch Error:", err);
      // Fallback Demo Data
      setData({
        global_stats: { total_network_spend: 2.52, remaining_credit: 4997.48, total_recruiters: 8 },
        recruiters: [
          { id: "a1111111-1111-1111-1111-111111111111", name: "Sarah Jenkins", email: "sarah@jenkins.com", interviews_completed: 20, total_spent: 0.038 },
          { id: 2, name: "Mike Miller", email: "mike@miller.co", interviews_completed: 5, total_spent: 0.530 },
        ],
        recruiter_breakdown: [] 
      });
      setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddRecruiter = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/recruiter-service/', formData);
      setFormData({ name: '', email: '', monthly_budget: 500 });
      fetchData(); 
      setActiveTab('dashboard'); 
      alert("Recruiter initialized successfully!");
    } catch (err) {
      alert("Error: " + JSON.stringify(err.response?.data));
    }
  };

  const handleDelete = async (recruiterId) => {
    if (!window.confirm("Are you sure you want to delete this recruiter? This action cannot be undone.")) {
      return;
    }

    try {
      // API call to the UUID-based endpoint
      await axios.delete(`http://127.0.0.1:8000/api/recruiter-service/${recruiterId}/`);

      // Update local state for both possible data structures to ensure UI sync
      setData(prevData => ({
        ...prevData,
        // Filter the management list
        recruiters: prevData.recruiters ? prevData.recruiters.filter(r => r.id !== recruiterId) : [],
        // Filter the analytics breakdown if it exists
        recruiter_breakdown: prevData.recruiter_breakdown ? prevData.recruiter_breakdown.filter(r => r.id !== recruiterId) : []
      }));

      alert(" deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete. Please check if the server is running.");
    }
  };

  if (loading) return <div style={centerStyle}>✨ Loading Admin Engine...</div>;

  const stats = data?.global_stats || { total_network_spend: 0, remaining_credit: 0 };
  const recruiters = data?.recruiters || [];
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#db2777', '#06b6d4', '#64748b'];

  return (
    <div style={containerStyle}>
      {/* SIDEBAR */}
      <aside style={navSidebar}>
        <div style={logoWrapper}>
          <Zap size={24} color="#db2777" fill="#db2777" />
          <h2 style={{color: '#fff', margin: 0, fontSize: '1.2rem'}}>Admin.AI</h2>
        </div>

        <nav style={navLinks}>
          <button onClick={() => setActiveTab('dashboard')} style={activeTab === 'dashboard' ? activeNavItem : navItem}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('manage')} style={activeTab === 'manage' ? activeNavItem : navItem}>
            <UserPlus size={20} /> Manage
          </button>
        </nav>

        <div style={{marginTop: 'auto', color: '#10b981', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center'}}>
           <Shield size={14} style={{marginRight: 5}}/> System Secure
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div style={mainWrapper}>
        <header style={topHeader}>
          <h2 style={{margin: 0, color: '#000', fontSize: '1.4rem', fontWeight: '800'}}>
            {activeTab === 'dashboard' ? "Network Analytics" : "Recruiter Management"}
          </h2>
          <button style={refreshBtn} onClick={fetchData}>
            <RefreshCw size={18} color="#64748b" className={isSyncing ? "spin-animation" : ""} />
          </button>
        </header>

        <div style={contentScroll}>
          {activeTab === 'dashboard' ? (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={efficiencyBar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={greenShield}><Shield size={20} color="#10b981" /></div>
                  <div>
                    <div style={effLabel}>SYSTEM HEALTH EFFICIENCY</div>
                    <div style={effValue}>
                      Efficiency: <strong>{recruiters.reduce((acc, r) => acc + (r.interviews_completed || 0), 0)}</strong> Interviews / 
                      <strong> ${stats.total_network_spend.toFixed(2)}</strong> Spend
                    </div>
                  </div>
                </div>
                <div style={targetBadge}>Target Achieved</div>
              </div>

              <div style={metricGrid}>
                <div style={whiteCard}>
                  <CreditCard size={20} color="#ef4444" style={{ marginBottom: '15px' }} />
                  <div style={cardLabel}>Total Spend</div>
                  <div style={cardValue}>${stats.total_network_spend.toFixed(2)}</div>
                </div>
                <div style={whiteCard}>
                  <RefreshCw size={20} color="#10b981" style={{ marginBottom: '15px' }} />
                  <div style={cardLabel}>Credits Remaining</div>
                  <div style={cardValue}>$4997.48</div>
                </div>
                <div style={whiteCard}>
                  <Users size={20} color="#3b82f6" style={{ marginBottom: '15px' }} />
                  <div style={cardLabel}>Active Recruiters</div>
                  <div style={cardValue}>{recruiters.length}</div>
                </div>
              </div>

              <div style={mainGrid}>
                <div style={contentCard}>
                  <h3 style={sectionTitle}>Recruiter Performance</h3>
                  <table style={perfTable}>
                    <thead>
                      <tr style={tableHeader}>
                        <th align="left">Recruiter</th>
                        <th align="left">COMPLETED</th>
                        <th align="left">TOKEN/MIN</th>
                        <th align="left">COST</th>
                        <th align="left">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recruiters.map((r) => (
                        <tr key={r.id} style={tableRowStyle}>
                          <td style={tdBold}>{r.name}</td>
                          <td>{r.interviews_completed || 0}</td>
                          <td>{Math.floor(Math.random() * 500)}</td>
                          <td>${(r.total_spent || 0).toFixed(3)}</td>
                          <td>
                            <span style={r.interviews_completed > 10 ? effBadge : wordyBadge}>
                              {r.interviews_completed > 10 ? 'Efficient' : '⚠️ Wordy'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={contentCard}>
                  <h3 style={sectionTitle}>Spend Distribution</h3>
                  <div style={{ height: '280px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={recruiters} dataKey="total_spent" nameKey="name" innerRadius={70} outerRadius={95} paddingAngle={8}>
                          {recruiters.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ReTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* --- MANAGEMENT PAGE --- */
            <div style={manageGrid}>
              <div style={formCard}>
                <h3 style={{color: '#1e293b', marginTop: 0, fontWeight: '800'}}>Register Recruiter</h3>
                <form onSubmit={handleAddRecruiter}>
                  <label style={labelStyle}>Full Name</label>
                  <input style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Sarah Jenkins" required />
                  <label style={labelStyle}>Email</label>
                  <input style={inputStyle} type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="sarah@jenkins.com" required />
                  <label style={labelStyle}>Monthly Budget ($)</label>
                  <input style={inputStyle} type="number" value={formData.monthly_budget} onChange={e => setFormData({...formData, monthly_budget: e.target.value})} required />
                  <button type="submit" style={submitBtn}>Initialize Recruiter</button>
                </form>
              </div>

              <div style={listCard}>
                <h3 style={{color: '#fff', marginTop: 0, fontWeight: '800'}}>Active Network</h3>
                <div style={tableWrapper}>
                  {recruiters.map(r => (
                    <div key={r.id} style={mgmtRow}>
                      <div>
                        <div style={{fontWeight: '800', color: '#1e293b'}}>{r.name}</div>
                        <div style={{fontSize: '0.8rem', color: '#64748b'}}>{r.email}</div>
                      </div>
                      <button 
                        style={deleteBtn} 
                        onClick={() => handleDelete(r.id)}
                        title="Delete Recruiter"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// --- STYLES OBJECT ---
const containerStyle = { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f1f5f9', overflow: 'hidden', fontFamily: '"Inter", sans-serif' };
const navSidebar = { width: '260px', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', padding: '30px 20px' };
const logoWrapper = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' };
const navLinks = { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 };
const navItem = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', borderRadius: '12px', color: '#94a3b8', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', textAlign: 'left', fontWeight: '600', transition: '0.2s' };
const activeNavItem = { ...navItem, backgroundColor: '#3b82f6', color: '#fff' };
const mainWrapper = { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' };
const topHeader = { height: '80px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' };
const refreshBtn = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '12px', cursor: 'pointer' };
const contentScroll = { flex: 1, overflowY: 'auto', padding: '30px 40px' };
const efficiencyBar = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px 25px', borderRadius: '15px', borderLeft: '8px solid #10b981', marginBottom: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' };
const greenShield = { padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '12px' };
const effLabel = { fontSize: '0.7rem', color: '#94a3b8', fontWeight: 'bold' };
const effValue = { fontSize: '0.9rem', color: '#334155' };
const targetBadge = { backgroundColor: '#dcfce7', color: '#166534', padding: '6px 15px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' };
const metricGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' };
const whiteCard = { backgroundColor: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' };
const cardLabel = { color: '#64748b', fontSize: '0.9rem', fontWeight: '600', marginBottom: '5px' };
const cardValue = { color: '#1e293b', fontSize: '1.8rem', fontWeight: '800' };
const mainGrid = { display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '25px' };
const contentCard = { backgroundColor: '#fff', padding: '25px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' };
const sectionTitle = { fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px', color: '#1e293b' };
const perfTable = { width: '100%', borderCollapse: 'collapse' };
const tableHeader = { color: '#101111', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tableRowStyle = { color: '#475569', borderBottom: '1px solid #f1f5f9' };
const tdBold = { fontWeight: '700', padding: '16px 0', color: '#334155', fontSize: '0.9rem' };
const effBadge = { backgroundColor: '#dcfce7', color: '#10b981', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold' };
const wordyBadge = { backgroundColor: '#ffedd5', color: '#f59e0b', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold' };
const manageGrid = { display: 'grid', gridTemplateColumns: '400px 1fr', gap: '30px' };
const formCard = { backgroundColor: '#fff', padding: '35px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #f1f5f9', marginBottom: '20px', backgroundColor: '#f8fafc', fontSize: '1rem' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '800', color: '#64748b', fontSize: '0.8rem' };
const submitBtn = { width: '100%', padding: '16px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' };
const listCard = { backgroundColor: '#1e293b', padding: '30px', borderRadius: '24px' };
const tableWrapper = { display: 'flex', flexDirection: 'column', gap: '12px' };
const mgmtRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px', borderRadius: '16px', backgroundColor: '#fff' };
const deleteBtn = { color: '#ef4444', backgroundColor: '#fef2f2', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer', transition: '0.2s', ':hover': { backgroundColor: '#fee2e2' } };
const centerStyle = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', backgroundColor: '#f1f5f9' };

export default App;