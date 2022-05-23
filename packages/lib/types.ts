// CORE TYPES

export type City =
  | 'Atlanta'
  | 'Jacksonville'
  | 'New York City'
  | 'Las Angeles'
  | 'Chicago';

export interface InventoryItemId {
  city: City;
  title: string;
}

export interface InventoryItem extends InventoryItemId {
  description: string;
  deleted?: boolean;
  deletionComment?: string;
}

export interface Deletion extends InventoryItemId {
  comment: string;
}

// BACKEND TYPES

export interface ServiceParams<
  queryParamType extends object,
  bodyType extends object
> {
  queryParams?: queryParamType;
  body?: bodyType;
}

// UTIL TYPES

export type EnumDict<U, T = boolean> = { [key in keyof U]: T };

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];
