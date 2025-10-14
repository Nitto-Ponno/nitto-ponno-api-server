import { z } from "zod";

const createCategoryValidationSchema = z.object({
  name: z
    .string({
      error: "Category name is required",
    })
    .toLowerCase(),
  parent_id: z
    .string({
      error: "Parent categroy id should be a string",
    })
    .nullable()
    .optional(),
  product_details_categories: z.array(z.string(), {
    error: "Product details category is required",
  }),
  slug: z.string({ error: "Slug has to be a string" }).optional(),
  description: z.string({ error: "Description has to be a string" }).optional(),
  // .min(1, "A category should have at least one product details category"),
});

const updateCategoryValidationSchema = z.object({
  name: z
    .string({
      error: "Category name is required",
    })
    .toLowerCase(),
  product_details_categories: z.array(z.string(), {
    error: "Product details category is required",
  }),
  description: z.string({ error: "Description has to be a string" }).optional(),
});

export const CategoryValidations = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
