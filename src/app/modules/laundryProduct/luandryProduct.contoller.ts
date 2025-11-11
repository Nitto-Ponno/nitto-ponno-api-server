import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ProductServices } from "./luandryProduct.service";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.createProductToDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Product created successfully",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as any;
  const result = await ProductServices.getAllProductsFromDB(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Products retrieved successfully",
    pagination: {
      currentPage: result.meta.page,
      limit: result.meta.limit,
      total: result.meta.total,
    },
    data: result.data,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductServices.getSingleProductFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product retrieved successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductServices.updateProductToDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product updated successfully",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductServices.deleteProductFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product deleted successfully",
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
