import { pipeline, env } from '@xenova/transformers';

// FIX: file system access issues
env.allowLocalModels = false;

let embedder: any = null;

/**
 * Initialize the embedding pipeline
 * @param modelName - The model to use for embeddings (default: 'Xenova/all-MiniLM-L6-v2')
 */
export async function initializeEmbedder(modelName: string = 'Xenova/all-MiniLM-L6-v2') {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', modelName);
  }
  return embedder;
}

/**
 * Generate vector embeddings for a given text
 * @param text - The input text to vectorize
 * @param options - Configuration options
 * @returns Promise<number[]> - The vector embedding as an array of numbers
 */
export async function vectorize(text: string, options: {
  modelName?: string;
  pooling?: 'mean' | 'cls';
  normalize?: boolean;
} = {}): Promise<number[]> {
  const {
    modelName = 'Xenova/all-MiniLM-L6-v2',
    pooling = 'mean',
    normalize = true
  } = options;

  // Initialize embedder if not already done
  await initializeEmbedder(modelName);

  // Generate embedding
  const embedding = await embedder(text, { pooling, normalize });

  // Convert tensor to regular array
  return embedding.tolist()[0];
}

/**
 * Generate vector embeddings for multiple texts in batch
 * @param texts - Array of input texts to vectorize
 * @param options - Configuration options
 * @returns Promise<number[][]> - Array of vector embeddings
 */
export async function vectorizeBatch(texts: string[], options: {
  modelName?: string;
  pooling?: 'mean' | 'cls';
  normalize?: boolean;
} = {}): Promise<[number[], number[]]> {
  const {
    modelName = 'Xenova/all-MiniLM-L6-v2',
    pooling = 'mean',
    normalize = true
  } = options;

  // Initialize embedder if not already done
  await initializeEmbedder(modelName);

  // Generate embeddings for all texts
  const embeddings = await embedder(texts, { pooling, normalize });

  // Convert tensors to regular arrays
  return embeddings.tolist();
}

/**
 * Calculate cosine similarity between two vectors
 * @param vectorA - First vector
 * @param vectorB - Second vector
 * @returns number - Cosine similarity score (-1 to 1)
 */
export function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i]! * vectorB[i]!;
    normA += vectorA[i]! * vectorA[i]!;
    normB += vectorB[i]! * vectorB[i]!;
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Calculate Euclidean distance between two vectors
 * @param vectorA - First vector
 * @param vectorB - Second vector
 * @returns number - Euclidean distance
 */
export function euclideanDistance(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have the same length');
  }

  let sum = 0;
  for (let i = 0; i < vectorA.length; i++) {
    const diff = vectorA[i]! - vectorB[i]!;
    sum += diff * diff;
  }

  return Math.sqrt(sum);
}

/**
 * Normalize a vector to unit length
 * @param vector - Input vector
 * @returns number[] - Normalized vector
 */
export function normalizeVector(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));

  if (norm === 0) {
    return vector;
  }

  return vector.map(val => val / norm);
}

/**
 * Find the most similar vectors to a query vector
 * @param queryVector - The query vector
 * @param vectors - Array of vectors to search through
 * @param topK - Number of top results to return
 * @returns Array of {index: number, similarity: number} sorted by similarity
 */
export function findSimilar(queryVector: number[], vectors: number[][], topK: number = 5): Array<{ index: number, similarity: number }> {
  const similarities = vectors.map((vector, index) => ({
    index,
    similarity: cosineSimilarity(queryVector, vector)
  }));

  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

/**
 * Get information about the loaded model
 * @returns Object with model information
 */
export function getModelInfo() {
  return {
    isInitialized: embedder !== null,
  };
}