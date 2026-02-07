
import React, { useState } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { Button } from './components/ui/Button';
import { AppState, GeneratedImage } from './types';
import * as gemini from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    sourceImage: null,
    prompt: '',
    isGenerating: false,
    error: null,
    results: [],
  });

  const handleGenerate = async () => {
    if (!state.sourceImage || !state.prompt) {
      setState(prev => ({ ...prev, error: 'Please provide both an image and a prompt.' }));
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const resultUrl = await gemini.generateImg2Img(state.sourceImage, state.prompt);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: resultUrl,
        prompt: state.prompt,
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        isGenerating: false,
        results: [newImage, ...prev.results]
      }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: err.message || 'An unexpected error occurred during generation.' 
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
        <div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight flex items-center gap-3">
            <span className="bg-yellow-400 text-slate-900 px-3 py-1 rounded-xl -rotate-2">Nano</span>
            <span>Banana Pro</span>
          </h1>
          <p className="text-slate-400 mt-3 text-lg">Next-gen AI Image-to-Image Workspace</p>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Input */}
        <section className="lg:col-span-5 space-y-8">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-xl sticky top-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Reference Image (Full View)</label>
                <ImageUpload 
                  currentImage={state.sourceImage}
                  onImageSelect={(img) => setState(prev => ({ ...prev, sourceImage: img, error: null }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Prompt</label>
                <textarea 
                  className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all placeholder-slate-500 resize-none"
                  placeholder="Describe how to transform the image... e.g., 'Turn this sketch into a futuristic cyberpunk city with neon lighting and rainy streets'"
                  value={state.prompt}
                  onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value, error: null }))}
                />
              </div>

              {state.error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {state.error}
                </div>
              )}

              <Button 
                onClick={handleGenerate} 
                className="w-full py-4 text-lg"
                isLoading={state.isGenerating}
                disabled={!state.sourceImage || !state.prompt}
              >
                {state.isGenerating ? 'Synthesizing...' : 'Generate Art'}
              </Button>
            </div>
          </div>
        </section>

        {/* Right Column: Grid */}
        <section className="lg:col-span-7">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Gallery</h2>
            <span className="text-sm text-slate-500">{state.results.length} Creations</span>
          </div>

          {state.results.length === 0 && !state.isGenerating ? (
            <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-3xl p-20 flex flex-col items-center justify-center text-center opacity-60">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-slate-400 italic">Generated masterpieces will appear here in their full glory.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {state.isGenerating && (
                <div className="relative group rounded-3xl overflow-hidden bg-slate-900 border border-yellow-400/30 animate-pulse aspect-square">
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin"></div>
                    <p className="text-yellow-400 font-medium text-sm">Processing Pixels...</p>
                  </div>
                </div>
              )}
              {state.results.map((res) => (
                <div key={res.id} className="group relative bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-3xl overflow-hidden transition-all hover:border-slate-600 hover:shadow-2xl hover:shadow-yellow-400/5">
                  <div className="relative overflow-hidden bg-slate-950 flex items-center justify-center min-h-[300px]">
                    <img 
                      src={res.url} 
                      alt={res.prompt} 
                      className="w-full h-auto max-h-[500px] object-contain transition-transform duration-700 group-hover:scale-105 p-1"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                      <p className="text-sm font-medium line-clamp-3 text-white leading-relaxed">{res.prompt}</p>
                      <div className="mt-4 flex gap-2">
                        <a 
                          href={res.url} 
                          download={`nano-banana-${res.id}.png`}
                          className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                        <button 
                          onClick={() => navigator.clipboard.writeText(res.prompt)}
                          className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-900/40 border-t border-slate-800 flex justify-between items-center group-hover:bg-slate-900/80 transition-colors">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Generated Artwork</span>
                    <span className="text-[10px] text-slate-600">{new Date(res.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="mt-20 pt-12 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Nano Banana Pro • Images displayed in full aspect ratio</p>
      </footer>
    </div>
  );
};

export default App;
