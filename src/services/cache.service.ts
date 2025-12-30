interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

export default class CacheService {
    private static readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minuti in millisecondi
    private static cache: Map<string, CacheEntry<any>> = new Map();

    /**
     * Ottiene i dati dalla cache se ancora validi, altrimenti esegue la funzione e salva il risultato
     * @param key Chiave univoca per la cache
     * @param fetchFunction Funzione che esegue la chiamata API se i dati non sono in cache o sono scaduti
     * @returns I dati dalla cache o dalla chiamata API
     */
    public static async get<T>(
        key: string,
        fetchFunction: () => Promise<T>
    ): Promise<T> {
        const cached = CacheService.cache.get(key);
        const now = Date.now();

        // Se i dati sono in cache e ancora validi, restituiscili
        if (cached && (now - cached.timestamp) < CacheService.CACHE_DURATION) {
            return cached.data;
        }

        // Altrimenti, esegui la chiamata API e salva il risultato
        try {
            const data = await fetchFunction();
            CacheService.cache.set(key, {
                data,
                timestamp: now
            });
            return data;
        } catch (error) {
            // Se la chiamata fallisce e abbiamo dati in cache (anche scaduti), restituiscili come fallback
            if (cached) {
                console.warn(`API call failed for ${key}, using stale cache data`);
                return cached.data;
            }
            throw error;
        }
    }

    /**
     * Invalida la cache per una chiave specifica
     * @param key Chiave da invalidare
     */
    public static invalidate(key: string): void {
        CacheService.cache.delete(key);
    }

    /**
     * Pulisce tutta la cache
     */
    public static clear(): void {
        CacheService.cache.clear();
    }
}

