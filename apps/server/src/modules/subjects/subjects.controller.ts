import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";

import { GetSubjectsForUploadQueryDto } from "./dto/get-subjects-for-upload-query.dto";
import { GetSubjectsQueryDto } from "./dto/get-subjects-query.dto";
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

  /** GET /api/subjects/:subjectId - a subject offering's full detail. */
  @Get(":subjectId")
  findById(@Param("subjectId", ParseIntPipe) subjectId: number) {
    return this.subjectsService.findById(subjectId);
  }
}
