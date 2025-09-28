import { Model } from "mongoose";

export interface TCrud {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export enum EAppFeatures {
  role = "role",
  user = "user",
}

export interface TPermission {
  feature: EAppFeatures;
  access: TCrud;
}

export interface TRole {
  role: string;
  description?: string;
  permissions: TPermission[];
  isDeleted?: boolean;
}

export interface TRoleModel extends Model<TRole> {
  isRoleExist(id: string): Promise<TRole>;
}
