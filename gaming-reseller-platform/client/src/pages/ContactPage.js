import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ParticlesBG from '../components/ParticlesBG';
import { useSettings } from '../context/SettingsContext';
import toast from 'react-hot-toast';
import { FiMail, FiMessageSquare, FiPhone, FiSend } from 'react-icons/fi';

export default function ContactPage() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const waNumber = settings.whatsappNumber || '94742560815';
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent('Hello! I need support from PRRX Gaming Reseller.')}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all fields'); return; }
    // Open mailto
    window.location.href = `mailto:ahmadhzahidh215@gmail.com?subject=${encodeURIComponent(form.subject || 'Contact from ' + form.name)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    setSent(true);
    toast.success('Opening email client...');
  };

  const contacts = [
    { icon: FiMail, label: 'Email', value: 'ahmadhzahidh215@gmail.com', href: 'mailto:ahmadhzahidh215@gmail.com', color: '#7c3aed' },
    { icon: FiMessageSquare, label: 'WhatsApp', value: '+94 742 560 815', href: waLink, color: '#25D366' },
    { icon: FiPhone, label: 'Support Hours', value: '24/7 Online Support', href: null, color: '#10b981' },
  ];

  return (
    <div style={{ background: '#05050d', minHeight: '100vh', position: 'relative' }}>
      <ParticlesBG density={40} opacity={0.5} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '100px 24px 60px' }}>
        <Link to="/" style={{ color: '#a855f7', textDecoration: 'none', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>← Back to Home</Link>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 className="font-gaming" style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, marginBottom: 12, background: 'linear-gradient(135deg,#a855f7,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Contact Us</h1>
          <p style={{ color: '#9090b0', fontSize: 16 }}>We're here to help. Reach out anytime!</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {contacts.map((c, i) => (
              <div key={i} style={{ background: 'rgba(14,14,31,0.9)', border: `1px solid ${c.color}30`, borderRadius: 16, padding: '20px 22px', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: `${c.color}20`, border: `1px solid ${c.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <c.icon size={20} color={c.color} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#505070', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{c.label}</div>
                  {c.href
                    ? <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ color: c.color, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>{c.value}</a>
                    : <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{c.value}</div>
                  }
                </div>
              </div>
            ))}

            {/* WhatsApp CTA */}
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(135deg,#25D366,#128C7E)', color: '#fff', padding: '16px', borderRadius: 16, textDecoration: 'none', fontWeight: 800, fontSize: 16, fontFamily: 'Space Grotesk,sans-serif', boxShadow: '0 8px 30px rgba(37,211,102,0.3)', marginTop: 8 }}>
              💬 Chat on WhatsApp
            </a>
          </div>

          {/* Contact form */}
          <div style={{ background: 'rgba(14,14,31,0.9)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: '28px', backdropFilter: 'blur(20px)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, fontFamily: 'Space Grotesk,sans-serif', color: '#fff' }}>Send a Message</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#9090b0', marginBottom: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Your Name</label>
                <input className="input-gaming" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter your name" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#9090b0', marginBottom: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Email</label>
                <input className="input-gaming" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#9090b0', marginBottom: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Subject</label>
                <input className="input-gaming" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#9090b0', marginBottom: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Message</label>
                <textarea className="input-gaming" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Your message..." style={{ minHeight: 100, resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '13px', justifyContent: 'center', fontSize: 15 }}>
                <FiSend size={16} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:640px){.contact-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
