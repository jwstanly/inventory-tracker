import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda/trigger/api-gateway-proxy';
import Ajv from 'ajv';

import { HttpMethod } from 'lib/enums';
import { ServiceParams } from 'lib/types';
import ApiException from './ApiException';
import getErrorRes from './getErrorRes';
import getSuccessRes from './getSuccessRes';
import logEvent from './logEvent';
import logInput from './logInput';
import validateHttpMethod from './validateHttpMethod';
import schema from '../types.schema.json';
import validateSchema from './validateSchema';

interface HandlerOptions {
  queryParamType?: string;
  bodyParamType?: string;
  httpMethod: HttpMethod;
  service: (arg: ServiceParams<any, any>) => Promise<any> | any;
}

const ajv = new Ajv();

export default function createHandler({
  queryParamType,
  bodyParamType,
  httpMethod,
  service,
}: HandlerOptions): (
  event: APIGatewayProxyEvent
) => Promise<APIGatewayProxyResult> {
  const hasTypedQuery = queryParamType !== 'any';
  const hasTypedBody = bodyParamType !== 'any';

  const queryParamsValidator = hasTypedQuery
    ? ajv.compile(schema.definitions[queryParamType] || {})
    : null;

  const bodyParamsValidator = hasTypedBody
    ? ajv.compile(schema.definitions[bodyParamType] || {})
    : null;

  return async (event) => {
    try {
      logEvent(event);

      validateHttpMethod(event, httpMethod);

      const serviceParams: ServiceParams<any, any> = {};

      if (queryParamType) {
        const params = event.queryStringParameters;
        if (hasTypedQuery) {
          validateSchema(params, queryParamType, queryParamsValidator);
        }
        serviceParams.queryParams = params;
      }

      if (bodyParamType) {
        const params = JSON.parse(event.body);
        if (hasTypedBody) {
          validateSchema(params, bodyParamType, bodyParamsValidator);
        }
        serviceParams.body = params;
      }

      logInput(serviceParams);

      const res = await service(serviceParams);

      return getSuccessRes(event, res);
    } catch (error) {
      if (error instanceof ApiException) {
        return getErrorRes(event, error);
      } else {
        return getErrorRes(
          event,
          new ApiException({
            statusCode: 500,
            res: `An unknown error occurred. Error: ${error}`,
          })
        );
      }
    }
  };
}
