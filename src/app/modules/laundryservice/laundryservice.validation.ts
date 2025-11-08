import { z } from "zod";

const CreateLaundryServiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  icon: z.string().optional(),
  description: z.string().optional(),
  warnings: z.string().optional(),
  isActive: z.boolean(),
  displayOrder: z.number().int("Display order must be an integer").optional(),
  shortDescription: z.string().optional(),
});

const UpdateLaundryServiceSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
  warnings: z.string().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int("Display order must be an integer").optional(),
  shortDescription: z.string().optional(),
});

export const LaundryServiceValidation = {
  CreateLaundryServiceSchema,
  UpdateLaundryServiceSchema,
};
