import fs from 'fs';
// @ts-ignore
import pdf from 'pdf-parse';
import prisma from '../config/prisma';
import { AiService } from './ai.service';

export class RagService {
    static async processPdf(userId: string, filename: string, filePath: string) {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            const text = data.text;

            // Create Document record
            const document = await prisma.document.create({
                data: {
                    userId,
                    filename,
                },
            });

            // Simple chunking (e.g., by double newlines or fixed length)
            const chunks = text.split(/\n\s*\n/).filter((c: string) => c.trim().length > 50);

            for (const content of chunks) {
                const embedding = await AiService.getEmbedding(content);
                await prisma.chunk.create({
                    data: {
                        docId: document.id,
                        content,
                        embedding,
                    },
                });
            }

            return document;
        } catch (error: any) {
            console.error('RAG Process Error:', error.message);
            throw new Error('Failed to process PDF');
        } finally {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    }

    static async queryDocuments(userId: string, query: string) {
        try {
            const queryEmbedding = await AiService.getEmbedding(query);

            // Perform vector search using MongoDB raw query
            // Note: This assumes a vector index is created on the 'chunks' collection
            // For demonstration, we'll fetch chunks and do a simple cosine similarity or use aggregateRaw
            // MongoDB Atlas Vector Search syntax:
            const results: any = await prisma.$runCommandRaw({
                aggregate: 'chunks',
                pipeline: [
                    {
                        $vectorSearch: {
                            index: 'vector_index',
                            path: 'embedding',
                            queryVector: queryEmbedding,
                            numCandidates: 100,
                            limit: 5,
                        },
                    },
                    {
                        $project: {
                            content: 1,
                            score: { $meta: 'vectorSearchScore' },
                        },
                    },
                ],
                cursor: {},
            });

            const context = results.cursor.firstBatch.map((r: any) => r.content).join('\n\n');

            // Generate answer using context
            const prompt = `
        You are a specialized learning assistant. Use the following context from the user's uploaded documents to answer the query.
        If the answer is not in the context, say you don't know based on the provided data.
        
        Context:
        ${context}
        
        Query: ${query}
      `;

            // Use Gemini to generate answer
            // (Reusing the genAI model locally if we don't want to add another method to AiService yet)
            const { GoogleGenerativeAI } = require('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const answerResult = await model.generateContent(prompt);
            const response = await answerResult.response;

            return {
                answer: response.text(),
                sources: results.cursor.firstBatch.map((r: any) => ({ content: r.content, score: r.score })),
            };
        } catch (error: any) {
            console.error('RAG Query Error:', error.message);
            // Fallback if vector index not setup: simple text search or error
            throw new Error('Failed to query documents. Ensure MongoDB Atlas Vector Search index is created.');
        }
    }
}
