export interface Module {
  title: string;
  content: string;
  analogy: string;
  attachment: string;
}

export interface FlowNode {
  step: string;
  agent: string;
  desc: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface PathwayData {
  title: string;
  category: string;
  summary: string;
  modules: Module[];
  flowchart: FlowNode[];
  diagramType: 'quantum' | 'photosynthesis' | 'blockchain' | 'blackhole' | 'generic';
  diagramLabels?: string[];
  quiz: QuizQuestion[];
}

export const generatePathway = (prompt: string, level: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'): PathwayData => {
  const cleanPrompt = prompt.toLowerCase();

  // Helper suffix based on difficulty level
  const getLevelSuffix = () => {
    if (level === 'beginner') return ' (Foundational Level)';
    if (level === 'advanced') return ' (Research Level)';
    return ' (Intermediate Level)';
  };

  // 1. PHOTOSYNTHESIS PRESET
  if (cleanPrompt.includes('photo') || cleanPrompt.includes('plant') || cleanPrompt.includes('leaf') || cleanPrompt.includes('synthesis')) {
    const beginnerContent = [
      'Plants use sunlight, water, and air to make their own food. Chlorophyll is the green pigment in leaves that catches light energy, like tiny solar collectors.',
      'Using the trapped energy, the plant breaks down carbon dioxide gas from the air to build simple sugars, releasing fresh oxygen for us to breathe.'
    ];
    const advancedContent = [
      'Photons excite electrons in Photosystem II (P680) and Photosystem I (P700) reaction centers. This drives photolysis of water, creating a proton gradient across the thylakoid membrane to synthesize ATP via ATP Synthase.',
      'RuBisCO catalyzes the carboxylation of ribulose-1,5-bisphosphate (RuBP). The resulting 3-phosphoglycerate (3-PGA) is reduced using ATP and NADPH in a highly regulated catalytic cycle to yield G3P.'
    ];
    const intermediateContent = [
      'Occurring in the thylakoid membranes, chlorophyll absorbs photons, splitting water molecules (H₂O) to release oxygen gas (O₂) and storing energy in the form of ATP and NADPH.',
      'In the chloroplast stroma, the enzyme RuBisCO fixes Carbon Dioxide (CO₂). Using the stored ATP and NADPH batteries, it constructs Glyceraldehyde 3-phosphate (G3P), which eventually forms Glucose (C₆H₁₂O₆).'
    ];

    const content = level === 'beginner' ? beginnerContent : level === 'advanced' ? advancedContent : intermediateContent;

    return {
      title: 'Photosynthesis: Solar-to-Chemical Conversion' + getLevelSuffix(),
      category: 'Botany & Bioenergetics',
      summary: level === 'beginner' 
        ? 'Photosynthesis is the process where green plants turn sunlight into energy to grow, creating the oxygen we breathe.' 
        : 'Photosynthesis is the fundamental biological process by which autotrophs convert solar radiance into glucose, utilizing water and carbon dioxide, releasing oxygen as a key bioproduct.',
      diagramType: 'photosynthesis',
      modules: [
        {
          title: 'Milestone 1: The Light-Dependent Reactions',
          content: content[0],
          analogy: 'Imagine thylakoids as microscopic solar panels that capture sunlight and use the current to fill battery cells (ATP/NADPH).',
          attachment: 'chlorophyll-photon-capture.pdf'
        },
        {
          title: 'Milestone 2: The Calvin Cycle (Light-Independent)',
          content: content[1],
          analogy: 'Think of the Calvin Cycle as a factory assembly line. It takes carbon from the air and uses solar-charged batteries to stamp out sugar bricks.',
          attachment: 'rubisco-carbon-fixation-profile.json'
        }
      ],
      flowchart: [
        { step: 'Sunlight Capture', agent: 'Research Agent', desc: 'Chlorophyll molecules capture red and blue wavelengths.' },
        { step: 'Photolysis of Water', agent: 'Visual Design Agent', desc: 'H₂O is split into protons, electrons, and O₂ gas.' },
        { step: 'Energy Accumulation', agent: 'Curriculum Agent', desc: 'ATP and NADPH molecules are synthesized.' },
        { step: 'Calvin Fixation Loop', agent: 'Storytelling Agent', desc: 'CO₂ is chemically bonded to form stable carbohydrates.' }
      ],
      quiz: [
        {
          question: 'Where do the light-dependent reactions of photosynthesis take place?',
          options: ['Chloroplast Stroma', 'Thylakoid Membrane', 'Mitochondrial Matrix', 'Cytoplasm'],
          answerIndex: 1,
          explanation: 'The thylakoid membranes contain chlorophyll, which absorbs light energy to initiate the light reactions.'
        },
        {
          question: 'What enzyme is primarily responsible for fixing Carbon Dioxide in the Calvin Cycle?',
          options: ['Amylase', 'ATP Synthase', 'RuBisCO', 'Helicase'],
          answerIndex: 2,
          explanation: 'RuBisCO is the enzyme that catalyzes the primary chemical reaction of carbon fixation in plants.'
        }
      ]
    };
  }

  // 2. BLOCKCHAIN PRESET
  if (cleanPrompt.includes('block') || cleanPrompt.includes('crypto') || cleanPrompt.includes('ledger') || cleanPrompt.includes('bitcoin')) {
    const beginnerContent = [
      'A blockchain is like a shared digital notebook that everyone can write in but no one can erase. Each new entry is linked to the previous one, making it impossible to cheat.',
      'Rather than trusting a single company, everyone on the network keeps a copy of the notebook. They verify transactions together using simple rules.'
    ];
    const advancedContent = [
      'Transactions are cryptographically signed using ECDSA and pooled in the mempool. Blocks are linked via SHA-256 hash chains where H_n = SHA256(BlockData || H_n-1). Modified states trigger cascade failures.',
      'Decentralized nodes enforce proof algorithms (e.g. PoW hash difficulty target solving or PoS slash-validator voting) to resolve the Byzantine Generals Problem in asynchronous P2P systems.'
    ];
    const intermediateContent = [
      'Every transaction block is compressed into a unique cryptographic signature called a hash (SHA-256). Each block includes the hash of the preceding block, creating an unbreakable chain.',
      'To append blocks, network nodes run consensus rules such as Proof of Work (solving computational math) or Proof of Stake, establishing a unified truth across global servers.'
    ];

    const content = level === 'beginner' ? beginnerContent : level === 'advanced' ? advancedContent : intermediateContent;

    return {
      title: 'Blockchain: Distributed Consensus Systems' + getLevelSuffix(),
      category: 'Cryptography & Systems',
      summary: level === 'beginner'
        ? 'A blockchain is a shared, super-secure digital ledger that lets people record and transfer assets without needing a bank.'
        : 'A blockchain is a decentralized, immutable distributed ledger that records transactions across a peer-to-peer network, securing consensus via proof algorithms without middle authorities.',
      diagramType: 'blockchain',
      modules: [
        {
          title: 'Milestone 1: Cryptographic Hashing & Linking',
          content: content[0],
          analogy: 'Imagine a line of notebook pages, where the first line of each page must copy a unique mathematical puzzle summarizing all text from the page before it.',
          attachment: 'sha256-cryptography-basics.pdf'
        },
        {
          title: 'Milestone 2: P2P Consensus Mechanisms',
          content: content[1],
          analogy: 'Instead of trusting a single bank teller, a whole room of auditors check each transaction, and the majority consensus becomes the official ledger.',
          attachment: 'byzantine-fault-tolerance.json'
        }
      ],
      flowchart: [
        { step: 'Transaction Broadcast', agent: 'Research Agent', desc: 'User signs transaction, broadcasting it to peer nodes.' },
        { step: 'Mempool Verification', agent: 'Curriculum Agent', desc: 'Nodes check signature validity and account balance.' },
        { step: 'Block Mining Competition', agent: 'Visual Design Agent', desc: 'Miners solve Proof-of-Work to package transactions.' },
        { step: 'Chain Appending', agent: 'Storytelling Agent', desc: 'Block hash links to predecessor, distributing updates.' }
      ],
      quiz: [
        {
          question: 'What makes a blockchain structurally immutable?',
          options: [
            'A centralized password database',
            'Every block referencing the hash of the preceding block',
            'Hosting the network on a single secure server',
            'Encryption with basic zip passwords'
          ],
          answerIndex: 1,
          explanation: 'Because each block embeds the hash of the previous block, modifying any past block would invalidate all subsequent hashes, making tampering instantly visible.'
        },
        {
          question: 'What is a consensus mechanism in distributed networks?',
          options: [
            'A protocol for nodes to agree on a single state of the ledger',
            'A tool to speed up internet downloads',
            'A protocol to compress image files',
            'A database backup scheduler'
          ],
          answerIndex: 0,
          explanation: 'Consensus mechanisms (like Proof of Work) allow decentralized servers to agree on which transactions are valid without trusting a single central authority.'
        }
      ]
    };
  }

  // 3. BLACK HOLES PRESET
  if (cleanPrompt.includes('black') || cleanPrompt.includes('hole') || cleanPrompt.includes('space') || cleanPrompt.includes('gravity') || cleanPrompt.includes('physics')) {
    const beginnerContent = [
      'A black hole is a spot in space where gravity pulls so hard that even light cannot escape. The boundary where light gets trapped is called the event horizon.',
      'At the very center is the singularity, where a giant amount of matter is packed into an infinitely tiny point, warping space and time around it.'
    ];
    const advancedContent = [
      'The event horizon boundary is defined by the Schwarzschild radius: R_s = 2GM / c². Within this radius, the spacetime geodesic paths bend completely inward into the future lightcone.',
      'The singularity represents a physical coordinate boundary where the Riemann curvature tensor goes to infinity. It represents the limit of Einstein field equations without quantum gravity integration.'
    ];
    const intermediateContent = [
      'The event horizon is the boundary around a black hole where the escape velocity exceeds the speed of light (c). Once crossed, all paths in spacetime bend inevitably inward.',
      'At the center lies the singularity, where General Relativity predicts that matter is crushed into zero volume, leading to infinite density and the breakdown of classical physics.'
    ];

    const content = level === 'beginner' ? beginnerContent : level === 'advanced' ? advancedContent : intermediateContent;

    return {
      title: 'Black Holes & General Relativity' + getLevelSuffix(),
      category: 'Astrophysics & Relativity',
      summary: level === 'beginner'
        ? 'A black hole is a star that collapsed into an infinitely heavy point, creating gravity so strong that not even light can get out.'
        : 'A black hole is a spacetime singularity of infinite density, where the gravitational field is so intense that nothing—not even electromagnetic radiation—can escape its event horizon.',
      diagramType: 'blackhole',
      modules: [
        {
          title: 'Milestone 1: Event Horizon & Escape Velocity',
          content: content[0],
          analogy: 'Imagine rowing a boat upstream. As you get closer to a massive waterfall, the current speeds up until it flows faster than your maximum rowing speed.',
          attachment: 'schwarzschild-radius-math.pdf'
        },
        {
          title: 'Milestone 2: Spacetime Singularity',
          content: content[1],
          analogy: 'Think of a heavy bowling ball sitting on a trampoline, stretching the fabric downward until it forms an infinitely deep funnel.',
          attachment: 'hawking-radiation-quantization.json'
        }
      ],
      flowchart: [
        { step: 'Stellar Core Collapse', agent: 'Research Agent', desc: 'Massive star collapses under gravity.' },
        { step: 'Event Horizon Boundary', agent: 'Curriculum Agent', desc: 'Escape velocity surpasses 299,792 km/s boundary.' },
        { step: 'Gravitational Lensing', agent: 'Visual Design Agent', desc: 'Light rays warp around event horizon, forming photon rings.' },
        { step: 'Singularity Convergence', agent: 'Storytelling Agent', desc: 'Physical coordinates collapse into zero volume point.' }
      ],
      quiz: [
        {
          question: 'What is the Schwarzschild radius?',
          options: [
            'The distance from a black hole to its nearest star',
            'The boundary of the event horizon of a non-rotating black hole',
            'The depth of a black hole singularity',
            'The temperature of Hawking radiation'
          ],
          answerIndex: 1,
          explanation: 'The Schwarzschild radius represents the event horizon boundary, within which gravity is strong enough to trap light.'
        },
        {
          question: 'What happens to spacetime coordinates at the singularity?',
          options: [
            'Spacetime becomes flat',
            'Time flows in reverse',
            'Standard mathematical coordinate equations go to infinity',
            'Gravity drops to zero'
          ],
          answerIndex: 2,
          explanation: 'At the singularity, density and gravitational warping go to infinity, representing a breakdown in standard general relativity math.'
        }
      ]
    };
  }

  // 4. GENERIC / DYNAMIC PATHWAY GENERATOR
  const words = prompt.split(' ').filter(w => w.length > 3);
  const keyword1 = words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1) : 'Topic';
  const keyword2 = words[1] ? words[1].toLowerCase() : 'mechanisms';
  
  return {
    title: `${keyword1} Mastery Pathway` + getLevelSuffix(),
    category: 'Dynamic Synthesis',
    summary: `This adaptive curriculum outlines the core architecture and operational rules of ${prompt}. Prepared dynamically by IDEA agents.`,
    diagramType: 'generic',
    diagramLabels: [keyword1, 'Principles', 'Applications', 'Feedback'],
    modules: [
      {
        title: `Milestone 1: Core Fundamentals of ${keyword1}`,
        content: level === 'beginner' 
          ? `Basic introduction to the concept of ${keyword1}. We cover simple definitions, why it matters, and how it relates to common things in daily life.`
          : level === 'advanced'
          ? `Rigorous mathematical and architectural foundations of ${keyword1}. We analyze mechanical proofs, theoretical constraints, and thermodynamic values.`
          : `Understanding the initial setup and operational constraints of ${keyword1}. This involves analyzing how it manages resources, interacts with parameters, and achieves steady states.`,
        analogy: `Think of ${keyword1} as a complex engine where input fuels specific gears, turning raw concepts into structured outcomes.`,
        attachment: `${keyword1.toLowerCase()}-foundations.pdf`
      },
      {
        title: `Milestone 2: Advanced ${keyword2} & Integration`,
        content: level === 'beginner'
          ? `How to use ${keyword1} to solve basic problems. We walk through a step-by-step example to build your first working model.`
          : level === 'advanced'
          ? `Derivation of advanced systems integration. We resolve edge-case exceptions, scalability models, and design systems for maximum throughput.`
          : `Applying advanced algorithms to scale and optimize the processes of ${keyword1}. Focus is given to resolving performance bottlenecks, security, and edge-case exceptions.`,
        analogy: `This stage resembles tuning a musical instrument to play in harmony with other components in the orchestra.`,
        attachment: `${keyword1.toLowerCase()}-deployment-spec.json`
      }
    ],
    flowchart: [
      { step: `${keyword1} Ingestion`, agent: 'Research Agent', desc: `Extracting primary source texts for ${keyword1}.` },
      { step: 'Taxonomy Modeling', agent: 'Curriculum Agent', desc: 'Structuring difficulty levels and assessment nodes.' },
      { step: 'Analogical Scripting', agent: 'Storytelling Agent', desc: 'Drafting narrative examples to explain dense formulas.' },
      { step: 'Syllabus Delivery', agent: 'Visual Design Agent', desc: 'Compiling structured pathway data to the learner dashboard.' }
    ],
    quiz: [
      {
        question: `What is the primary objective of understanding ${keyword1}?`,
        options: [
          `To grasp its core structural foundations and parameters`,
          'To ignore its constraints and deploy it randomly',
          'To replace it with outdated manual workflows',
          'To write essays without research references'
        ],
        answerIndex: 0,
        explanation: 'Grasping foundations and constraints is the critical first step to applying any technical subject correctly.'
      },
      {
        question: `How does the dynamic agent engine improve ${keyword1} learning?`,
        options: [
          'By providing static text documents only',
          'By orchestrating cooperative agents to tailor the curriculum to user prompts',
          'By disabling assessments and telemetry',
          'By slowing down the study process'
        ],
        answerIndex: 1,
        explanation: 'Cooperative agents work together (planning, sourcing, designing, assessing) to produce highly customized learning pathways.'
      }
    ]
  };
};
