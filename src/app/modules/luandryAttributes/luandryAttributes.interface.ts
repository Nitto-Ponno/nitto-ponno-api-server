export interface ILAttribute {
  name: string;
  description: string;
  slug: string;
  options: {
    value: string;
    id: string;
  }[];
}
