import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { LaundryServiceServices } from "./laundryservice.service";
import httpStatus from "http-status";

const createLaundryService = catchAsync(async (req, res) => {
  console.log("came to controller");

  const result = await LaundryServiceServices.createLaundryServiceToDB(
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully created laundry service",
    data: result,
  });
});

const updateLaundryService = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await LaundryServiceServices.UpdateLaundryServiceToDB(
    id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully updated laundry service",
    data: result,
  });
});

const getAllLaundryService = catchAsync(async (req, res) => {
  const result = await LaundryServiceServices.getAllLaundryServiceFromDB(
    req.query
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully retrived laundry services",
    data: result?.data,
    pagination: result.pagination,
  });
});

export const LaundryServiceController = {
  createLaundryService,
  updateLaundryService,
  getAllLaundryService,
};
