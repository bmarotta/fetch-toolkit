import { joinUrl } from "../src/utils";

describe("joinUrl", () => {
    it("should join the given arguments into a valid URL", () => {
        const args = ["http://example.com", "api", "users"];
        const result = joinUrl(args);
        expect(result).toBe("http://example.com/api/users");
    });

    it("should handle multiple slashes in the arguments", () => {
        const args = ["http://example.com/", "/api/", "/users/"];
        const result = joinUrl(args);
        expect(result).toBe("http://example.com/api/users/");
    });

    it("should handle different protocols", () => {
        const args = ["file://", "path", "to", "file"];
        const result = joinUrl(args);
        expect(result).toBe("file://path/to/file");
    });

    it("should handle query parameters", () => {
        const args = ["http://example.com", "api", "users", "?page=1&limit=10"];
        const result = joinUrl(args);
        expect(result).toBe("http://example.com/api/users?page=1&limit=10");
    });

    it("should handle existing query parameters", () => {
        const args = ["http://example.com/api/users?page=1", "limit=10"];
        const result = joinUrl(args);
        expect(result).toBe("http://example.com/api/users?page=1&limit=10");
    });
});
