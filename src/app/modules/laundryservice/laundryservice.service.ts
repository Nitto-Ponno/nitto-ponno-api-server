import { ILaundryService } from "./laundryservice.interface";
import { LaundryService } from "./laundryservice.model";

const createLaundryServiceToDB = async (data: ILaundryService) => {
  const result = await LaundryService.create(data);

  return result;
};

export const LaundryServiceServices = {
  createLaundryServiceToDB,
};
