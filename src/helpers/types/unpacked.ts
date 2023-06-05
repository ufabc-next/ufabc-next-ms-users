/**
 * Extracts the element type from an array or returns the same type if not an array.
 *
 * @template T - The type to extract the element from.
 * @example
 * type Arr = string[];
 * type UnpackedArr = Unpacked<Arr>; // UnpackedArr will be 'string'
 */
export type Unpacked<T> = T extends (infer U)[] ? U : T;
