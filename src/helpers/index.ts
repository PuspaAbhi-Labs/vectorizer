export async function tryCatch<T, E = Error>(fn: () => T | PromiseLike<T>) {
    try {
        const data = await fn()
        return { data, error: undefined } as const
    } catch (error) {
        return { data: undefined, error: error as E } as const
    }
}