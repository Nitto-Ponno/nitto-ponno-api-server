import { z } from "zod";

const DiscountSchema = z.object({
  type: z.enum(["percent", "flat"]),
  value: z.number().min(0),
});

const ProductVariationSchema = z.object({
  serviceId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid serviceId"),
  price: z.number().positive(),
  discount: DiscountSchema.optional(),
  sku: z.string().optional(),
  isAvailable: z.boolean().default(true),
});

export const CreateProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  discount: DiscountSchema,
  services: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).min(1),
  attributes: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).min(1),
  variations: z.array(ProductVariationSchema).min(1),
});

export const UpdateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  discount: DiscountSchema.optional(),
  services: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/))
    .min(1)
    .optional(),
  attributes: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/))
    .min(1)
    .optional(),
  variations: z.array(ProductVariationSchema).min(1).optional(),
});

export const ProductQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(),
  serviceId: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sortBy: z.enum(["name", "price", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
