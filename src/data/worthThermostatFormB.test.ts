import { describe, expect, it } from "vitest";
import { QUESTIONS, scoreAnswers } from "./worthThermostatFormB";

function answersForRaw(raw: number) {
  const answers = Array<number>(25).fill(1);
  let extra = raw - 25;
  for (let i = 0; i < answers.length; i++) { const add = Math.min(extra, 4); answers[i] += add; extra -= add; }
  return answers;
}

describe("owner-approved Form B scoring", () => {
  it("contains exactly 25 approved questions", () => {
    expect(QUESTIONS).toHaveLength(25);
  });
  it.each(Array.from({ length: 25 }, (_, index) => index))("question index %i has exactly five answer choices", index => {
    expect(QUESTIONS[index]?.options).toHaveLength(5);
  });
  it("scores all first options as raw 25, 20%, The Settler", () => {
    expect(scoreAnswers(Array(25).fill(1))).toEqual({ raw_score: 25, percentage: 20, result_type: "The Settler" });
  });
  it.each([
    [49, 39, "The Settler"], [50, 40, "The Seeker"],
    [74, 59, "The Seeker"], [75, 60, "The Boundary Builder"],
    [99, 79, "The Boundary Builder"], [100, 80, "The Rising Queen / King"],
    [125, 100, "The Rising Queen / King"],
  ])("maps raw %i to %i%% and %s", (raw, percentage, result_type) => {
    expect(scoreAnswers(answersForRaw(raw))).toEqual({ raw_score: raw, percentage, result_type });
  });
  it("refuses an incomplete assessment rather than scoring Question 1 alone", () => {
    expect(() => scoreAnswers([1])).toThrow();
  });
  it.each([0, 6, 1.5, NaN])("rejects invalid option value %s", invalid => {
    const answers = Array<number>(25).fill(1); answers[0] = invalid;
    expect(() => scoreAnswers(answers)).toThrow();
  });
});