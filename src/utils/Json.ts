/** Static helpers for {@link JSON} */
export const Json = {
  /**
   * Stringifies an object with BigInts.
   *
   * @param obj - The object to stringify.
   * @returns The stringified object.
   */
  stringifyBigInt<T>(obj: T): string {
    return JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
  },
};
