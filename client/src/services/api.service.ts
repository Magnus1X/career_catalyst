import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api',
});

export const cpTrackerApi = {
    getInsights: (handle: string) => api.get(`/cp-tracker/insights/${handle}`),
    getRoadmap: (handle: string) => api.get(`/cp-tracker/roadmap/${handle}`),
    getUserInfo: (handle: string) => api.get(`/cp-tracker/user/${handle}`),
};

export const codeInsightsApi = {
    analyzeComplexity: (code: string, language: string) =>
        api.post('/code-insights/analyze-complexity', { code, language }),
    breakdownLogic: (code: string, language: string) =>
        api.post('/code-insights/breakdown-logic', { code, language }),
};

export const interviewApi = {
    processAnswer: (question: string, audioFile: File) => {
        const formData = new FormData();
        formData.append('question', question);
        formData.append('audio', audioFile);
        return api.post('/interview/process-answer', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    getQuestions: () => api.get('/interview/questions'),
};

export const ragApi = {
    uploadPdf: (userId: string, pdfFile: File) => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('pdf', pdfFile);
        return api.post('/rag/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    query: (userId: string, query: string) =>
        api.post('/rag/query', { userId, query }),
};

export default api;
