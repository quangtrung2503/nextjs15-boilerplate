export const processTourList = (tourList) => {
  return tourList.map(tour => {
    const reviewList = tour.Review || [];
    const totalTourRating = reviewList.reduce((sum, review) => sum + review.rating, 0);
    const tourAverageRating = reviewList.length > 0 ? totalTourRating / reviewList.length : 0;

    delete tour.Review;

    const { _count, ...tourWithoutReview } = tour;
    return {
      ...tourWithoutReview,
      averageRating: Number(tourAverageRating.toFixed(1)),
      totalReviews: _count?.Review
    };
  });
};