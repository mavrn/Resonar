/**
 * Class that can be applied to the index, serving as a universal Filter
 * @date 12/29/2023 - 3:30:50 AM
 *
 * @export
 * @class Filter
 * @typedef {Filter}
 */
export class Filter {
  type: string;
  ratingRange: number[];
  yearRange: number[];
  inBookmarks: boolean;
  inRated: boolean;
  sorting: string;
  sortingOrder: number;

  /**
   * Creates an instance of Filter.
   * @date 12/29/2023 - 3:32:05 AM
   *
   * @constructor
   * @param {string} type Type of element, should be 'all', 'albums', 'releases', 'singles', 'artists' or 'users'
   * @param {number[]} ratingRange Range of rating as a subrange of [0,10]
   * @param {number[]} yearRange Range of release date years as a subrange of [1950, 2023]
   * @param {boolean} inBookmarks Deprecated, always false
   * @param {boolean} inRated Only show Items that are inside a user's rated releases
   * @param {string} sorting Sorting order, default is relevance. Can be 'relevance', 'alphabetical', 'your rating', 'rating', 'release date'
   * @param {number} sortingOrder Ascending order: 1, Descending order: -1
   */
  constructor(
    type: string,
    ratingRange: number[],
    yearRange: number[],
    inBookmarks: boolean,
    inRated: boolean,
    sorting: string,
    sortingOrder: number
  ) {
    this.type = type;
    this.yearRange = yearRange;
    this.ratingRange = ratingRange;
    this.inBookmarks = inBookmarks;
    this.inRated = inRated;
    this.sorting = sorting;
    this.sortingOrder = sortingOrder;
  }
  /**
   * @returns JSON necessary for Pinia store
   */
  toJSON() {
    return {
      type: this.type,
      ratingRange: this.ratingRange,
      yearRange: this.yearRange,
      inBookmarks: this.inBookmarks,
      inRated: this.inRated,
      sorting: this.sorting,
      sortingOrder: this.sortingOrder,
    };
  }
}
