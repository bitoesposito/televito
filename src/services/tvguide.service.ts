import CacheService from "./cache.service";

export default class TvGuideService {
    private static readonly API_URL = "https://services.tivulaguida.it/api/epg/highlights.json";

    public static async getTvGuide(maxItems?: number) {
        const cacheKey = `tvguide:highlights`;
        
        try {
            const data = await CacheService.get(cacheKey, async () => {
                const response = await fetch(TvGuideService.API_URL);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch TV guide: ${response.statusText}`);
                }
                
                return await response.json();
            });
            
            // La struttura potrebbe essere un array diretto o un oggetto con una proprietà che contiene l'array
            let programs: any[] = [];
            
            if (Array.isArray(data)) {
                programs = data;
            } else if (data.programs || data.highlights || data.items || data.data) {
                programs = data.programs || data.highlights || data.items || data.data;
            } else {
                throw new Error("Unexpected JSON structure from TV guide API");
            }
            
            if (!programs || programs.length === 0) {
                throw new Error("No TV guide programs found");
            }
            
            // Normalizza i dati per avere una struttura consistente
            const programsToProcess = maxItems ? programs.slice(0, maxItems) : programs;
            return programsToProcess.map((program: any) => {
                // Estrai il nome del canale se è un oggetto
                let channelName = "";
                if (program.channel) {
                    if (typeof program.channel === "string") {
                        channelName = program.channel;
                    } else if (program.channel.name) {
                        channelName = program.channel.name;
                    }
                } else if (program.channel_name) {
                    channelName = program.channel_name;
                } else if (program.station) {
                    channelName = typeof program.station === "string" ? program.station : program.station.name || "";
                }

                // Estrai il titolo
                const title = program.title || program.name || program.program_title || "Programma senza titolo";
                
                // Estrai la descrizione/contenuto
                const description = program.description || program.synopsis || program.summary || "";
                const content = description || title;

                // Estrai l'orario (onair contiene la data e ora di inizio nel formato "DD-MM-YYYY HH:MM")
                const onairValue = program.onair || "";
                const time = onairValue || program.time || program.start_time || program.datetime || program.start || "";

                return {
                    // Mantieni tutti i dati originali per riferimento
                    ...program,
                    // Sovrascrivi con i campi normalizzati (questi hanno precedenza)
                    title,
                    channel: channelName,
                    time: time || onairValue, // Assicurati che time sia sempre popolato se onair esiste
                    onair: onairValue, // Mantieni anche onair originale
                    description,
                    content
                };
            });
        } catch (error) {
            console.error("Error fetching TV guide:", error);
            throw error;
        }
    }
}

