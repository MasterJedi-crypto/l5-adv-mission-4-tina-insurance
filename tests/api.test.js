import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/interview/route";



describe("Interview API", () => {
  it("returns the first question when history is empty", async () => {
    const response = await POST(
      new Request("http://localhost/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: "Frontend Developer",
          history: [],
        }),
      })
    );
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.reply).toContain("Tell me about yourself");
    expect(data.questionNumber).toBe(1);
    expect(data.isComplete).toBe(false);
  });

  it("rejects requests with an empty jobTitle", async () => {
    const response = await POST(
      new Request("http://localhost/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: "",
          history: [],
        }),
      })
    );
  
    expect(response.status).toBe(400);
  
    const data = await response.json();
    expect(data.error).toContain("job title");
  });

  it("rejects invalid JSON bodies", async () => {
    const response = await POST(
      new Request("http://localhost/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not-json",
      })
    );
  
    expect(response.status).toBe(400);
  
    const data = await response.json();
    expect(data.error).toContain("valid JSON");
  });
  

});