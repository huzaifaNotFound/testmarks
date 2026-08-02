import type {
  Analytics,
  AttemptResult,
  Difficulty,
  PerTopic,
  PlanRecommendation,
  Question,
  Stream,
  Test,
  WeakStrongArea,
} from "./types";

export const MOCK_TIME_LIMIT_SEC = 3600;
export const MOCK_QUESTION_COUNT = 50;

export const MOCK_STREAMS: Stream[] = [
  {
    id: "neet",
    name: "NEET",
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
    difficultyMix: { easy: 35, medium: 45, hard: 20 },
    accent: "#DC143C",
    tagline: "Medical entrance — 180 questions, 3 hours.",
  },
  {
    id: "jee-mains",
    name: "JEE Mains",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    difficultyMix: { easy: 30, medium: 45, hard: 25 },
    accent: "#F97316",
    tagline: "Engineering entrance — NTA style papers.",
  },
  {
    id: "jee-advanced",
    name: "JEE Advanced",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    difficultyMix: { easy: 20, medium: 40, hard: 40 },
    accent: "#8B5CF6",
    tagline: "IIT level — conceptual depth over recall.",
  },
  {
    id: "cbse-10",
    name: "CBSE Class 10",
    subjects: ["Mathematics", "Science"],
    difficultyMix: { easy: 40, medium: 40, hard: 20 },
    accent: "#F59E0B",
    tagline: "Board exam focused revision.",
  },
  {
    id: "cbse-11",
    name: "CBSE Class 11",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    difficultyMix: { easy: 40, medium: 50, hard: 10 },
    accent: "#10B981",
    tagline: "NCERT Class 11 — bridge to boards and beyond.",
  },
  {
    id: "cbse-12",
    name: "CBSE Class 12",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    difficultyMix: { easy: 40, medium: 50, hard: 10 },
    accent: "#0EA5E9",
    tagline: "Final board year — full syllabus revision.",
  },
];

export const STREAM_SUBJECT_TOPICS: Record<string, { subject: string; topic: string }[]> = {
  neet: [
    ...topics("Physics", "Kinematics", "Laws of Motion", "Work Energy Power", "Rotational Motion", "Gravitation", "Thermodynamics", "Electrostatics", "Optics"),
    ...topics("Chemistry", "Mole Concept", "Atomic Structure", "Chemical Bonding", "Chemical Thermodynamics", "Equilibrium", "Organic Basics", "Periodic Table", "Electrochemistry"),
    ...topics("Biology", "Cell Biology", "Genetics", "Human Physiology", "Plant Physiology", "Ecology", "Evolution", "Biotechnology", "Human Health"),
    ...topics("Mathematics", "Algebra", "Trigonometry", "Coordinate Geometry", "Calculus", "Probability", "Vectors & 3D", "Matrices", "Statistics"),
  ],
  "jee-mains": [
    ...topics("Physics", "Mechanics", "Rotational Motion", "Waves & SHM", "Thermodynamics", "Electrostatics", "Magnetism", "Modern Physics", "Optics"),
    ...topics("Chemistry", "Physical Chemistry", "Atomic Structure", "Chemical Bonding", "Thermodynamics", "Organic Chemistry", "Hydrocarbons", "Coordination Compounds", "Electrochemistry"),
    ...topics("Mathematics", "Algebra", "Calculus", "Coordinate Geometry", "Trigonometry", "Probability", "Vectors & 3D", "Matrices", "Sequences & Series"),
  ],
  "jee-advanced": [
    ...topics("Physics", "Mechanics", "Rotational Motion", "Waves & SHM", "Electromagnetism", "Modern Physics", "Thermodynamics", "Optics", "Fluid Mechanics"),
    ...topics("Chemistry", "Physical Chemistry", "Atomic Structure", "Chemical Bonding", "Thermodynamics", "Organic Chemistry", "Coordination Compounds", "Electrochemistry", "Chemical Kinetics"),
    ...topics("Mathematics", "Algebra", "Calculus", "Coordinate Geometry", "Trigonometry", "Probability", "Vectors & 3D", "Matrices", "Differential Equations"),
  ],
  "cbse-10": [
    ...topics(
      "Mathematics",
      "Real Numbers",
      "Polynomials",
      "Pair of Linear Equations in Two Variables",
      "Quadratic Equations",
      "Arithmetic Progressions",
      "Triangles",
      "Coordinate Geometry",
      "Introduction to Trigonometry",
      "Some Applications of Trigonometry",
      "Circles",
      "Constructions",
      "Areas Related to Circles",
      "Surface Areas and Volumes",
      "Statistics",
    ),
    ...topics(
      "Science",
      "Chemical Reactions and Equations",
      "Acids Bases and Salts",
      "Metals and Non-Metals",
      "Carbon and its Compounds",
      "Life Processes",
      "Control and Coordination",
      "How do Organisms Reproduce",
      "Heredity",
      "Light Reflection and Refraction",
      "The Human Eye and the Colourful World",
      "Electricity",
      "Magnetic Effects of Electric Current",
      "Our Environment",
    ),
  ],
  "cbse-11": [
    ...topics(
      "Physics",
      "Motion in a Straight Line",
      "Motion in a Plane",
      "Laws of Motion",
      "Work Energy and Power",
      "System of Particles and Rotational Motion",
      "Gravitation",
      "Thermodynamics",
      "Oscillations",
      "Waves",
    ),
    ...topics(
      "Chemistry",
      "Some Basic Concepts of Chemistry",
      "Structure of Atom",
      "Chemical Bonding and Molecular Structure",
      "States of Matter",
      "Thermodynamics",
      "Equilibrium",
      "Redox Reactions",
      "Organic Chemistry: Some Basic Principles and Techniques",
      "Hydrocarbons",
    ),
    ...topics(
      "Mathematics",
      "Sets",
      "Relations and Functions",
      "Trigonometric Functions",
      "Complex Numbers and Quadratic Equations",
      "Linear Inequalities",
      "Permutations and Combinations",
      "Binomial Theorem",
      "Sequences and Series",
      "Straight Lines",
      "Conic Sections",
      "Introduction to Three Dimensional Geometry",
      "Limits and Derivatives",
      "Statistics",
    ),
    ...topics(
      "Biology",
      "The Living World",
      "Cell: The Unit of Life",
      "Biomolecules",
      "Cell Cycle and Cell Division",
      "Photosynthesis in Higher Plants",
      "Respiration in Plants",
      "Plant Growth and Development",
      "Digestion and Absorption",
      "Breathing and Exchange of Gases",
      "Body Fluids and Circulation",
      "Excretory Products and their Elimination",
      "Locomotion and Movement",
      "Neural Control and Coordination",
      "Chemical Coordination and Integration",
    ),
  ],
  "cbse-12": [
    ...topics(
      "Physics",
      "Electric Charges and Fields",
      "Electrostatic Potential and Capacitance",
      "Current Electricity",
      "Moving Charges and Magnetism",
      "Magnetism and Matter",
      "Electromagnetic Induction",
      "Alternating Current",
      "Electromagnetic Waves",
      "Ray Optics and Optical Instruments",
      "Wave Optics",
      "Dual Nature of Radiation and Matter",
      "Atoms",
      "Nuclei",
      "Semiconductor Electronics",
    ),
    ...topics(
      "Chemistry",
      "Solutions",
      "Electrochemistry",
      "Chemical Kinetics",
      "d and f Block Elements",
      "Coordination Compounds",
      "Haloalkanes and Haloarenes",
      "Alcohols Phenols and Ethers",
      "Aldehydes Ketones and Carboxylic Acids",
      "Amines",
      "Biomolecules",
      "Polymers",
      "Chemistry in Everyday Life",
    ),
    ...topics(
      "Mathematics",
      "Relations and Functions",
      "Inverse Trigonometric Functions",
      "Matrices",
      "Determinants",
      "Continuity and Differentiability",
      "Applications of Derivatives",
      "Integrals",
      "Applications of Integrals",
      "Differential Equations",
      "Vector Algebra",
      "Three Dimensional Geometry",
      "Linear Programming",
      "Probability",
    ),
    ...topics(
      "Biology",
      "Reproduction in Organisms",
      "Sexual Reproduction in Flowering Plants",
      "Human Reproduction",
      "Reproductive Health",
      "Principles of Inheritance and Variation",
      "Molecular Basis of Inheritance",
      "Evolution",
      "Human Health and Disease",
      "Microbes in Human Welfare",
      "Biotechnology: Principles and Processes",
      "Biotechnology and its Applications",
      "Organisms and Populations",
      "Ecosystem",
      "Biodiversity and Conservation",
      "Environmental Issues",
    ),
  ],
};

function topics(subject: string, ...names: string[]) {
  return names.map((topic) => ({ subject, topic }));
}

type Tpl = (topic: string, subject: string) => Omit<Question, "id" | "subject" | "topic" | "difficulty">;

const PHYSICS_TPL: Tpl[] = [
  (topic) => ({
    question: `In ${topic}, which one of the following is a conserved physical quantity for an isolated system?`,
    options: ["Linear momentum", "Force", "Acceleration", "Displacement"],
    correct: 0,
    explanation:
      "For an isolated system, net external force is zero, so linear momentum is conserved. Force, acceleration and displacement are not conserved quantities.",
  }),
  (topic) => ({
    question: `A quick-recall check on ${topic}: the fundamental dimension involved in this topic is most often:`,
    options: ["Length (L)", "Temperature (K)", "Electric current (A)", "All of the above, depending on the quantity"],
    correct: 3,
    explanation:
      `${topic} spans several quantities. Always check the dimensional formula of the specific quantity rather than assuming one base dimension.`,
  }),
  (topic) => ({
    question: `In ${topic}, if all numerical inputs are doubled while their relationships are kept unchanged, the computed quantity most likely:`,
    options: ["Remains unchanged", "Doubles", "Quadruples", "Depends on the exact relation"],
    correct: 3,
    explanation:
      `Relations in ${topic} are rarely linear in every variable — check how the target quantity depends on each input before scaling.`,
  }),
];

const CHEM_TPL: Tpl[] = [
  (topic) => ({
    question: `In ${topic}, the step that is usually the rate-determining step is:`,
    options: ["The fastest step", "The slowest step", "The first step always", "The last step always"],
    correct: 1,
    explanation:
      "The overall rate is governed by the slowest elementary step — the rate-determining step. Faster steps do not limit the observed rate.",
  }),
  (topic) => ({
    question: `Which statement about ${topic} is true?`,
    options: [
      "It always favours product formation at high temperature",
      "Equilibrium constants depend on concentration changes",
      "Le Chatelier's principle applies to equilibrium shifts",
      "Catalysts change the equilibrium position",
    ],
    correct: 2,
    explanation:
      "Le Chatelier's principle correctly describes how a system at equilibrium responds to stress. Catalysts only speed up attainment of equilibrium, they never shift it.",
  }),
  (topic) => ({
    question: `A numerical item on ${topic}: which quantity is most likely expressed per mole?`,
    options: ["Enthalpy change", "Volume", "Mass", "Pressure"],
    correct: 0,
    explanation:
      "Molar quantities — like enthalpy, entropy and Gibbs energy changes — are reported per mole of substance in chemistry problems.",
  }),
];

const BIO_TPL: Tpl[] = [
  (topic) => ({
    question: `In ${topic}, the site where the process primarily occurs in the human body is:`,
    options: ["Nucleus", "Mitochondria", "Cytoplasm", "Depends on the specific structure/process"],
    correct: 3,
    explanation:
      `${topic} is a broad area — different sub-processes occur at different sites. Identify the specific structure before answering.`,
  }),
  (topic) => ({
    question: `A recall item on ${topic}: the correct sequence in this process is best described as:`,
    options: [
      "Stimulus → Receptor → Response",
      "Receptor → Stimulus → Response",
      "Response → Receptor → Stimulus",
      "Receptor → Response → Stimulus",
    ],
    correct: 0,
    explanation:
      "Standard biological response pathways begin with a stimulus detected by a receptor, followed by the response — as in reflex arcs.",
  }),
];

const MATH_TPL: Tpl[] = [
  (topic) => ({
    question: `For a problem in ${topic}, which approach is most efficient?`,
    options: ["Substitution method", "Direct formula application", "Graphical method", "Depends on the given data"],
    correct: 3,
    explanation:
      `In ${topic}, the best approach depends on the information given. Build a habit of reading the data before choosing a method.`,
  }),
  (topic) => ({
    question: `If all the variables in a ${topic} expression are doubled, the expression's value:`,
    options: ["Doubles", "Halves", "Quadruples", "Cannot be determined without the expression"],
    correct: 3,
    explanation:
      "The scaling behaviour depends on the powers of the variables in the expression. Linear terms double, squares quadruple, and so on.",
  }),
  (topic) => ({
    question: `A problem in ${topic} gives you more data than needed. The safest first step is:`,
    options: ["Use every given value immediately", "Identify the unknown and the relation that links it", "Guess the closest option", "Skip the question"],
    correct: 1,
    explanation:
      `In ${topic}, start from the required unknown and pick the relation connecting it to the given data — extra values are often distractors.`,
  }),
  (topic) => ({
    question: `Which skill is most tested in ${topic} at board level?`,
    options: ["Rote memorisation of results", "Correct substitution into standard results", "Memorising all formula derivations", "Creative proof writing"],
    correct: 1,
    explanation:
      "Board problems in most topics reward accurate substitution and careful arithmetic using standard results — mastery comes from practice, not memorisation.",
  }),
];

const SCIENCE_TPL: Tpl[] = [
  (topic) => ({
    question: `Which of the following best describes ${topic}?`,
    options: [
      "A purely theoretical concept with no daily-life application",
      "A scientific idea verified through observation and experiment",
      "An opinion that cannot be tested",
      "A fixed law that can never change",
    ],
    correct: 1,
    explanation:
      `Science, including ${topic}, is built on observations, experiments and verifiable explanations — that is the scientific method.`,
  }),
  (topic) => ({
    question: `In an exam question on ${topic}, the most reliable way to answer is:`,
    options: ["Recalling the exact textbook diagram", "Applying the underlying scientific principle to the given situation", "Matching the answer to a previous question", "Choosing the longest option"],
    correct: 1,
    explanation:
      `Questions on ${topic} usually test application of a principle to a new situation, not verbatim recall.`,
  }),
  (topic) => ({
    question: `A statement says: "The results of ${topic} can be demonstrated through a controlled experiment." This statement is:`,
    options: ["False — only theories can be tested", "True — scientific claims are testable", "True only in a laboratory", "False — experiments can never be controlled"],
    correct: 1,
    explanation:
      "Testability is the hallmark of science. Controlled experiments are a standard way to verify claims about any scientific topic.",
  }),
  (topic) => ({
    question: `Which habit best supports long-term learning of ${topic}?`,
    options: ["Cramming the night before", "Daily practice with spaced revision", "Reading only the summary notes", "Solving only difficult problems"],
    correct: 1,
    explanation:
      "Spaced practice and daily revision build durable understanding of topics — exactly what the AI coach schedules for you.",
  }),
];

const SUBJECT_TPL: Record<string, Tpl[]> = {
  Physics: PHYSICS_TPL,
  Chemistry: CHEM_TPL,
  Biology: BIO_TPL,
  Mathematics: MATH_TPL,
  Science: SCIENCE_TPL,
};

const HANDWRITTEN: Record<string, Omit<Question, "id" | "subject" | "topic" | "difficulty">[]> = {
  Kinematics: [
    {
      question:
        "A car starts from rest and accelerates uniformly at 2 m/s². The distance covered in the 5th second of motion is:",
      options: ["9 m", "11 m", "25 m", "16 m"],
      correct: 0,
      explanation:
        "Distance in nth second = u + a/2(2n − 1) = 0 + 1 × 9 = 9 m. Formula: sₙ = u + (a/2)(2n − 1).",
    },
    {
      question:
        "A ball is thrown vertically upward with speed 20 m/s. The time taken to return to the thrower is: (g = 10 m/s²)",
      options: ["2 s", "4 s", "8 s", "1 s"],
      correct: 1,
      explanation: "Time of flight = 2u/g = 2 × 20 / 10 = 4 s. Time up equals time down.",
    },
  ],
  "Laws of Motion": [
    {
      question: "For every action there is an equal and opposite reaction. This is:",
      options: [
        "Newton's first law",
        "Newton's second law",
        "Newton's third law",
        "Law of gravitation",
      ],
      correct: 2,
      explanation:
        "Newton's third law states action and reaction are equal in magnitude and opposite in direction, acting on different bodies.",
    },
  ],
  "Mole Concept": [
    {
      question: "The number of moles in 11 g of CO₂ is: (atomic masses C = 12, O = 16)",
      options: ["0.25 mol", "0.5 mol", "0.75 mol", "1.0 mol"],
      correct: 0,
      explanation: "Molar mass of CO₂ = 12 + 32 = 44 g/mol. Moles = 11/44 = 0.25 mol.",
    },
  ],
  "Cell Biology": [
    {
      question: "The powerhouse of the cell is the:",
      options: ["Ribosome", "Mitochondrion", "Golgi body", "Lysosome"],
      correct: 1,
      explanation:
        "Mitochondria generate ATP through oxidative phosphorylation, earning the name 'powerhouse of the cell'.",
    },
  ],
  Genetics: [
    {
      question: "In a monohybrid cross between tall (TT) and dwarf (tt) pea plants, the F₁ generation is:",
      options: ["All dwarf", "All tall", "Half tall, half dwarf", "3 tall : 1 dwarf"],
      correct: 1,
      explanation:
        "F₁ plants are all Tt — heterozygous tall, since tall (T) is dominant over dwarf (t). The 3:1 ratio appears in F₂.",
    },
  ],
  Algebra: [
    {
      question: "The roots of x² − 5x + 6 = 0 are:",
      options: ["2 and 3", "−2 and −3", "−2 and 3", "1 and 6"],
      correct: 0,
      explanation: "x² − 5x + 6 = (x − 2)(x − 3) = 0, so x = 2 or x = 3.",
    },
  ],
  Mechanics: [
    {
      question: "A body of mass 2 kg moves with velocity 3 m/s. Its kinetic energy is:",
      options: ["3 J", "6 J", "9 J", "18 J"],
      correct: 2,
      explanation: "KE = ½mv² = ½ × 2 × 9 = 9 J.",
    },
  ],
  "Physical Chemistry": [
    {
      question: "For an ideal gas, the value of Cp − Cv is:",
      options: ["R", "2R", "R/2", "0"],
      correct: 0,
      explanation: "Mayer's relation: Cp − Cv = R for an ideal gas.",
    },
  ],
  Calculus: [
    {
      question: "The derivative of x³ with respect to x is:",
      options: ["3x²", "x²", "3x", "x³/3"],
      correct: 0,
      explanation: "d/dx (xⁿ) = n·xⁿ⁻¹, so d/dx (x³) = 3x².",
    },
  ],
  "Organic Chemistry": [
    {
      question: "The functional group in ethanol is:",
      options: ["Aldehyde", "Ketone", "Hydroxyl", "Carboxyl"],
      correct: 2,
      explanation: "Ethanol (C₂H₅OH) contains the hydroxyl (−OH) functional group.",
    },
  ],
  "Real Numbers": [
    {
      question: "The HCF of 96 and 404 using Euclid's algorithm is:",
      options: ["2", "4", "8", "12"],
      correct: 1,
      explanation: "404 = 96 × 4 + 20; 96 = 20 × 4 + 16; 20 = 16 × 1 + 4; 16 = 4 × 4 + 0. HCF = 4.",
    },
  ],
  "Chemical Reactions and Equations": [
    {
      question: "In the reaction 2H₂ + O₂ → 2H₂O, the type of reaction is:",
      options: ["Decomposition", "Combination", "Displacement", "Double displacement"],
      correct: 1,
      explanation: "Two reactants combine to form a single product — a combination reaction.",
    },
  ],
};

let idCounter = 0;
function qid(stream: string) {
  idCounter += 1;
  return `${stream}_q${idCounter}`;
}

function buildQuestion(stream: string, subject: string, topic: string, difficulty: Difficulty, variant: number): Question {
  const bank = HANDWRITTEN[topic] ?? [];
  if (bank.length > variant) {
    const q = bank[variant];
    return { id: qid(stream), subject, topic, difficulty, ...q };
  }
  const tpls = SUBJECT_TPL[subject] ?? MATH_TPL;
  const tpl = tpls[variant % tpls.length];
  const q = tpl(topic, subject);
  return { id: qid(stream), subject, topic, difficulty, ...q };
}

function pickDifficulty(mix: { easy: number; medium: number; hard: number }, i: number): Difficulty {
  const total = mix.easy + mix.medium + mix.hard;
  const r = (i * 37 + 13) % total;
  if (r < mix.easy) return "easy";
  if (r < mix.easy + mix.medium) return "medium";
  return "hard";
}

export function buildMockTest(streamId: string, count = MOCK_QUESTION_COUNT, titleSuffix = "Mock Test"): Test {
  const stream = MOCK_STREAMS.find((s) => s.id === streamId) ?? MOCK_STREAMS[0];
  const pairs = STREAM_SUBJECT_TOPICS[stream.id] ?? STREAM_SUBJECT_TOPICS.neet;
  const questions: Question[] = [];
  let i = 0;
  while (questions.length < count) {
    const pair = pairs[i % pairs.length];
    const difficulty = pickDifficulty(stream.difficultyMix, i);
    questions.push(buildQuestion(stream.id, pair.subject, pair.topic, difficulty, Math.floor(i / pairs.length)));
    i += 1;
  }
  return {
    test_id: `mock_${stream.id}_${Date.now().toString(36)}`,
    title: `${stream.name} ${titleSuffix}`,
    stream: stream.id,
    questions,
  };
}

export function computeMockResult(test: Test, answers: { question_id: string; chosen: number }[]): AttemptResult {
  const perTopicMap = new Map<string, PerTopic>();
  const answerMap = new Map(answers.map((a) => [a.question_id, a.chosen]));
  let correctCount = 0;

  for (const q of test.questions) {
    const key = `${q.subject}::${q.topic}`;
    const row = perTopicMap.get(key) ?? { subject: q.subject, topic: q.topic, correct: 0, total: 0, accuracy: 0 };
    row.total += 1;
    if (answerMap.get(q.id) === q.correct) {
      row.correct += 1;
      correctCount += 1;
    }
    perTopicMap.set(key, row);
  }

  const per_topic = [...perTopicMap.values()].map((r) => ({ ...r, accuracy: r.correct / r.total }));
  const score = correctCount;
  const total = test.questions.length;
  const accuracy = correctCount / total;
  const weak_areas: WeakStrongArea[] = per_topic
    .filter((r) => r.accuracy < 0.6)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 4)
    .map((r) => ({ topic: r.topic, accuracy: r.accuracy }));
  const strong_areas: WeakStrongArea[] = per_topic
    .filter((r) => r.accuracy >= 0.6)
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 4)
    .map((r) => ({ topic: r.topic, accuracy: r.accuracy }));

  const percentile_est = Math.min(99, Math.round(20 + accuracy * 78));
  const coachMessage =
    accuracy >= 0.85
      ? `Outstanding! ${score}/${total} — you're operating at ${percentile_est}th percentile. Sharpen your ${weak_areas[0]?.topic ?? "toughest"} edge cases and attempt full-length papers next.`
      : accuracy >= 0.6
        ? `Solid work — ${score}/${total} correct. ${strong_areas.length > 0 ? `You clearly own ${strong_areas.slice(0, 2).map((s) => s.topic).join(" and ")}. ` : ""}Your weakest area is ${weak_areas[0]?.topic ?? "—"}: revisit theory, then re-attempt a focused test.`
        : `You scored ${score}/${total}. Don't worry — this is exactly what the diagnostic is for. Start with ${weak_areas[0]?.topic ?? "your core chapters"}, watch concept videos, and take the focused practice test I've queued for you.`;

  return {
    score,
    total,
    accuracy,
    per_topic,
    weak_areas,
    strong_areas,
    percentile_est,
    coach_message: coachMessage,
  };
}

export function mockAnalytics(streamId: string): Analytics {
  const stream = MOCK_STREAMS.find((s) => s.id === streamId) ?? MOCK_STREAMS[0];
  const maxMarks = streamId.startsWith("cbse") ? 80 : streamId === "neet" ? 720 : streamId === "jee-mains" ? 300 : 360;
  const pairs = STREAM_SUBJECT_TOPICS[stream.id] ?? STREAM_SUBJECT_TOPICS.neet;
  const heatmap: Record<string, Record<string, number>> = {};
  pairs.forEach((p, i) => {
    const subj = heatmap[p.subject] ?? {};
    subj[p.topic] = Math.min(1, Math.max(0.25, 0.95 - ((i * 29) % 70) / 100));
    heatmap[p.subject] = subj;
  });
  const brain_map = [
    { subject: "Physics", value: 0.82 },
    { subject: "Chemistry", value: 0.74 },
    { subject: "Biology", value: 0.91 },
    { subject: "Mathematics", value: 0.68 },
    { subject: "Algebra", value: 0.72 },
    { subject: "Calculus", value: 0.65 },
    { subject: "Organic Chem", value: 0.78 },
    { subject: "Genetics", value: 0.88 },
    { subject: "Mechanics", value: 0.83 },
    { subject: "Thermodynamics", value: 0.6 },
    { subject: "Electrostatics", value: 0.71 },
    { subject: "Trigonometry", value: 0.77 },
  ];
  const today = new Date();
  const trend = Array.from({ length: 10 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (9 - i) * 2);
    return { date: d.toISOString().slice(0, 10), score: Math.min(98, 38 + i * 4 + ((i * 13) % 9)) };
  });
  const badges = [
    { id: "first", name: "First Blood", description: "Attempted your first mock test", icon: "Zap", earned: true },
    { id: "streak3", name: "On Fire", description: "3-day practice streak", icon: "Flame", earned: true },
    { id: "streak7", name: "Unstoppable", description: "7-day practice streak", icon: "Flame", earned: false },
    { id: "top10", name: "Top 10%", description: "Scored in the top 10th percentile", icon: "Trophy", earned: true },
    { id: "accuracy90", name: "Sharpshooter", description: "90%+ accuracy in a test", icon: "Target", earned: false },
    { id: "quiz5", name: "Deep Thinker", description: "5 tests with 70%+ accuracy", icon: "Brain", earned: false },
    { id: "level5", name: "Rising Star", description: "Reached level 5", icon: "Rocket", earned: true },
    { id: "perfect", name: "Perfect 10", description: "Full marks in a section", icon: "Crown", earned: false },
    { id: "consistent", name: "Consistent", description: "Improving trend across 6 tests", icon: "Star", earned: true },
  ];
  const recent = [
    { id: "a1", title: `${stream.name} Diagnostic`, stream: stream.id, score: 34, total: 50, accuracy: 0.68, date: new Date(today.getTime() - 86400000 * 2).toISOString() },
    { id: "a2", title: `${stream.name} Physics Focus`, stream: stream.id, score: 15, total: 20, accuracy: 0.75, date: new Date(today.getTime() - 86400000 * 4).toISOString() },
    { id: "a3", title: `${stream.name} Full Mock 1`, stream: stream.id, score: 31, total: 50, accuracy: 0.62, date: new Date(today.getTime() - 86400000 * 6).toISOString() },
    { id: "a4", title: `${stream.name} Chemistry Focus`, stream: stream.id, score: 13, total: 20, accuracy: 0.65, date: new Date(today.getTime() - 86400000 * 8).toISOString() },
    { id: "a5", title: `${stream.name} Biology Focus`, stream: stream.id, score: 18, total: 20, accuracy: 0.9, date: new Date(today.getTime() - 86400000 * 10).toISOString() },
  ];
  return {
    attempts: 12,
    avg_score: 68.4,
    trend,
    heatmap,
    brain_map,
    predictor: { expected: Math.round(0.71 * maxMarks), max: maxMarks },
    streak: 5,
    xp: 1450,
    level: 8,
    badges,
    recent_attempts: recent,
  };
}

export function mockPlan(result: AttemptResult): PlanRecommendation[] {
  return result.weak_areas.slice(0, 3).map((w, i) => ({
    topic: w.topic,
    reason: `You scored ${Math.round(w.accuracy * 100)}% in ${w.topic} — the lowest of your weak areas.`,
    tests: [`focus-${w.topic.toLowerCase().replace(/\s+/g, "-")}-1`, `focus-${w.topic.toLowerCase().replace(/\s+/g, "-")}-2`],
    advice:
      i === 0
        ? "Watch 2 concept videos on this topic today, solve 15 level-1 questions, then attempt the focus test."
        : "Revise NCERT/standard notes for 30 minutes, then attempt the queued focus test. Review every explanation.",
  }));
}
