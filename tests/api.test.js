import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/interview/route";



describe("Tina insurance API", () => {
  it("returns Tina’s opt-in question when history is empty", async () => {
    const response = await POST(
      new Request("http://localhost/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: "Insurance consultation",
          history: [],
        }),
      })
    );
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.reply).toContain("I’m Tina");
    expect(data.reply).toContain("May I ask you");
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