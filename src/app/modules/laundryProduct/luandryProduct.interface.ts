import { Types } from "mongoose";

export interface IAttributeValue {
  attributeId: Types.ObjectId;
  value: string;
}

export interface IProductVariation {
  _id?: Types.ObjectId;
  serviceId: Types.ObjectId;
  attributeValues: IAttributeValue[];
  thumbnail?: string;
  price: number;
  discount?: {
    type: "percent" | "flat";
    value: number;
  };
  sku?: string;
  isAvailable: boolean;
}

export interface ILProduct {
  slug: string;
  name: string;
  description: string;
  price: number;
  discount: {
    type: "percent" | "flat";
    value: number;
  };
  services: [Types.ObjectId];
  attributes: [Types.ObjectId];
  variations: IProductVariation[];
}
