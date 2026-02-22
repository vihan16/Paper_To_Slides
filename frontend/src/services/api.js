import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Node Gateway URL

export const generatePresentation = async (file, theme, slideLength) => {
   const formData = new FormData();
   formData.append('document', file);
   formData.append('theme', theme);
   formData.append('slide_length', slideLength);

   try {
      const response = await axios.post(`${API_BASE_URL}/api/process`, formData, {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      });
      return response.data;
   } catch (error) {
      console.error("Error generating presentation:", error);
      throw error;
   }
};
