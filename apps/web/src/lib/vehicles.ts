export type Vehicle = {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number | null;
  owner_name: string | null;
  owner_phone: string | null;
  created_at: string;
  created_by: string | null;
};

export function normalizePlate(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}
