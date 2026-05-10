import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { FiCopy, FiCheck, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ParticlesBG from '../../components/ParticlesBG';

const topUpPackages = [
  { coins: 100, priceLKR: 500, priceUSD: 1.50, bonus: 0, popular: false },
  { coins: 300, priceLKR: 1200, priceUSD: 4.00, bonus: 20, popular: false },
  { coins: 500, priceLKR: 1800, priceUSD: 6.00, bonus: 50, popular: true },
  { coins: 1000, priceLKR: 3200, priceUSD: 11.00, bonus: 150, popular: false },
  { coins: 2500, priceLKR: 7500, priceUSD: 25.00, bonus: 400, popular: false },
  { coins: 5000, priceLKR: 14000, priceUSD: 47.00, bonus: 1000, popular: false },
];

export default function CoinTopUp() {
  const { settings } = useSettings();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyInstructions = () => {
    navigator.clipboard.writeText(settings.paymentInstructions || 'Contact admin for payment details');
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>🪙 Coin Top-Up</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>Select a package and follow payment instructions</p>

      {/* Packages */}
      <div className="grid-3" style={{ marginBottom: 32, gap: 16 }}>
        {topUpPackages.map((pkg, i) => (
          <div
            key={i}
            onClick={() => setSelectedPackage(pkg)}
            style={{
              background: selectedPackage === pkg ? 'rgba(124,58,237,0.15)' : 'var(--bg-card)',
              border: `1px solid ${selectedPackage === pkg ? 'var(--purple)' : 'var(--border)'}`,
              borderRadius: 14, padding: '20px 16px', cursor: 'pointer',
              transition: 'all 0.3s ease', position: 'relative', textAlign: 'center',
              boxShadow: selectedPackage === pkg ? 'var(--glow-purple)' : 'none'
            }}
          >
            {pkg.popular && (
              <div style={{
                position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, var(--purple), var(--green))',
                color: 'white', padding: '3px 14px', borderRadius: 20,
                fontSize: 10, fontWeight: 700, fontFamily: 'Orbitron, monospace', whiteSpace: 'nowrap'
              }}>
                POPULAR
              </div>
            )}
            <div style={{ fontSize: 32, marginBottom: 8 }}>🪙</div>
            <div className="font-gaming" style={{ fontSize: 28, fontWeight: 800, color: 'var(--gold)', marginBottom: 4 }}>
              {pkg.coins.toLocaleString()}
            </div>
            {pkg.bonus > 0 && (
              <div style={{ color: 'var(--green)', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                +{pkg.bonus} Bonus Coins!
              </div>
            )}
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 12 }}>
              Total: {(pkg.coins + pkg.bonus).toLocaleString()} coins
            </div>
            <div style={{
              background: selectedPackage === pkg ? 'var(--purple)' : 'var(--bg-secondary)',
              color: 'white', padding: '8px 16px', borderRadius: 8,
              fontWeight: 700, fontSize: 16, fontFamily: 'Orbitron, monospace'
            }}>
              ${pkg.price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Payment instructions */}
      {selectedPackage && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 28, animation: 'fadeInUp 0.3s ease'
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, fontFamily: 'Rajdhani, sans-serif' }}>
            💳 Payment Instructions
          </h3>

          <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
                  {settings.paymentInstructions || 'Please contact admin via chat to complete your top-up. Send payment proof and your username.'}
                </p>
              </div>
              <button
                onClick={copyInstructions}
                style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', marginLeft: 12, flexShrink: 0 }}
              >
                {copied ? <FiCheck size={16} color="var(--green)" /> : <FiCopy size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, padding: '16px', background: 'var(--bg-primary)', borderRadius: 12 }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>Package</div>
              <div className="font-gaming" style={{ color: 'var(--gold)', fontWeight: 700 }}>
                🪙 {(selectedPackage.coins + selectedPackage.bonus).toLocaleString()} Coins
              </div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>Amount</div>
              <div className="font-gaming" style={{ color: 'var(--green)', fontWeight: 700 }}>
                ${selectedPackage.price.toFixed(2)}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, padding: '14px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10 }}>
            <p style={{ color: 'var(--gold)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚠️ After payment, contact admin via <strong>Chat with Admin</strong> with your payment proof. Coins will be added within 24 hours.
            </p>
          </div>
        </div>
      )}

      {!selectedPackage && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: 14 }}>
          👆 Select a package above to see payment instructions
        </div>
      )}
    </div>
  );
}
