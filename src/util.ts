import crypto from "crypto";

export function generateUidBasedOnTimestamp(randomPrecision = 6) {
    const randomValues = crypto.randomBytes(randomPrecision);
    return (
        new Date()
            .toISOString()
            .substring(2)
            .replace(/[:\-TZ.]*/g, "") + randomValues.toString("base64")
    );
}
