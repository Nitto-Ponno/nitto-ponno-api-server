import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { adminService } from "./admin.service";
import httpStatus from "http-status";

const toggleRider = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { isRider } = req.body;

  const result = await adminService.toggleRiderToDB(id, isRider);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: isRider
      ? "User role updated to rider"
      : "User role updated to customer",
    data: result,
  });
});
const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const result = await adminService.updateUserToDB(user.id, id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User data updated successfully",
    data: result,
  });
});

const getAllRiders = catchAsync(async (req, res) => {
  const result = await adminService.getRidersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Retrived all riders",
    data: result.result,
    pagination: result.pagination,
  });
});

export const adminController = { toggleRider, getAllRiders, updateUser };
