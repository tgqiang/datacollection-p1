import { z } from "zod";
import { FILTER_ARRAY_MAX_LENGTH } from "@/utils/constants";

/**
 * Defines the acceptable filters that can be applied on this API's data.
 * @property {string[]} userId - An array of `userId`s to target
 * @property {string[]} location - An array of `location` names to target
 * @property {Date[]} attemptDateRange - An array of size 2, representing `[fromDate, toDate]` inclusive of both intervals; each element is autofilled with default values if not specified
 */
export type AssessmentRecordPermittedFilters = {
  userId?: string[];
  location?: string[];
  attemptDateRange?: Array<Date | null>;
};

export const recordFilterSchema = z.object({
  userId: z.array(z.string()).optional(),
  location: z.array(z.string()).optional(),
  attemptDateRange: z.array(z.coerce.date().or(z.null())).length(2).optional(),
});

export function validateFilters(filters: unknown) {
  const result = recordFilterSchema.safeParse(filters);
  if (!result.success) return null;

  const sanitizedFilters = {
    // `trim()` will reduce whitespaces into empty-strings;
    // `filter(Boolean)` will then strip away "falsy" values (e.g. `undefined`/`null`/`""`)
    userId: result.data.userId
      ?.map((id: string) => id.trim())
      .filter(Boolean)
      .slice(0, Math.max(result.data.userId?.length, FILTER_ARRAY_MAX_LENGTH)),
    location: result.data.location
      ?.map((loc: string) => loc.trim())
      .filter(Boolean)
      .slice(
        0,
        Math.max(result.data.location?.length, FILTER_ARRAY_MAX_LENGTH)
      ),
    attemptDateRange: result.data.attemptDateRange?.map((date: unknown) =>
      date instanceof Date ? date : null
    ),
  } as AssessmentRecordPermittedFilters;

  return sanitizedFilters;
}
