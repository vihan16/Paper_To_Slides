import React from 'react';

const SettingsForm = ({ theme, setTheme, slideLength, setSlideLength }) => {
   const themes = ['Academic', 'Corporate', 'Minimal', 'Dark Modern', 'Startup Pitch'];
   const slideLengths = {
      'Short': '8–10 slides',
      'Medium': '12–15 slides',
      'Detailed': '15–18 slides'
   };

   return (
      <div className="w-full max-w-2xl mx-auto p-8 glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
         <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 mb-6">
            Presentation Styling
         </h3>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Theme Selection */}
            <div className="space-y-2">
               <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Visual Theme</label>
               <div className="relative">
                  <select
                     className="w-full appearance-none border border-gray-200 rounded-xl p-3.5 bg-white/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm font-medium text-gray-700"
                     value={theme}
                     onChange={(e) => setTheme(e.target.value)}
                  >
                     {themes.map(t => (
                        <option key={t} value={t}>{t}</option>
                     ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                     <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
               </div>
            </div>

            {/* Slide Length Selection */}
            <div className="space-y-2">
               <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Detail Level</label>
               <div className="relative">
                  <select
                     className="w-full appearance-none border border-gray-200 rounded-xl p-3.5 bg-white/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm font-medium text-gray-700"
                     value={slideLength}
                     onChange={(e) => setSlideLength(e.target.value)}
                  >
                     {Object.entries(slideLengths).map(([key, desc]) => (
                        <option key={key} value={key}>{key} ({desc})</option>
                     ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                     <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default SettingsForm;
