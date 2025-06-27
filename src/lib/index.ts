export {
  vectorize,
  vectorizeBatch,
  initializeEmbedder,
  cosineSimilarity,
  euclideanDistance,
  normalizeVector,
  findSimilar,
  getModelInfo
} from './vectorizer';

export type VectorizeOptions = {
  modelName?: string;
  pooling?: 'mean' | 'cls';
  normalize?: boolean;
};

export type SimilarityResult = {
  index: number;
  similarity: number;
};