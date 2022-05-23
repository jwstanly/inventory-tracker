import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import ApiException from '../lib/ApiException';
import createHandler from '../lib/createHandler';
import type { InventoryItemId, ServiceParams } from 'lib/types';
import { HttpMethod } from 'lib/enums';
import { InventoryItem } from '../../lib/types';

const { INVENTORY_TABLE } = process.env;
const docClient = new DocumentClient();

export const handler = createHandler({
  httpMethod: HttpMethod.DELETE,
  queryParamType: 'InventoryItemId',
  service,
});

export async function service({
  queryParams,
}: ServiceParams<InventoryItemId, null>) {
  const item = (await docClient
    .get({
      TableName: INVENTORY_TABLE,
      Key: {
        city: queryParams.city,
        title: queryParams.title,
      },
    })
    .promise()) as unknown as InventoryItem | null;

  if (!item) {
    throw new ApiException({
      statusCode: 404,
      res: 'No item found to undelete',
    });
  }

  item.deleted = false;
  delete item.deletionComment;

  return await docClient
    .put({
      TableName: INVENTORY_TABLE,
      Item: item,
      ReturnValues: 'NONE',
    })
    .promise();
}
