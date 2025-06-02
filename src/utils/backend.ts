import { AssessmentRecord } from "@/../generated/prisma";
import { AssessmentRecordDataOperationResponse } from "@/pages/api/record";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function logApiRequest(method: string, path: string, data?: any) {
  console.log(`[${new Date().toISOString()}] ${method} ${path} ${data}`);
}

export function createResponseObject(
  data: AssessmentRecord | AssessmentRecord[] | null,
  error: string | null
) {
  return {
    success: error === null,
    data: error ? null : data,
    error,
  } as AssessmentRecordDataOperationResponse;
}
