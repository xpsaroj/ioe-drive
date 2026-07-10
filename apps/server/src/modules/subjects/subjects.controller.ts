import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";

import { ApiResponse } from "../../common/dto/api-response";
import { buildPaginationMeta, getPaginationOffset } from "../../common/utils/pagination";
import { GetSubjectsForUploadQueryDto } from "./dto/get-subjects-for-upload-query.dto";
import { GetSubjectsQueryDto } from "./dto/get-subjects-query.dto";
import { SearchSubjectsQueryDto } from "./dto/search-subjects-query.dto";
import { SubjectsService } from "./subjects.service";

@Controller("subjects")
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  /** GET /api/subjects?programId=&semester= - subjects offered for a program/semester. */
  @Get()
  findByProgramAndSemester(@Query() query: GetSubjectsQueryDto) {
    return this.subjectsService.findByProgramAndSemester(query.programId, query.semester);
  }

  /** GET /api/subjects/upload?programId=&semester= - subjects list for the upload form.
   * Must stay registered before `:subjectId` below so "upload" isn't swallowed as a param. */
  @Get("upload")
  findForUpload(@Query() query: GetSubjectsForUploadQueryDto) {
    return this.subjectsService.findForUpload(query.programId, query.semester);
  }

  /** GET /api/subjects/search?q=&page=&limit= - subject offerings whose subject's name
   * or code matches the query, paginated. Must stay registered before `:subjectId`
   * below so "search" isn't swallowed as a param. */
  @Get("search")
  async search(@Query() query: SearchSubjectsQueryDto) {
    const offset = getPaginationOffset(query.page, query.limit);
    const { items, total } = await this.subjectsService.searchSubjects(query.q, {
      limit: query.limit,
      offset,
    });

    return ApiResponse.of(items, undefined, buildPaginationMeta(query.page, query.limit, total));
  }

  /** GET /api/subjects/:subjectId - a subject offering's full detail. */
  @Get(":subjectId")
  findById(@Param("subjectId", ParseIntPipe) subjectId: number) {
    return this.subjectsService.findById(subjectId);
  }
}
