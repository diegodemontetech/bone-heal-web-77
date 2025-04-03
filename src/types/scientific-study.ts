
export interface ScientificStudy {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  published_date: string;
  description?: string;
  abstract?: string;
  doi?: string;
  url?: string;
  file_url?: string;
  citation?: string;
  category?: string;
  tags?: string[];
  created_at?: string;
}

export type StudyCategory = 
  | "clinical-case" 
  | "systematic-review" 
  | "randomized-trial" 
  | "laboratory-study" 
  | "other";
