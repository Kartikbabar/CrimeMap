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
    <div className="legal-advisor-hud">
      <div className="hud-header">
        <div className="header-info">
          <h2>NyayaMitra <span className="neon">AI</span></h2>
          <p>Autonomous Legal Intelligence System</p>
        </div>
        <div className="system-status">
          <span className="pulse-dot"></span>
          ENCRYPTED LINK ACTIVE
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-area">
          {messages.map((message, index) => (
            <div key={index} className={`message-row ${message.type}`}>
              <div className={`message-bubble ${message.type}`}>
                <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                <span className="timestamp">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-row bot">
              <div className="message-bubble bot loading">
                Searching Maharashtra Legal Database...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <button key={index} onClick={() => handleQuickAction(action)} className="action-tag">
              {action}
            </button>
          ))}
        </div>

        <div className="input-area">
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Initialize query (e.g. 'FIR process', 'Arrest rights')..."
            disabled={isLoading}
          />
          <button onClick={() => handleSendMessage()} disabled={isLoading || !inputMessage.trim()} className="send-btn">
            {isLoading ? '...' : 'ANALYSIS'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .legal-advisor-hud {
          background: transparent;
          border: none;
          padding: 0;
          color: white;
        }
        .hud-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 1rem;
        }
        .header-info h2 { margin: 0; font-size: 1.5rem; letter-spacing: 2px; }
        .neon { color: #6366f1; text-shadow: 0 0 10px rgba(99, 102, 241, 0.5); }
        .header-info p { margin: 0; font-size: 0.75rem; color: #94a3b8; font-weight: 700; letter-spacing: 1px; }
        
        .system-status { font-size: 0.7rem; font-weight: 800; color: #10b981; display: flex; align-items: center; gap: 0.5rem; }
        .pulse-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }

        .chat-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .messages-area { height: 400px; overflow-y: auto; padding-right: 1rem; display: flex; flex-direction: column; gap: 1.5rem; }
        
        .message-row { display: flex; width: 100%; }
        .message-row.user { justify-content: flex-end; }
        .message-row.bot { justify-content: flex-start; }

        .message-bubble {
          max-width: 85%;
          padding: 1.25rem;
          border-radius: 1rem;
          font-size: 0.95rem;
          line-height: 1.6;
          position: relative;
        }
        .message-bubble.user { background: #3b82f6; color: white; border-bottom-right-radius: 0.2rem; }
        .message-bubble.bot { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-bottom-left-radius: 0.2rem; white-space: pre-line; }
        .message-bubble.loading { font-style: italic; color: #6366f1; }

        .timestamp { display: block; font-size: 0.65rem; margin-top: 0.75rem; color: rgba(255,255,255,0.4); text-align: right; }

        .quick-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }
        .action-tag {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: #818cf8;
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-tag:hover { background: rgba(99, 102, 241, 0.2); transform: scale(1.05); }

        .input-area { display: flex; gap: 1rem; background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.1); }
        .input-area input { flex: 1; background: transparent; border: none; padding: 0.75rem; color: white; outline: none; font-size: 0.95rem; }
        .send-btn { background: #6366f1; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.75rem; font-weight: 800; letter-spacing: 1px; cursor: pointer; }
      `}</style>
    </div>
  );
}