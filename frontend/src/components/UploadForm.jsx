import React, { useState } from 'react';

const UploadForm = ({ onFileUpload }) => {
   const [dragActive, setDragActive] = useState(false);
   const [file, setFile] = useState(null);

   const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'dragenter' || e.type === 'dragover') {
         setDragActive(true);
      } else if (e.type === 'dragleave') {
         setDragActive(false);
      }
   };

   const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
         handleFile(e.dataTransfer.files[0]);
      }
   };

   const handleChange = (e) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
         handleFile(e.target.files[0]);
      }
   };

   const handleFile = (selectedFile) => {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (validTypes.includes(selectedFile.type)) {
         setFile(selectedFile);
         onFileUpload(selectedFile);
      } else {
         alert("Invalid file format. Please upload PDF, DOCX, or TXT.");
      }
   };

   return (
      <div className="w-full max-w-2xl mx-auto p-4 animate-fade-in">
         <div
            className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 transform
          ${dragActive ? 'border-primary-500 bg-primary-50/80 scale-[1.02] shadow-primary-500/20 shadow-2xl' : 'border-primary-200 hover:border-primary-400 glass-panel hover-lift'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
         >
            {dragActive && (
               <div className="absolute inset-0 bg-primary-500/5 backdrop-blur-sm pointer-events-none"></div>
            )}
            <input
               type="file"
               id="file-upload"
               className="hidden"
               accept=".pdf,.docx,.txt"
               onChange={handleChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-6 relative z-10">
               <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${dragActive ? 'bg-primary-600 text-white scale-110 shadow-lg shadow-primary-500/30' : 'bg-primary-100/80 text-primary-600 group-hover:bg-primary-200'}`}>
                  <svg className={`w-10 h-10 transition-transform duration-500 ${dragActive ? 'animate-bounce' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
               </div>
               <div className="space-y-2">
                  <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900">
                     {file ? file.name : "Drag & Drop your document here"}
                  </p>
                  <p className="text-md text-gray-500 font-medium">
                     {!file && "or click to browse from your computer"}
                  </p>
               </div>

               <div className="flex flex-col items-center mt-4">
                  <div className="flex space-x-3 text-sm text-gray-400 font-medium bg-white/60 px-4 py-2 rounded-full border border-gray-100">
                     <span>PDF</span> • <span>DOCX</span> • <span>TXT</span>
                  </div>
               </div>

               {file && (
                  <div className="mt-6 px-6 py-3 bg-green-500/10 text-green-700 border border-green-200 rounded-xl flex items-center space-x-2 animate-fade-in shadow-sm">
                     <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                     <span className="font-semibold">Ready to generate</span>
                  </div>
               )}
            </label>
         </div>
      </div>
   );
};

export default UploadForm;
