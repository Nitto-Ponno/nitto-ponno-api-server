import { SortOrder } from "mongoose";
import { ILProduct } from "./luandryProduct.interface";
import { Product } from "./luandryProduct.model";
import slugify from "slugify";

type TProductQuery = {
  page: number;
  limit: number;
  search?: string;
  serviceId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy: "name" | "price" | "createdAt";
  sortOrder: SortOrder;
};

const createProductToDB = async (data: ILProduct) => {
  const slug = slugify(data.name);
  const result = await Product.create({ ...data, slug });
  return result;
};

const getAllProductsFromDB = async (query: TProductQuery) => {
  const {
    page,
    limit,
    search,
    serviceId,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  } = query;

  const filter: any = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (serviceId) {
    filter.services = serviceId;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }

  const skip = (page - 1) * limit;
  const total = await Product.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  const products = await Product.find(filter)
    .populate("services", "name")
    .populate("attributes", "name options")
    .populate("variations.serviceId", "name")
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .select("-__v");

  return {
    meta: { page, limit, total, totalPages },
    data: products,
  };
};

const getSingleProductFromDB = async (id: string) => {
  const result = await Product.findById(id)
    .populate("services", "name")
    .populate("attributes", "name options")
    .populate("variations.serviceId", "name")
    .select("-__v");

  if (!result) throw new Error("Product not found");
  return result;
};

const getSingleProductBySlugFromDB = async (slug: string) => {
  const result = await Product.findOne({ slug })
    .populate("services", "name")
    .populate("attributes", "name options")
    .populate("variations.serviceId", "name")
    .select("-__v");

  if (!result) throw new Error("Product not found");
  return result;
};

const updateProductToDB = async (id: string, data: Partial<ILProduct>) => {
  const result = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate(
      "services attributes variations.serviceId variations.attributeValues.attributeId"
    )
    .select("-__v");

  if (!result) throw new Error("Product not found");
  return result;
};

const deleteProductFromDB = async (id: string) => {
  const result = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  ).select("-__v");

  if (!result) throw new Error("Product not found");
  return result;
};

export const ProductServices = {
  createProductToDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  getSingleProductBySlugFromDB,
  updateProductToDB,
  deleteProductFromDB,
};
