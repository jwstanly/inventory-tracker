import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import type { ServiceParams } from 'lib/types';
import createHandler from 'lib/createHandler';
import { HttpMethod } from 'lib/enums';

const { INVENTORY_TABLE } = process.env;
const docClient = new DocumentClient();

export const handler = createHandler({
  bodyParamType: 'any',
  httpMethod: HttpMethod.GET,
  service,
});

export async function service({}: ServiceParams<null, null>) {
  const res = await docClient
    .scan({
      TableName: INVENTORY_TABLE,
    })
    .promise();

  return res.Items;
}
