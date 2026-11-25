import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { scoreAnswers } from "@/data/worthThermostatFormB";

export const participantSchema = z.object({
  first_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  consent: z.literal(true),
});

export async function saveWorthResult(id: string, details: unknown, answers: readonly number[]) {
  const participant = participantSchema.parse(details);
  const score = scoreAnswers(answers);
  const { error } = await supabase.from("worth_thermostat_results").insert({
    id, first_name: participant.first_name, email: participant.email.toLowerCase(), ...score,
  });
  // A retry with the same private receipt must not create a duplicate.
  if (error && error.code !== "23505") throw error;
  return score;
}

export async function saveWorthReflection(id: string, reflection: string) {
  const validated = z.string().max(5000).parse(reflection);
  const { error } = await supabase.rpc("save_worth_thermostat_reflection", { _id: id, _reflection: validated });
  if (error) throw error;
}