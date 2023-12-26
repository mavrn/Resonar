export class Filter {
  type: string;
  ratingRange: number[];
  yearRange: number[];
  inBookmarks: boolean;
  inRated: boolean;
  sorting: string;
  sortingOrder: number;

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
  toJSON() {
    return {
      type: this.type,
      ratingRange: this.ratingRange,
      yearRange: this.yearRange,
      inBookmarks: this.inBookmarks,
      inRated: this.inRated,
      sorting: this.sorting,
      sortingOrder: this.sortingOrder
    };
  }
}
