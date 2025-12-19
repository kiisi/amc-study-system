import { Types } from "mongoose";

type Primitive =
  | string
  | number
  | boolean
  | null
  | undefined;

export type MongoSerializable<T> =
  T extends Primitive
    ? T
    : T extends Date
      ? Date
      : T extends Types.ObjectId
        ? string
        : T extends Buffer
          ? string
          : T extends Array<infer U>
            ? MongoSerializable<U>[]
            : T extends object
              ? { [K in keyof T]: MongoSerializable<T[K]> }
              : T;

const isObjectId = (value: unknown): value is Types.ObjectId =>
  value instanceof Types.ObjectId;

const isObjectIdBuffer = (value: unknown): value is Buffer =>
  Buffer.isBuffer(value) && value.length === 12;

export function serializeMongoIds<T>(data: T): MongoSerializable<T> {
  // ✅ Preserve Date exactly like res.json()
  if (data instanceof Date) {
    return data as MongoSerializable<T>;
  }

  // ✅ Convert ObjectId
  if (isObjectId(data) || isObjectIdBuffer(data)) {
    return data.toString() as MongoSerializable<T>;
  }

  // ✅ Handle arrays
  if (Array.isArray(data)) {
    return data.map(serializeMongoIds) as MongoSerializable<T>;
  }

  // ✅ Handle plain objects only
  if (data && typeof data === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      result[key] = serializeMongoIds(value);
    }

    return result as MongoSerializable<T>;
  }

  // ✅ Primitive values
  return data as MongoSerializable<T>;
}
