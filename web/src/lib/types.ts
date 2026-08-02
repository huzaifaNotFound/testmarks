export type Difficulty = "easy" | "medium" | "hard";
export type Role = "student" | "admin";

export interface Question {
  id: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Test {
  test_id: string;
  title: string;
  stream: string;
  questions: Question[];
}

export interface Stream {
  id: string;
  name: string;
  subjects: string[];
  difficultyMix: { easy: number; medium: number; hard: number };
  accent: string;
  tagline: string;
}

export interface PerTopic {
  subject: string;
  topic: string;
  correct: number;
  total: number;
  accuracy: number;
}

export interface WeakStrongArea {
  topic: string;
  accuracy: number;
}

export interface AttemptResult {
  score: number;
  total: number;
  accuracy: number;
  per_topic: PerTopic[];
  weak_areas: WeakStrongArea[];
  strong_areas: WeakStrongArea[];
  percentile_est: number;
  coach_message: string;
}

export interface SubmitAttemptPayload {
  user_id: string;
  test_id: string;
  answers: { question_id: string; chosen: number }[];
  time_taken_sec: number;
}

export interface GenerateTestPayload {
  user_id: string;
  stream: string;
  focus_topics?: string[];
  difficulty?: Difficulty;
  count: number;
}

export interface TrendPoint {
  date: string;
  score: number;
}

export type Heatmap = Record<string, Record<string, number>>;

export interface BrainMapPoint {
  subject: string;
  value: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

export interface RecentAttempt {
  id: string;
  title: string;
  stream: string;
  score: number;
  total: number;
  accuracy: number;
  date: string;
}

export interface Analytics {
  attempts: number;
  avg_score: number;
  trend: TrendPoint[];
  heatmap: Heatmap;
  brain_map: BrainMapPoint[];
  predictor: { expected: number; max: number };
  streak: number;
  xp: number;
  level: number;
  badges: Badge[];
  recent_attempts: RecentAttempt[];
}

export interface PlanRecommendation {
  topic: string;
  reason: string;
  tests: string[];
  advice: string;
}

export interface StudyPlan {
  recommendations: PlanRecommendation[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  premium: boolean;
  stream?: string;
}

export interface SignInInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  adminCode?: string;
}
