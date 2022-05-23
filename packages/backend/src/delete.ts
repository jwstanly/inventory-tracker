import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import ApiException from '../lib/ApiException';
import createHandler from '../lib/createHandler';
import type { Deletion, ServiceParams } from 'lib/types';
import { HttpMethod } from 'lib/enums';
import { InventoryItem } from '../../lib/types';

const { INVENTORY_TABLE } = process.env;
const docClient = new DocumentClient();

export const handler = createHandler({
  httpMethod: HttpMethod.DELETE,
  queryParamType: 'Deletion',
  service,
});

export async function service({ queryParams }: ServiceParams<Deletion, null>) {
  console.log('queryParams', queryParams);

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
      res: 'No item found to delete',
    });
  }

  item.deleted = true;
  item.deletionComment = queryParams.comment;

  return await docClient
    .put({
      TableName: INVENTORY_TABLE,
      Item: item,
      ReturnValues: 'NONE',
    })
    .promise();
}
