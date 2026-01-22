import CacheService from "./utils/cache";

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
            
            // Structure could be a direct array or an object with a property containing the array
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
            
            // Normalize data to have a consistent structure
            const programsToProcess = maxItems ? programs.slice(0, maxItems) : programs;
            return programsToProcess.map((program: any) => {
                // Extract channel name if it's an object
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

                // Extract title
                const title = program.title || program.name || program.program_title || "Program without title";
                
                // Extract description/content
                const description = program.description || program.synopsis || program.summary || "";
                const content = description || title;

                // Extract time (onair contains start date and time in format "DD-MM-YYYY HH:MM")
                const onairValue = program.onair || "";
                const time = onairValue || program.time || program.start_time || program.datetime || program.start || "";

                return {
                    // Keep all original data for reference
                    ...program,
                    // Overwrite with normalized fields (these have precedence)
                    title,
                    channel: channelName,
                    time: time || onairValue, // Make sure time is always populated if onair exists
                    onair: onairValue, // Also keep original onair
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
