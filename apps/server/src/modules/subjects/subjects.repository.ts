import { Inject, Injectable } from "@nestjs/common";
import { asc } from "drizzle-orm";

import { DRIZZLE } from "../../database/database.constants";
import type { DrizzleDb } from "../../database/database.types";
import type { Semester } from "../../database/schema";

@Injectable()
export class SubjectsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  findByProgramAndSemester(programId: number, semester?: Semester) {
    return this.db.query.subjectOfferingsTable.findMany({
      where: (fields, { eq, and }) =>
        and(eq(fields.programId, programId), semester ? eq(fields.semester, semester) : undefined),
      columns: {
        id: true,
        subjectId: true,
        semester: true,
        programId: true,
        year: true,
      },
      with: {
        subject: {
          with: {
            program: true,
            marks: true,
          },
        },
        program: true,
      },
      orderBy: (fields) => asc(fields.semester),
    });
  }

  /** `subjectId` here is actually a subject *offering* id - this queries
   * subjectOfferingsTable, which is the entity the app actually browses/filters by. */
  findById(subjectId: number) {
    return this.db.query.subjectOfferingsTable.findFirst({
      where: (fields, { eq }) => eq(fields.id, subjectId),
      columns: {
        id: true,
        subjectId: true,
        semester: true,
        programId: true,
        year: true,
      },
      with: {
        subject: {
          with: {
            program: true,
            marks: true,
          },
        },
        program: true,
      },
    });
  }

  findForUpload(programId: number, semester: Semester) {
    return this.db.query.subjectOfferingsTable.findMany({
      where: (fields, { eq, and }) => and(eq(fields.programId, programId), eq(fields.semester, semester)),
      columns: {
        id: true,
        isElective: true,
      },
      with: {
        subject: {
          columns: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: (fields) => asc(fields.id),
    });
  }
}
