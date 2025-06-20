/**
 * A generic interface that wraps any item along with its validation state.
 *
 * Useful for tracking the validity of dynamic form elements such as paragraphs,
 * challenges, achievements, or any other project-related inputs.
 *
 * @template T The type of the item being validated e.g Paragraph, Achievement etc.
 */
export interface ValidatedItem<T> {
  item: T;
  isValidated: boolean;
}
