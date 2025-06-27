# Vector Embeddings Generator API

A high-performance vector embeddings generator built with Bun, Hono, and Transformers.js. This API provides endpoints for generating text embeddings, calculating similarity, and performing vector operations.

## Features

- 🚀 **Fast**: Built with Bun runtime for maximum performance
- 🤖 **AI-Powered**: Uses state-of-the-art transformer models via Transformers.js
- 📊 **Batch Processing**: Support for single and batch text vectorization
- 🔍 **Similarity Calculation**: Built-in cosine similarity and other vector operations
- 🛠 **Easy to Use**: Simple REST API with JSON responses
- 📦 **Lightweight**: No heavy dependencies, runs entirely in JavaScript

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (latest version)
- Node.js 18+ (alternative runtime)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd vectorizer

# Install dependencies
bun install

# Start the development server
bun dev
```

The API will be available at `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Health Check

**GET** `/`

Returns a simple status message.

**Response:**
```
Vector Embeddings Generator API
```

#### 2. Model Information

**GET** `/info`

Returns information about the loaded model.

**Response:**
```json
{
  "isInitialized": true
}
```

#### 3. Vectorize Single Text

**POST** `/vectorize`

Generates vector embeddings for a single text input.

**Request Body:**
```json
{
  "text": "Your text to vectorize",
  "options": {
    "modelName": "Xenova/all-MiniLM-L6-v2",
    "pooling": "mean",
    "normalize": true
  }
}
```

**Parameters:**
- `text` (string, required): The text to vectorize
- `options` (object, optional): Configuration options
  - `modelName` (string): Model to use (default: "Xenova/all-MiniLM-L6-v2")
  - `pooling` (string): Pooling method - "mean" or "cls" (default: "mean")
  - `normalize` (boolean): Whether to normalize the vector (default: true)

**Response:**
```json
{
  "text": "Your text to vectorize",
  "vector": [0.1, 0.2, -0.1, ...],
  "dimensions": 384
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/vectorize \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, world!"}'
```

#### 4. Vectorize Multiple Texts (Batch)

**POST** `/vectorize-batch`

Generates vector embeddings for multiple texts in a single request.

**Request Body:**
```json
{
  "texts": ["First text", "Second text", "Third text"],
  "options": {
    "modelName": "Xenova/all-MiniLM-L6-v2",
    "pooling": "mean",
    "normalize": true
  }
}
```

**Parameters:**
- `texts` (array of strings, required): Array of texts to vectorize
- `options` (object, optional): Same as single vectorize endpoint

**Response:**
```json
{
  "texts": ["First text", "Second text", "Third text"],
  "vectors": [
    [0.1, 0.2, -0.1, ...],
    [0.3, -0.1, 0.2, ...],
    [-0.1, 0.4, 0.1, ...]
  ],
  "count": 3,
  "dimensions": 384
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/vectorize-batch \
  -H "Content-Type: application/json" \
  -d '{"texts": ["Machine learning", "Artificial intelligence", "Deep learning"]}'
```

#### 5. Calculate Similarity

**POST** `/similarity`

Calculates cosine similarity between two texts.

**Request Body:**
```json
{
  "textA": "First text",
  "textB": "Second text",
  "options": {
    "modelName": "Xenova/all-MiniLM-L6-v2",
    "pooling": "mean",
    "normalize": true
  }
}
```

**Parameters:**
- `textA` (string, required): First text for comparison
- `textB` (string, required): Second text for comparison
- `options` (object, optional): Same as vectorize endpoints

**Response:**
```json
{
  "textA": "First text",
  "textB": "Second text",
  "similarity": 0.85,
  "interpretation": "Very similar"
}
```

**Similarity Interpretations:**
- `> 0.8`: Very similar
- `> 0.6`: Similar
- `> 0.4`: Somewhat similar
- `≤ 0.4`: Not similar

**Example:**
```bash
curl -X POST http://localhost:3000/similarity \
  -H "Content-Type: application/json" \
  -d '{"textA": "Machine learning is awesome", "textB": "AI and ML are great"}'
```

## Available Models

The API supports various pre-trained models from Hugging Face. The default model is `Xenova/all-MiniLM-L6-v2`, which provides a good balance of speed and quality.

**Popular Models:**
- `Xenova/all-MiniLM-L6-v2` (default) - Fast, 384 dimensions
- `Xenova/all-mpnet-base-v2` - Higher quality, 768 dimensions
- `Xenova/paraphrase-multilingual-MiniLM-L12-v2` - Multilingual support

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request (invalid input)
- `500`: Internal Server Error

**Error Response Format:**
```json
{
  "error": "Error description"
}
```

## Library Usage

You can also use the vectorizer functions directly in your code:

```javascript
import { vectorize, vectorizeBatch, cosineSimilarity } from './src/lib'

// Vectorize a single text
const vector = await vectorize("Hello, world!")

// Vectorize multiple texts
const vectors = await vectorizeBatch(["Text 1", "Text 2"])

// Calculate similarity
const similarity = cosineSimilarity(vector1, vector2)
```

## Performance Tips

1. **Use Batch Processing**: When vectorizing multiple texts, use `/vectorize-batch` for better performance
2. **Model Initialization**: The first request will take longer as it loads the model
3. **Caching**: Consider implementing caching for frequently requested vectors
4. **Memory Usage**: Larger models provide better quality but use more memory

## Development

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Run tests
bun test
```

## Project Structure

```
vectorizer/
├── src/
│   ├── lib/
│   │   ├── index.ts          # Library exports
│   │   └── vectorizer.ts     # Core vectorization logic
│   └── index.ts              # API server
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using Bun, Hono, and Transformers.js by [Puspa](https://github.com/puspa-chhetri) & [Abhi](https://github.com/abhishake1)**
