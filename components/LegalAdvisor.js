'use client';
import { useState, useRef, useEffect } from 'react';

export default function LegalAdvisor() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Pre-trained legal prompts and responses
  const legalPrompts = [
    {
      question: "How to file an FIR?",
      answer: `To file an FIR (First Information Report) in Maharashtra:

1. **Visit the nearest police station** - You can file an FIR at any police station regardless of where the crime occurred (Zero FIR concept)

2. **Required Documents**:
   - Valid ID proof (Aadhaar, Voter ID, Driving License)
   - Details of the incident (date, time, location)
   - Information about involved persons

3. **Process**:
   - Provide complete details to the duty officer
   - The police must register your FIR immediately
   - You have the right to get a free copy of the FIR
   - FIR should be registered in the local language you understand

4. **If police refuse**:
   - Contact the Superintendent of Police
   - File a complaint with the Judicial Magistrate
   - Use the online FIR portal (available in some districts)

Remember: Filing a false FIR is punishable under Section 182 of IPC.`
    },
    {
      question: "What are my rights when arrested?",
      answer: `When arrested in India, you have these fundamental rights:

**1. Right to Know Grounds of Arrest** (Article 22(1))
- Police must inform you of the reasons for arrest
- Must be communicated in a language you understand

**2. Right to Legal Representation** (Article 22(1))
- Right to consult and be defended by a legal practitioner
- Free legal aid if you cannot afford a lawyer

**3. Right to Inform Family/Friend**
- Police must inform a relative/friend about your arrest
- You have the right to make one phone call

**4. Right to Medical Examination**
- Right to medical examination every 48 hours
- Especially important if alleging torture

**5. Right to be Produced Before Magistrate** (Section 57 CrPC)
- Must be produced before magistrate within 24 hours
- Excluding travel time

**6. Right to Bail**
- For bailable offenses: Right to be released on bail
- For non-bailable offenses: Can apply for bail

**7. Right to Remain Silent**
- Right against self-incrimination (Article 20(3))
- Cannot be compelled to be a witness against yourself

**8. Right to Fair Treatment**
- Protection from torture and cruel treatment
- Right to humane conditions in custody`
    },
    {
      question: "What is Zero FIR?",
      answer: `**Zero FIR** is a crucial legal provision that allows you to file an FIR at any police station, regardless of where the crime occurred.

**Key Features**:
- Can be filed at ANY police station in India
- The police station where you file must register it immediately
- They cannot refuse by saying the crime occurred in another jurisdiction
- After registration, it's transferred to the concerned police station

**When to Use Zero FIR**:
1. When the crime occurred in a different area
2. When you're traveling and need immediate action
3. When the local police station is uncooperative
4. In emergencies where time is critical

**Process**:
1. Go to nearest police station
2. Provide complete details of the incident
3. Police must register Zero FIR (serial number starts with 0)
4. Station transfers FIR to concerned jurisdiction
5. You receive acknowledgment copy

**Legal Basis**: Supreme Court directives and Criminal Procedure Code amendments ensure this right.`
    },
    {
      question: "How to get free legal aid?",
      answer: `**Free Legal Services Available in Maharashtra**:

**1. District Legal Services Authority (DLSA)**
- Located in every district headquarters
- Provides free lawyers for eligible persons
- Contact: Visit district court premises

**2. Eligibility Criteria**:
- Women and children
- SC/ST community members
- Industrial workmen
- Victims of trafficking
- Persons with disability
- Victims of mass disaster
- Persons with annual income < ₹3 lakhs

**3. Types of Cases Covered**:
- Criminal cases (if facing imprisonment)
- Civil cases (land disputes, family matters)
- Motor accident claims
- Domestic violence cases
- Consumer disputes

**4. How to Apply**:
- Visit DLSA office with required documents
- Fill application form (available free)
- Submit income certificate and ID proof
- Case will be assigned to a panel lawyer

**5. Maharashtra State Legal Services Authority**:
Helpline: 1516 (Toll-free)
Website: mahalsa.gov.in`
    },
    {
      question: "What to do in case of police harassment?",
      answer: `If you face police harassment in Maharashtra:

**Immediate Steps**:
1. **Remain Calm** - Don't argue or resist physically
2. **Note Details** - Officer's name, badge number, police station
3. **Record Evidence** - Audio/video recording if safe to do so
4. **Contact Lawyer** - Immediately inform your legal counsel

**Formal Complaints**:
1. **Senior Police Officers**:
   - Write to Superintendent of Police (SP)
   - Contact Deputy Commissioner of Police (DCP)
   - Use police department's grievance cell

2. **Human Rights Commission**:
   - Maharashtra State Human Rights Commission
   - Can be approached directly
   - Online complaint facility available

3. **Judicial Magistrate**:
   - File complaint under Section 156(3) CrPC
   - Magistrate can order investigation

4. **Women's Commission** (if applicable):
   - Maharashtra State Commission for Women
   - Special cell for police harassment cases

**Emergency Contacts**:
- Police Control Room: 100
- Women Helpline: 1091
- Legal Aid: 1516
- Human Rights: 1800-208-4545`
    },
    {
      question: "How to check FIR status online?",
      answer: `**Checking FIR Status in Maharashtra**:

**Online Methods**:

1. **Maharashtra Police Citizen Portal**:
   - Website: citizen.mahapolice.gov.in
   - Click on 'Know Your FIR Status'
   - Enter FIR number and year
   - View current status and details

2. **Mobile App**:
   - Download 'Maharashtra Police' app
   - Register with mobile number
   - Track FIR status and updates

3. **RTI Application**:
   - File Right to Information application
   - Seek FIR copy and investigation status
   - Apply online at rtionline.gov.in

**Required Information**:
- FIR number (e.g., 123/2024)
- Police station name
- Date of registration
- Your details as complainant

**What Information You Get**:
- Current investigation status
- Officer in charge
- Court dates (if any)
- Chargesheet status
- Next hearing date

**If Online Not Working**:
- Visit police station personally
- Contact Police Control Room
- Approach Superintendent of Police office`
    }
  ];

  const quickActions = [
    "How to file an FIR?",
    "What are my rights when arrested?",
    "What is Zero FIR?",
    "How to get free legal aid?",
    "What to do in case of police harassment?",
    "How to check FIR status online?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        type: 'bot',
        content: `👋 **Welcome to Legal Advisor!**

I'm here to help you with legal information about Maharashtra police procedures and your rights. 

**How I can help you:**
• Explain legal procedures in simple terms
• Guide you through police interactions
• Provide information about your rights
• Connect you with legal resources

**Choose a question below or type your own legal query:**`,
        timestamp: new Date()
      }
    ]);
  }, []);

  const handleQuickAction = (question) => {
    setInputMessage(question);
    handleSendMessage(question);
  };

  const handleSendMessage = async (customMessage = null) => {
    const message = customMessage || inputMessage;
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateLegalResponse(message);
      const botMessage = {
        type: 'bot',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const generateLegalResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Find matching prompt
    const matchedPrompt = legalPrompts.find(prompt => 
      lowerMessage.includes(prompt.question.toLowerCase().split('?')[0].toLowerCase())
    );

    if (matchedPrompt) {
      return matchedPrompt.answer;
    }

    // Generic responses for common legal queries
    if (lowerMessage.includes('bail') || lowerMessage.includes('bailable')) {
      return `**Information about Bail in Maharashtra**:

**Bailable Offenses**:
- Right to be released on bail
- Can be granted by police station officer
- Must furnish bail bond with sureties

**Non-Bailable Offenses**:
- Bail is discretion of court
- Factors considered: nature of offense, evidence, criminal history
- Can apply for regular bail or anticipatory bail

**Anticipatory Bail** (Section 438 CrPC):
- Apply BEFORE arrest is made
- Filed in Sessions Court or High Court
- Valid for specified period

**Bail Process**:
1. File bail application in appropriate court
2. Hearing scheduled within reasonable time
3. Court may impose conditions
4. Furnish bail bond if granted

**Legal Aid**: If you cannot afford a lawyer, contact District Legal Services Authority for free legal assistance.`;
    }

    if (lowerMessage.includes('domestic violence') || lowerMessage.includes('dvc')) {
      return `**Protection Against Domestic Violence**:

**Laws Protecting You**:
1. **Protection of Women from Domestic Violence Act, 2005**
2. **Indian Penal Code Sections** (498A, 406)
3. **Dowry Prohibition Act**

**Immediate Actions**:
1. **File Complaint** with Protection Officer
2. **Approach Magistrate** for protection orders
3. **Contact Women's Helpline**: 1091 or 181

**Types of Relief Available**:
- Protection orders (immediate safety)
- Residence orders (right to stay in shared home)
- Monetary relief (compensation)
- Custody orders (for children)

**Support Services in Maharashtra**:
- One Stop Centers (Sakhi Centers)
- Women Police Stations
- Family Counseling Centers
- NGOs specializing in women's rights

**Emergency**: If in immediate danger, call 100 or visit nearest police station.`;
    }

    if (lowerMessage.includes('cyber crime') || lowerMessage.includes('online fraud')) {
      return `**Reporting Cyber Crime in Maharashtra**:

**Types of Cyber Crimes**:
- Online fraud and phishing
- Social media harassment
- Identity theft
- Financial frauds
- Cyber bullying

**Where to Report**:
1. **Cyber Crime Police Stations** (in major cities)
2. **Local Police Station** (can register FIR)
3. **National Cyber Crime Portal**: cybercrime.gov.in

**Required Information**:
- Screenshots of conversations
- Email headers and content
- Bank transaction details
- URL of fraudulent website
- Device information

**Helpline Numbers**:
- Cyber Crime Helpline: 1930
- Police Control Room: 100
- Women Cyber Crime: 1091

**Prevention Tips**:
- Never share OTP or passwords
- Verify website authenticity
- Use strong, unique passwords
- Enable two-factor authentication`;
    }

    // Default response for unmatched queries
    return `**Legal Information Resource**

I understand you're asking about: "${message}"

While I can provide general legal information about police procedures and citizen rights in Maharashtra, for specific legal advice about your situation, I recommend:

**Consult a Qualified Lawyer** for:
- Case-specific legal strategy
- Court representation
- Detailed legal documentation
- Personalized legal advice

**Immediate Legal Help**:
- District Legal Services Authority (Free legal aid)
- Bar Association Lawyer Referral Service
- Legal Aid Helpline: 1516

**For your query**, I can help better if you provide more specific details about your situation, or you can ask about common legal procedures like FIR filing, arrest rights, bail procedures, etc.`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="dashboard-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Legal Advisor</h2>
          <p style={{ color: '#6b7280' }}>AI-powered legal guidance for Maharashtra citizens</p>
        </div>
        <div style={{ 
          padding: '0.5rem 1rem', 
          backgroundColor: '#f0f9ff', 
          color: '#0369a1',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          border: '1px solid #bae6fd'
        }}>
          🤖 AI Assistant
        </div>
      </div>

      {/* Chat Container */}
      <div style={{ 
        height: '450px', 
        width: '950px',
        border: '1px solid #e5e7eb', 
        borderRadius: '0.75rem',
        backgroundColor: '#fafafa',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Messages Area */}
        <div style={{ 
          flex: 1, 
          padding: '1rem', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '0.5rem'
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  backgroundColor: message.type === 'user' ? '#3b82f6' : 'white',
                  color: message.type === 'user' ? 'white' : '#1f2937',
                  border: message.type === 'bot' ? '1px solid #e5e7eb' : 'none',
                  boxShadow: message.type === 'bot' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  whiteSpace: 'pre-line'
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: message.type === 'user' ? 'rgba(255,255,255,0.7)' : '#6b7280',
                  marginTop: '0.5rem',
                  textAlign: 'right'
                }}>
                  {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                color: '#6b7280',
                fontStyle: 'italic'
              }}>
                🤔 Researching legal information...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div style={{ 
          padding: '1rem', 
          borderTop: '1px solid #e5e7eb',
          backgroundColor: 'white',
          borderBottomLeftRadius: '0.75rem',
          borderBottomRightRadius: '0.75rem'
        }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f8fafc',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '1rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f1f5f9';
                  e.target.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.borderColor = '#e5e7eb';
                }}
              >
                {action}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask any legal question about police procedures, rights, or laws..."
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div style={{ 
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#fffbeb',
        border: '1px solid #fcd34d',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        color: '#92400e'
      }}>
        <strong>⚠️ Legal Disclaimer:</strong> This AI assistant provides general legal information only and does not constitute legal advice. For specific legal situations, please consult a qualified lawyer. In emergencies, contact police (100) or legal aid (1516) immediately.
      </div>
    </div>
  );
}