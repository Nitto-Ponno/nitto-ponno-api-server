import AppError from "../../errors/AppError";
import httpstatus from "http-status";
import { User } from "../user/user.model";
import { TUser } from "../user/user.interface";

const toggleRiderToDB = async (id: string, isRider: boolean) => {
  if (!id) {
    throw new AppError(httpstatus.CONFLICT, "User id is required");
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError(httpstatus.NOT_FOUND, "User not found");
  }

  const result = await User.findByIdAndUpdate(id, {
    role: isRider ? "rider" : "customer",
    userType: isRider ? "rider" : "customer",
  });

  return result;
};

const getRidersFromDB = async (query: { page?: number; limit?: number }) => {
  const { page, limit } = query;
  const numPage = page ? Number(page) : 1;
  const numLimit = limit ? Number(limit) : 10;

  const skip = (numPage - 1) * 0;

  const result = await User.find({ userType: "rider" })
    .skip(skip)
    .limit(numLimit)
    .select("-otp -password -userType -role");

  const total = await User.countDocuments({ userType: "rider" });

  const pagination = {
    currentPage: numPage,
    limit: numLimit,
    total,
  };

  return { result, pagination };
};

const updateUserToDB = async (
  userId: TUser["_id"],
  id: string,
  data: { isActive?: boolean; isDeleted?: boolean }
) => {
  if (!id) {
    throw new AppError(httpstatus.CONFLICT, "User id is required");
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError(httpstatus.NOT_FOUND, "User not found");
  }

  if (user._id === userId) {
    throw new AppError(
      httpstatus.FORBIDDEN,
      "You can't update your won account"
    );
  }

  const isActive = data.isActive;
  const isDeleted = data.isDeleted;

  const result = await User.findByIdAndUpdate(id, {
    isActive: isActive !== undefined ? isActive : user.isActive,
    isDeleted: isDeleted !== undefined ? isDeleted : user.isDeleted,
  });

  return result;
};

export const adminService = {
  toggleRiderToDB,
  getRidersFromDB,
  updateUserToDB,
};
