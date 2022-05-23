import Ajv from 'ajv';
import schema from '../types.schema.json';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import ApiException from '../lib/ApiException';
import createHandler from '../lib/createHandler';
import type { InventoryItem, ServiceParams } from 'lib/types';
import validateSchema from '../lib/validateSchema';
import { HttpMethod } from 'lib/enums';

const { INVENTORY_TABLE } = process.env;
const docClient = new DocumentClient();

const ajv = new Ajv();

const SchemaValidator = ajv.compile(schema.definitions['InventoryItem']);

export const handler = createHandler({
  httpMethod: HttpMethod.POST,
  queryParamType: 'any',
  bodyParamType: 'InventoryItem',
  service,
});

export async function service({
  queryParams,
  body,
}: ServiceParams<any, InventoryItem>) {
  validateSchema(body, 'TeamSubmit', SchemaValidator);

  const dynamoParams: DocumentClient.PutItemInput = {
    TableName: INVENTORY_TABLE,
    Item: body,
    ReturnValues: 'NONE',
  };

  await docClient.put(dynamoParams).promise();

  return dynamoParams.Item;
}
