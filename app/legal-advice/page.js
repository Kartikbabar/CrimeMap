'use client';
import { useState } from 'react';
import LegalAdvisor from '../../components/LegalAdvisor';

export default function LegalAdvice() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How to file an FIR?",
      answer: "You can file an FIR at any police station regardless of the area where the crime occurred. Bring valid ID proof and provide all relevant details about the incident. The police are legally bound to register your FIR."
    },
    {
      question: "What are your rights when arrested?",
      answer: "Right to know the grounds of arrest, right to legal representation, right to inform family/friends, right to medical examination, and right to be produced before a magistrate within 24 hours."
    },
    {
      question: "What is zero FIR?",
      answer: "A Zero FIR can be filed in any police station regardless of the place of incident or jurisdiction. The police station is required to register the complaint and then transfer it to the appropriate jurisdiction."
    },
    {
      question: "How to get legal aid?",
      answer: "Contact the District Legal Services Authority (DLSA) in your area. Free legal aid is available for women, children, SC/ST communities, and people below certain income thresholds."
    }
  ];

  const legalResources = [
    {
      title: "Maharashtra Police",
      description: "Official website of Maharashtra Police",
      contact: "https://mahapolice.gov.in",
      icon: "🛡️"
    },
    {
      title: "Legal Services Authority",
      description: "Free legal aid and services",
      contact: "tel:1516",
      icon: "⚖️"
    },
    {
      title: "Women Helpline",
      description: "24/7 support for women in distress",
      contact: "tel:1091",
      icon: "👩"
    },
    {
      title: "Child Helpline",
      description: "Emergency help for children",
      contact: "tel:1098",
      icon: "🧒"
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Legal Advice & Resources
          </h1>
          <p style={{
            fontSize: '1.25rem',
            opacity: '0.9',
            lineHeight: '1.6'
          }}>
            Get instant legal guidance, know your rights, and access emergency support services
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
        gap: '2rem'
      }}>
        {/* Main Content - Legal Advisor */}
        <div>
          <LegalAdvisor />
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Legal Resources */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f1f5f9',
            width:'400px',
            position: 'sticky',
            top: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🔗 Legal Resources
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {legalResources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.contact}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.75rem',
                    textDecoration: 'none',
                    color: '#374151',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f1f5f9';
                    e.target.style.borderColor = '#cbd5e1';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f8fafc';
                    e.target.style.borderColor = '#e2e8f0';
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{resource.icon}</span>
                  <div>
                    <div style={{
                      fontWeight: '500',
                      color: '#1e293b'
                    }}>
                      {resource.title}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#64748b'
                    }}>
                      {resource.description}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}