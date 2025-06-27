import { Hono } from 'hono'
import { vectorize, vectorizeBatch, cosineSimilarity, getModelInfo } from './lib'
import { tryCatch } from './helpers'

const app = new Hono()

app.get('/', (c) => c.text('Vector Embeddings Generator API'))

// Get model information
app.get('/info', async (c) => {
    const { data, error } = await tryCatch(() => c.json(getModelInfo()))
    if (error) return c.json({ error: error.message }, 500)
    return data
})

// Vectorize a single text
app.post('/vectorize', async (c) => {
    const { data, error } = await tryCatch(async () => {
        const { text, options } = await c.req.json()

        if (!text || typeof text !== 'string') {
            return c.json({ error: 'Text is required and must be a string' }, 400)
        }

        const vector = await vectorize(text, options)

        return c.json({
            text,
            vector,
            dimensions: vector.length
        })
    })
    if (error) return c.json({ error: error.message }, 500)
    return data
})

// Vectorize multiple texts in batch
app.post('/vectorize-batch', async (c) => {
    const { data, error } = await tryCatch(async () => {
        const { texts, options } = await c.req.json()

        if (!Array.isArray(texts) || texts.some(t => typeof t !== 'string')) {
            return c.json({ error: 'Texts must be an array of strings' }, 400)
        }

        const vectors = await vectorizeBatch(texts, options)

        return c.json({
            texts,
            vectors,
            count: vectors.length,
            dimensions: vectors[0]?.length || 0
        })
    })
    if (error) return c.json({ error: 'Failed to vectorize texts' }, 500)
    return data
})

// Calculate similarity between two texts
app.post('/similarity', async (c) => {
    const { data, error } = await tryCatch(async () => {
        const { textA, textB, options } = await c.req.json()

        if (!textA || !textB || typeof textA !== 'string' || typeof textB !== 'string') {
            return c.json({ error: 'Both textA and textB are required and must be strings' }, 400)
        }

        const [vectorA, vectorB] = await vectorizeBatch([textA, textB], options)
        const similarity = cosineSimilarity(vectorA, vectorB)

        return c.json({
            textA,
            textB,
            similarity,
            interpretation: similarity > 0.8 ? 'Very similar' :
                similarity > 0.6 ? 'Similar' :
                    similarity > 0.4 ? 'Somewhat similar' : 'Not similar'
        })
    })
    if (error) return c.json({ error: 'Failed to calculate similarity' }, 500)
    return data
})

export default app
