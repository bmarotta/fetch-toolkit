/**
 * Generate a unique id based on the current timestamp
 * @param randomPrecision Number of random bytes to append to the timestamp
 * @returns A unique id
 */
export function generateUidBasedOnTimestamp(randomPrecision = 6) {
    const randomValues = Array.from({ length: randomPrecision }, () =>
        Math.floor(Math.random() * 256)
    );
    return (
        new Date()
            .toISOString()
            .substring(2)
            .replace(/[:\-TZ.]*/g, "") + String.fromCharCode(...randomValues)
    );
}

/**
 * Joins URL parts into a single URL string
 * @param args URL parts to be joined
 * @returns The URL
 */
export function joinUrl(args: string[]) {
    let hasQuery = args?.length > 0 && args[0].indexOf("?") > -1;
    const url = args.reduce((acc, arg) => {
        let res;
        if (hasQuery) {
            if (arg.startsWith("?") || arg.startsWith("&")) {
                res = acc + arg.substring(1);
            } else {
                res = acc + "&" + arg;
            }
        } else if (arg.startsWith("?")) {
            res = acc + arg;
        } else if (acc.endsWith("/") && arg.startsWith("/")) {
            res = acc + arg.substring(1);
        } else if (!acc.endsWith("/") && !arg.startsWith("/")) {
            res = acc + "/" + arg;            
        } else {
            res = acc + arg;
        }        
        hasQuery = hasQuery || res.indexOf("?") > -1;
        return res;
    });
    return url;
}