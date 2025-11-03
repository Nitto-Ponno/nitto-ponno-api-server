export interface ILaundryService {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  warnings?: string;
  isActive: boolean;
  displayOrder: number;
  shortDescription?: string;
}
