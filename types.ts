
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export interface AppState {
  sourceImage: string | null;
  prompt: string;
  isGenerating: boolean;
  error: string | null;
  results: GeneratedImage[];
}
