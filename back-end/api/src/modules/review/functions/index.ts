export function calculateRating(ratings: {
  ratingGuide: number;
  ratingTransportation: number;
  ratingValueOfMoney: number;
  ratingSafety: number;
}): number {
  return (
    ratings.ratingGuide +
    ratings.ratingSafety +
    ratings.ratingTransportation +
    ratings.ratingValueOfMoney
  ) / 4;
}