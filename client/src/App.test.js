import { describe, expect, it } from "vitest";
import api from "./api";

describe("api client", () => {
  it("uses the local backend URL by default", () => {
    expect(api.defaults.baseURL).toBe("http://localhost:8800");
  });
});
