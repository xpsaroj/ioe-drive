import { Inject, Injectable } from "@nestjs/common";
import { asc, count, ilike, inArray, or } from "drizzle-orm";

import { DRIZZLE } from "../../database/database.constants";
import type { DrizzleDb } from "../../database/database.types";
import { subjectOfferingsTable, subjectsTable, type Semester } from "../../database/schema";

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

  /** Drizzle's relational query API (`db.query.X.findMany`) can't filter by a joined
   * table's column, so this is a two-step query: find subjects whose name/code match,
   * then find the offerings for those subjects. Returns one row per matching
   * *offering* (a subject can be offered under more than one program), consistent
   * with how /offerings already lists offerings rather than deduplicated subjects.
   *
   * Only selects the lean `{id, code, name}`/`{id, code, name}` subject/program shape
   * (matching the existing `SubjectSummary`/`ProgramSummary` frontend types) - neither
   * search result consumer (the search dialog, the /search page) renders `marks`,
   * `description`, `syllabusUrl`, or `hardnessLevel`, so there's no reason to join and
   * ship them over the wire. */
  async searchByNameOrCode(q: string, pagination: { limit: number; offset: number }) {
    const matchingSubjects = await this.db
      .select({ id: subjectsTable.id })
      .from(subjectsTable)
      .where(or(ilike(subjectsTable.name, `%${q}%`), ilike(subjectsTable.code, `%${q}%`)));

    const subjectIds = matchingSubjects.map((s) => s.id);
    if (subjectIds.length === 0) {
      return { items: [], total: 0 };
    }

    const whereClause = inArray(subjectOfferingsTable.subjectId, subjectIds);

    const [items, totalResult] = await Promise.all([
      this.db.query.subjectOfferingsTable.findMany({
        where: whereClause,
        columns: {
          id: true,
          semester: true,
        },
        with: {
          subject: {
            columns: { id: true, code: true, name: true },
          },
          program: {
            columns: { id: true, code: true, name: true },
          },
        },
        orderBy: (fields) => asc(fields.id),
        limit: pagination.limit,
        offset: pagination.offset,
      }),
      this.db.select({ total: count() }).from(subjectOfferingsTable).where(whereClause),
    ]);

    return { items, total: totalResult[0]?.total ?? 0 };
  }
}
