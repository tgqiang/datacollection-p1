import { NextApiRequest, NextApiResponse } from "next";
import { AssessmentRecord } from "../../generated/prisma";
import prisma from "@/services/database";
import {
  AssessmentRecordPermittedFilters,
  validateFilters,
} from "@/utils/validations";
import { createResponseObject } from "@/utils/backend";
import {
  HISTORICAL_RECORDS_MAX_MONTHS,
  HISTORICAL_RECORDS_MAX_RECORDS,
} from "@/utils/constants";

/**
 * Defines the structure of all responses obtained from interfacing with this API.
 * @property {boolean} success - a flag indicating whether the request was successful
 * @property {Record<string, any> | Record<string, any>[] | null} data - the data that will be returned, if any; this will always be set to `null` if any error occurred.
 * @property {string | null} error - the accompanying error message, if the request encountered an error
 */
export type AssessmentRecordDataOperationResponse = {
  success: boolean;
  data: AssessmentRecord | AssessmentRecord[] | null;
  error: string | null;
};

// This handler currently allows simple record-creation and record-retrieval with some applied filters.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AssessmentRecordDataOperationResponse>
) {
  try {
    switch (req.method) {
      case "GET":
        const validatedFilters = validateFilters(
          req.body as AssessmentRecordPermittedFilters
        );
        if (!validatedFilters) {
          return res
            .status(422)
            .json(createResponseObject(null, "Invalid filter parameters"));
        }

        const results = await retrieveAssessmentRecords(validatedFilters).catch(
          (error) => {
            console.log("Error when retrieving records: ", error);
            return null;
          }
        );
        return res
          .status(results ? 200 : 400)
          .json(
            createResponseObject(
              results,
              results === null ? "Bad Request" : null
            )
          );
      case "POST":
        const insertedRecord = await insertAssessmentRecord(
          req.body as AssessmentRecord
        ).catch((error) => {
          console.log("Error when inserting record: ", error);
          return null;
        });
        return res
          .status(insertedRecord ? 201 : 400)
          .json(
            createResponseObject(
              insertedRecord,
              insertedRecord === null ? "Bad Request" : null
            )
          );
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res
          .status(405)
          .json(createResponseObject(null, `Method ${req.method} Not Allowed`));
    }
  } catch (error) {
    console.log("General ", error);
    return res
      .status(500)
      .json(createResponseObject(null, "Internal server error"));
  }
}

/**
 * Performs a data-retrieval based on supplied filter-parameters.
 * @param filters An object representing all query-filters to be applied; **this filter-object is assumed to be safe for usage**
 * @returns The queried data, if it exists
 */
async function retrieveAssessmentRecords(
  filters: AssessmentRecordPermittedFilters
): Promise<AssessmentRecord[]> {
  const queryParams: {
    userId?: { in: string[] };
    location?: { in: string[] };
    attemptDate?: { gte: Date; lte: Date };
  } = {};
  if (filters.userId && filters.userId.length > 0) {
    queryParams["userId"] = { in: filters.userId };
  }
  if (filters.location && filters.location.length > 0) {
    queryParams["location"] = { in: filters.location };
  }

  const today = new Date();

  if (filters.attemptDateRange && filters.attemptDateRange.length === 2) {
    queryParams["attemptDate"] = {
      gte:
        filters.attemptDateRange[0] ??
        new Date(
          today.getFullYear(),
          today.getMonth() - HISTORICAL_RECORDS_MAX_MONTHS,
          today.getDate()
        ),
      lte: filters.attemptDateRange[1] ?? today,
    };
  }

  const retrievedRecords = await prisma.assessmentRecord.findMany({
    where: queryParams,
    // A default limit is applied to hard-cap the maximum number of records returned in 1 query;
    // This is to force a massive query to be broken down into multiple smaller queries from user-end.
    take: HISTORICAL_RECORDS_MAX_RECORDS,
  });
  return retrievedRecords;
}

async function insertAssessmentRecord(
  data: AssessmentRecord
): Promise<AssessmentRecord> {
  const insertedRecord = await prisma.assessmentRecord.create({ data });
  return insertedRecord;
}
