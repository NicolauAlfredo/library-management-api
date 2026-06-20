export function parseId(value: unknown): number {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid id");
  }

  return id;
}
