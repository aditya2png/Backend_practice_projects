import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Users, Activity, CreditCard, Search, 
  PieChart, CheckCircle, RefreshCw, Share2, Zap 
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function App() {
  const [data, setData] = useState(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  
  const dashboardRef = useRef(null);

  const fetchData = useCallback(() => {
    setIsSyncing(true);
    axios.get('http://127.0.0.1:8000/api/dashboard/stats/')
      .then(res => {
        setData(res.data);
        if (!selectedRecruiter && res.data.recruiter_breakdown?.length > 0) {
          setSelectedRecruiter(res.data.recruiter_breakdown[0]);
        }
        setTimeout(() => setIsSyncing(false), 400);
      })
      .catch(err => {
        console.error("API Error:", err);
        setIsSyncing(false);
      });
  }, [selectedRecruiter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const exportPDF = async () => {
    if (!selectedRecruiter) return;
    setIsPrinting(true);

    setTimeout(async () => {
      const element = dashboardRef.current;
      const canvas = await html2canvas(element, {
        scale: 3, 
        useCORS: true,
        backgroundColor: '#f8fafc' 
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Report_${selectedRecruiter.name}.pdf`);
      setIsPrinting(false);
    }, 150); 
  };

  if (!data) return <div style={loadingStyle}>✨ Loading...</div>;

  const filteredRecruiters = data.recruiter_breakdown.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tokenData = selectedRecruiter ? [
    { name: 'Input', val: selectedRecruiter.total_input_tokens || 0 },
    { name: 'Output', val: selectedRecruiter.total_output_tokens || 0 }
  ] : [];

  const interviewData = selectedRecruiter ? [
    { name: 'Scheduled', val: selectedRecruiter.interviews_scheduled || 0 },
    { name: 'Completed', val: selectedRecruiter.interviews_completed || 0 }
  ] : [];

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={brandSection}>
          <div style={logoIcon}><Zap size={20} color="#fff" fill="#fff" /></div>
          <div>
            <h1 style={brandStyle}>Admin Panel</h1>
            <div style={statHeader}>
              <CreditCard size={14} color="#059669" />
              <span style={revenueLabel}>
                Revenue: <strong style={{color: '#1e293b'}}>${data.overall_stats?.total_spend?.toFixed(2)}</strong>
              </span>
            </div>
          </div>
        </div>

        <div style={headerActions}>
          <div style={searchContainer}>
            <Search size={18} style={searchIcon} />
            <input 
              type="text" 
              placeholder="Search partners..." 
              style={searchInputStyle}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={actionGroup}>
             <button style={iconButtonStyle} onClick={fetchData}><RefreshCw size={18} /></button>
             <button style={primaryButtonStyle} onClick={exportPDF}><Share2 size={18} /><span>Share PDF</span></button>
          </div>
        </div>
      </header>

      <div style={layoutStyle} ref={dashboardRef}>
        {!isPrinting && (
          <div style={sidebarCard}>
            <div style={sidebarTitleRow}>
              <Users size={20} color="#db2777" />
              <h3 style={{margin: 0, fontSize: '1.1rem', color: '#1e293b'}}>Partners</h3>
            </div>
            <div style={listContainer}>
              {filteredRecruiters.map(r => (
                <div 
                  key={r.id} 
                  onClick={() => setSelectedRecruiter(r)}
                  style={{
                    ...recruiterItemStyle,
                    backgroundColor: selectedRecruiter?.id === r.id ? '#1e293b' : 'transparent',
                    color: selectedRecruiter?.id === r.id ? '#fff' : '#334155',
                    borderColor: selectedRecruiter?.id === r.id ? '#1e293b' : '#e2e8f0'
                  }}
                >
                  <div style={{fontWeight: '700'}}>{r.name}</div>
                  <div style={{fontWeight: '800'}}>${(r.total_spent || 0).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ ...mainCard, flex: 1 }}>
          {selectedRecruiter ? (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <div style={detailTitleRow}>
                <div style={avatarCircle}>{selectedRecruiter.name.charAt(0)}</div>
                <div>
                  <h2 style={{margin: 0, fontSize: '1.5rem', color: '#1e293b'}}>{selectedRecruiter.name}</h2>
                  <span style={tagLine}>Performance analysis for current quarter</span>
                </div>
              </div>
              
              <div style={vizGrid}>
                <div style={chartBox}>
                  <div style={chartTitleRow}>
                    <CheckCircle size={18} color="#059669" />
                    <p style={chartLabel}>Interview Stats</p>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={interviewData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                      <XAxis dataKey="name" tick={{fill: '#1e293b', fontSize: 12, fontWeight: 'bold'}} axisLine={{stroke: '#cbd5e1'}} />
                      <YAxis tick={{fill: '#1e293b', fontSize: 12}} axisLine={{stroke: '#cbd5e1'}} />
                      <Tooltip cursor={{fill: '#f1f5f9'}} />
                      <Bar dataKey="val" radius={[6, 6, 0, 0]} barSize={50}>
                        <Cell fill="#059669" />
                        <Cell fill="#10b981" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={chartBox}>
                  <div style={chartTitleRow}>
                    <PieChart size={18} color="#be185d" />
                    <p style={chartLabel}>AI Usage Metrics</p>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={tokenData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                      <XAxis dataKey="name" tick={{fill: '#1e293b', fontSize: 12, fontWeight: 'bold'}} axisLine={{stroke: '#cbd5e1'}} />
                      <YAxis tick={{fill: '#1e293b', fontSize: 12}} axisLine={{stroke: '#cbd5e1'}} />
                      <Tooltip cursor={{fill: '#f1f5f9'}} />
                      <Bar dataKey="val" radius={[6, 6, 0, 0]} barSize={50}>
                        <Cell fill="#be185d" />
                        <Cell fill="#db2777" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div style={emptyState}>Select a talent partner to unlock metrics</div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SMOOTH & HIGH VISIBILITY STYLES ---
const containerStyle = { padding: '30px 50px', backgroundColor: '#46729d', minHeight: '100vh', width: '100%', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' };
const brandSection = { display: 'flex', alignItems: 'center', gap: '15px' };
const logoIcon = { backgroundColor: '#7e3757', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(219, 39, 119, 0.3)' };
const brandStyle = { fontSize: '1.7rem', fontWeight: '800', margin: 0, color: '#1e293b' };
const statHeader = { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' };
const revenueLabel = { color: '#475569', fontSize: '0.9rem', fontWeight: '600' };

const headerActions = { display: 'flex', alignItems: 'center', gap: '20px' };
const actionGroup = { display: 'flex', alignItems: 'center', gap: '12px' };
const iconButtonStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', backgroundColor: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', color: '#1e293b' };
const primaryButtonStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px', height: '42px', backgroundColor: '#1e293b', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(30, 41, 59, 0.2)' };

const searchContainer = { position: 'relative', display: 'flex', alignItems: 'center' };
const searchIcon = { position: 'absolute', left: '14px', color: '#475569' };
const searchInputStyle = { padding: '10px 15px 10px 42px', borderRadius: '12px', border: '1.5px solid #e2e8f0', width: '280px', outline: 'none', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' };

const layoutStyle = { display: 'flex', gap: '25px', flex: 1 };
const sidebarCard = { backgroundColor: '#fff', padding: '25px', borderRadius: '24px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' };
const mainCard = { backgroundColor: '#fff', padding: '35px', borderRadius: '24px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' };

const recruiterItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: '14px', cursor: 'pointer', marginBottom: '10px', border: '1px solid' };
const listContainer = { width: '320px', maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' };

const detailTitleRow = { display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '35px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' };
const avatarCircle = { width: '50px', height: '50px', backgroundColor: '#1e293b', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '800', fontSize: '1.3rem' };
const tagLine = { fontSize: '0.85rem', color: '#475569', fontWeight: '600' };

const vizGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '25px' };
const chartBox = { padding: '25px', border: '1.5px solid #f1f5f9', borderRadius: '20px', backgroundColor: '#fff' };
const chartTitleRow = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' };
const chartLabel = { fontSize: '0.8rem', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase' };

const emptyState = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: '#475569', fontWeight: '700' };
const loadingStyle = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#db2777', fontWeight: '800' };
const sidebarTitleRow = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' };

export default App;