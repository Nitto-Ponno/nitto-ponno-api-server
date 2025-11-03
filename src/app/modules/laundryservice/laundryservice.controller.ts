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

export const LaundryServiceController = {
  createLaundryService,
};
