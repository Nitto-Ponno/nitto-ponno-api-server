import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { LAttributeService } from "./luandryAttributes.service";
import httpStatus from "http-status";

const createLaundryAttribute = catchAsync(async (req, res) => {
  const result = await LAttributeService.createLaundryAttributeToDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully created laundry attribute",
    data: result,
  });
});

const updateLaundryAttribute = catchAsync(async (req, res) => {
  const result = await LAttributeService.updateLaundryAttributeToDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully updated laundry attribute",
    data: result,
  });
});

const getLaundryAttributeById = catchAsync(async (req, res) => {
  const result = await LAttributeService.getLaundryAttributeByIdFromDB(
    req.params.id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully retrived laundry attribute",
    data: result,
  });
});

const deleteLaundryAttribute = catchAsync(async (req, res) => {
  const result = await LAttributeService.deleteLaundryAttributeFromDB(
    req.params.id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully deleted laundry attribute",
    data: result,
  });
});

const getAllLaundryAttributesFromDB = catchAsync(async (req, res) => {
  const result = await LAttributeService.getAllLaundryAttributesFromDB(
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully deleted laundry attribute",
    data: result?.data,
    pagination: result.pagination,
  });
});

export const LAttributeController = {
  createLaundryAttribute,
  updateLaundryAttribute,
  getLaundryAttributeById,
  deleteLaundryAttribute,
  getAllLaundryAttributesFromDB,
};
