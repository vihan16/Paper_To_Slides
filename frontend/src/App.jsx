import { useState } from 'react';
import UploadForm from './components/UploadForm';
import SettingsForm from './components/SettingsForm';
import { generatePresentation } from './services/api';

function App() {
  const [file, setFile] = useState(null);
  const [theme, setTheme] = useState('Corporate');
  const [slideLength, setSlideLength] = useState('Medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!file) return;
    setIsGenerating(true);
    setError('');
    setResult(null);
    try {
      const data = await generatePresentation(file, theme, slideLength);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.details || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (result && result.file_url) {
      window.open(`http://localhost:5000/api/download?path=${encodeURIComponent(result.file_url)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-50 via-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-40 left-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center space-x-3 mb-6 bg-white/50 backdrop-blur-sm px-6 py-2 rounded-full border border-gray-200 shadow-sm cursor-default hover-lift">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
            </span>
            <span className="text-sm font-bold tracking-wide text-gray-700 uppercase">AI Powered Engine</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-800 via-primary-600 to-indigo-600 tracking-tight mb-4 drop-shadow-sm">
            Research Paper to <br className="hidden md:block" /> Presentation.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Transform heavy academic documents into stunning, ready-to-present slides highlighting key architectures, metrics, and summaries.
          </p>
        </div>

        {!result ? (
          <div className="space-y-8 relative">
            <UploadForm onFileUpload={(uploadedFile) => setFile(uploadedFile)} />

            <SettingsForm
              theme={theme} setTheme={setTheme}
              slideLength={slideLength} setSlideLength={setSlideLength}
            />

            {error && (
              <div className="max-w-2xl mx-auto bg-red-50/90 backdrop-blur-sm text-red-700 border border-red-200 p-5 rounded-xl text-center font-medium flex items-center justify-center space-x-3 shadow-sm animate-fade-in">
                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-center mt-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <button
                disabled={!file || isGenerating}
                onClick={handleGenerate}
                className={`relative overflow-hidden group px-10 py-4 text-xl font-bold rounded-2xl shadow-xl transition-all duration-300 transform 
                  ${!file || isGenerating ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-200' : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white hover:-translate-y-1 hover:shadow-primary-500/30 border border-white/10'}`}
              >
                {isGenerating && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none"></div>
                )}
                <span className="flex items-center space-x-3">
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Analyzing Document & Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Magic Presentation</span>
                      <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto glass-panel p-12 text-center animate-fade-in">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-black">Masterpiece Ready!</h2>
            <p className="text-xl text-gray-600 mb-10 font-medium">Successfully contextualized insights into <span className="font-bold text-primary-600 px-2 py-1 bg-primary-50 rounded-lg">{result.slide_count} perfectly structured slides</span>.</p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-lg font-bold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center space-x-3 border border-indigo-400"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                <span>Download .PPTX</span>
              </button>
              <button
                onClick={() => { setResult(null); setFile(null); }}
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 text-lg font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
