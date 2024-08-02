export interface InventoryData {
  id: string;
  label: string;
  value: number;
  oldValue?: number;
  variance: number;
  children: {
    id: string;
    label: string;
    value: number;
    oldValue?: number;
    variance: number;
    children?: any;
  }[];
}
