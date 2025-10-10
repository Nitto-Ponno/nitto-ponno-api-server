import { z } from "zod";

const NameValidationSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional().nullable(),
  lastName: z.string().min(1, { message: "Last name is required" }),
});

// Zod schema for TAddress
const AddressValidationSchema = z.object({
  street: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
});

const createUserValidationSchema = z.object({
  password: z
    .string({
      error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters"),
  role: z
    .string({
      error: "User role is required",
    })
    .min(1, "Role cannot be empty string"),
  address: AddressValidationSchema.optional(),
  email: z.email({ error: "Email is required" }),
  name: NameValidationSchema,
  phoneNumber: z.string().optional(),
});

export const UserValidations = {
  createUserValidationSchema,
};
