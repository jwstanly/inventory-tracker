import { InventoryItem } from './types';
const URL = 'https://nq3igass5e.execute-api.us-east-1.amazonaws.com/Prod';

export async function getInventory(): Promise<InventoryItem[]> {
  return (await fetch(`${URL}/get`)) as unknown as InventoryItem[];
}

export async function postInventory(item: InventoryItem) {
  return await fetch(`${URL}/get`, {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export async function deleteInventory(item: InventoryItem, comment?: string) {
  return await fetch(
    `${URL}/delete?city=${item.city}&title=${item.title}&comment=${comment}`,
    {
      method: 'DELETE',
    }
  );
}

export async function undeleteInventory(item: InventoryItem) {
  return await fetch(`${URL}/delete?city=${item.city}&title=${item.title}`, {
    method: 'POST',
  });
}
