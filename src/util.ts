import crypto from "crypto";

export function generateUidBasedOnTimestamp() {
    const randomValues = crypto.randomBytes(6);
    return (
        new Date()
            .toISOString()
            .substring(2)
            .replace(/[:\-TZ.]*/g, "") + randomValues.toString("base64")
    );
}
