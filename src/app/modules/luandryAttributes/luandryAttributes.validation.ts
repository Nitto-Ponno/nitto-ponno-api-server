import { z } from "zod";

// Option schema
const OptionSchema = z.object({
  value: z.string().min(1, "Option value is required").trim(),
});

// Main LaundryAttribute schema
export const CreateLaundryAttributeSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .trim(),

  description: z.string().trim().optional(),

  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase, alphanumeric, and hyphenated only"
    )
    .min(3, "Slug too short")
    .max(50, "Slug too long")
    .transform((val) => val.toLowerCase()),

  options: z
    .array(OptionSchema)
    .min(1, "At least one option is required")
    .max(20, "Too many options (max 20)")
    .refine(
      (options) => {
        const values = options.map((o) => o.value);
        return new Set(values).size === values.length;
      },
      { message: "Option IDs and values must be unique" }
    ),
});

const UpdateLaundryAttributeSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .trim()
    .optional(),

  description: z.string().trim().optional(),

  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase, alphanumeric, and hyphenated only"
    )
    .min(3, "Slug too short")
    .max(50, "Slug too long")
    .transform((val) => val.toLowerCase())
    .optional(),

  options: z
    .array(OptionSchema)
    .min(1, "At least one option is required")
    .max(20, "Too many options (max 20)")
    .refine(
      (options) => {
        const values = options.map((o) => o.value);
        return new Set(values).size === values.length;
      },
      { message: "Option IDs and values must be unique" }
    )
    .optional(),
});

export const LaundryAttributeValidations = {
  CreateLaundryAttributeSchema,
  UpdateLaundryAttributeSchema,
};
