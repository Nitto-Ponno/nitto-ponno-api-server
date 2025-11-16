import AppError from "../../errors/AppError";
import { ILaundryService } from "./laundryservice.interface";
import { LaundryService } from "./laundryservice.model";
import httpStatus from "http-status";

const createLaundryServiceToDB = async (data: ILaundryService) => {
  const result = await LaundryService.create(data);

  return result;
};

const UpdateLaundryServiceToDB = async (id: string, data: ILaundryService) => {
  if (!id) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Id is required to udpate a service"
    );
  }

  const {
    name,
    isActive,
    displayOrder,
    description,
    icon,
    shortDescription,
    warnings,
  } = data;

  const result = await LaundryService.findByIdAndUpdate(
    id,
    {
      name,
      isActive,
      displayOrder,
      description,
      icon,
      shortDescription,
      warnings,
    },
    { new: true }
  );

  return result;
};

const getAllLaundryServiceFromDB = async (query: Record<string, any>) => {
  const {
    search,
    page = 1,
    limit = 10,
    sortBy = "displayOrder",
    sortOrder = "asc",
    isActive,
    displayOrder,
  } = query;

  // Convert to numbers
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit))); // Max 100 per page
  const skip = (pageNum - 1) * limitNum;

  // Build filter object
  const filter: any = {};

  // Text search with regex (case-insensitive)
  if (search) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [
      { name: regex },
      { description: regex },
      { shortDescription: regex },
      { slug: regex },
    ];
  }

  // Boolean filter
  if (isActive !== undefined) {
    filter.isActive = isActive === "true" || isActive === true;
  }

  // Number range filter (example: displayOrder)
  if (displayOrder !== undefined) {
    const order = Number(displayOrder);
    if (!isNaN(order)) {
      filter.displayOrder = order;
    }
  }

  // Build sort object
  const sort: any = {};
  const validSortFields = ["name", "displayOrder", "createdAt", "updatedAt"];
  const field = validSortFields.includes(sortBy) ? sortBy : "displayOrder";
  sort[field] = sortOrder === "desc" ? -1 : 1;

  try {
    // Get total count for pagination metadata
    const total = await LaundryService.countDocuments(filter);

    // Fetch data with pagination & sorting
    const laundryServices = await LaundryService.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .select("-__v") // Exclude version key
      .lean(); // Return plain JS objects for performance

    return {
      pagination: {
        currentPage: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
      data: laundryServices,
    };
  } catch (error: any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to fetch laundry services"
    );
  }
};

export const LaundryServiceServices = {
  createLaundryServiceToDB,
  UpdateLaundryServiceToDB,
  getAllLaundryServiceFromDB,
};
