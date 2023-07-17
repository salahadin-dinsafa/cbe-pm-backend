import { BadRequestException, HttpException } from "@nestjs/common/exceptions";
import { ExceptionFilter, ArgumentsHost } from "@nestjs/common/interfaces";
import { Catch } from "@nestjs/common/decorators/core/catch.decorator";
import { HttpStatus } from "@nestjs/common/enums";
import { Request, Response } from "express";

import {
  CustomeHttpExceptionResponse,
  HttpExceptionResponse
} from "../types/http-exception-response.interface";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let errorMessage: string;

    if (exception instanceof HttpException) {
      if (exception instanceof BadRequestException) {
        status = 422;
        const errorResponse = exception.getResponse();
        errorMessage = (errorResponse as HttpExceptionResponse).message;
      } else {
        status = exception.getStatus();
        const errorResponse = exception.getResponse();
        errorMessage = exception.message || (errorResponse as HttpExceptionResponse).error;
      }

    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = 'Critical internal server error occured!';
    }

    const errorResponse = this._getErrorResponse(status,errorMessage,request);

    response.status(status).json(errorResponse);
  }

  _getErrorResponse =
    (status: HttpStatus, errorMessage: string, request: Request):
      CustomeHttpExceptionResponse => ({
        statusCode: status,
        error: errorMessage,
        path: request.url,
        method: request.method,
        timeStamp: new Date().toUTCString()
      })



}

