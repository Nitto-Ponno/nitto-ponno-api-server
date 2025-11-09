import { ILAttribute } from "./luandryAttributes.interface";
import { v4 as uuidv4 } from "uuid";
import { LaundryAttribute } from "./luandryAttributes.model";
import slugify from "slugify";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createLaundryAttributeToDB = async (data: ILAttribute) => {
  const { name, description, options, slug } = data;

  const optionsWithId: ILAttribute["options"] = options.map((op) => {
    return {
      value: op.value,
      id: uuidv4(),
    };
  });

  const result = await LaundryAttribute.create({
    name,
    description,
    options: optionsWithId,
    slug: slug || slugify(name),
  });

  return result;
};

const updateLaundryAttributeToDB = async (id: string, data: ILAttribute) => {
  const { name, description, options: incomingOptions, slug } = data;

  const existingAttribute = await LaundryAttribute.findById(id);
  if (!existingAttribute) {
    throw new Error("Laundry attribute not found");
  }

  const newOptions = incomingOptions.map((op) => {
    const exist = existingAttribute.options.find((o) => o.value === op.value);

    if (exist) {
      return exist;
    } else {
      return {
        value: op.value,
        id: uuidv4(),
      };
    }
  });

  const result = await LaundryAttribute.findByIdAndUpdate(
    id,
    {
      name,
      description,
      options: newOptions,
      slug: slug || name ? slugify(name, { lower: true }) : "",
    },
    { new: true }
  );

  return result;
};

const getLaundryAttributeByIdFromDB = async (id: string) => {
  if (!id) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Id is required to delete attribute"
    );
  }

  const attribute = await LaundryAttribute.findById(id).select("-__v");

  if (!attribute) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Attribute with id ${id} not found`
    );
  }

  return attribute;
};

// DELETE BY ID
const deleteLaundryAttributeFromDB = async (id: string) => {
  if (!id) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Id is required to delete attribute"
    );
  }

  const attribute = await LaundryAttribute.findById(id);

  if (!attribute) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Attribute with id ${id} not found`
    );
  }

  // Optional: Check if any product uses this attribute
  // const usedInProducts = await Product.exists({ 'attributes.attributeId': id });
  // if (usedInProducts) {
  //   return res.status(400).json({
  //     success: false,
  //     message: 'Cannot delete: Attribute is used in products',
  //   });
  // }

  const result = await LaundryAttribute.findByIdAndDelete(id);

  return result;
};

const getAllLaundryAttributesFromDB = async (params: Record<string, any>) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  // Validate pagination parameters
  const pageNumber = Math.max(1, Number(page));
  const limitNumber = Math.min(Math.max(1, Number(limit)), 100); // Max 100 items per page
  const skip = (pageNumber - 1) * limitNumber;

  // Build search filter
  const searchFilter: any = {};

  if (search && search.trim()) {
    searchFilter.$or = [
      { name: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } },
      { slug: { $regex: search.trim(), $options: "i" } },
      { "options.value": { $regex: search.trim(), $options: "i" } },
    ];
  }

  // Build sort object
  const sortObject: any = {};
  const allowedSortFields = ["name", "slug", "createdAt", "updatedAt"];

  if (allowedSortFields.includes(sortBy)) {
    sortObject[sortBy] = sortOrder === "asc" ? 1 : -1;
  } else {
    sortObject.createdAt = -1; // Default sort
  }

  // Execute query with pagination
  const [attributes, totalCount] = await Promise.all([
    LaundryAttribute.find(searchFilter)
      .sort(sortObject)
      .skip(skip)
      .limit(limitNumber)
      .lean()
      .exec(),
    LaundryAttribute.countDocuments(searchFilter),
  ]);

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNumber);
  const hasNextPage = pageNumber < totalPages;
  const hasPrevPage = pageNumber > 1;

  return {
    data: attributes,
    pagination: {
      currentPage: pageNumber,
      total: totalCount,
      limit,
      hasNextPage,
      hasPrevPage,
    },
  };
};

export const LAttributeService = {
  createLaundryAttributeToDB,
  updateLaundryAttributeToDB,
  deleteLaundryAttributeFromDB,
  getAllLaundryAttributesFromDB,
  getLaundryAttributeByIdFromDB,
};
