class Filter {
  startDate: Date;
  endDate: Date;
  genre: string;
  minRating: number;
  maxRating: number;

  constructor(
    startDate: Date,
    endDate: Date,
    genre: string,
    minRating: number,
    maxRating: number
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.genre = genre;
    this.minRating = minRating;
    this.maxRating = maxRating;
  }
}

export default Filter;
