import { Star, ThumbsUp } from "lucide-react";

interface ReviewsSectionProps {
  rating: number;
  reviewCount: number;
}

const ReviewsSection = ({ rating, reviewCount }: ReviewsSectionProps) => {
  // Mock review data
  const reviews = [
    {
      id: 1,
      name: "Sarah M.",
      country: "UK",
      date: "2 weeks ago",
      rating: 5,
      title: "Unforgettable evening on the water!",
      content: "The cruise exceeded all our expectations. The views were stunning, the food was delicious, and the staff were incredibly attentive. The Tanura dance was a highlight!",
      helpful: 24,
      avatar: "S",
    },
    {
      id: 2,
      name: "Ahmed K.",
      country: "UAE",
      date: "1 month ago",
      rating: 5,
      title: "Perfect for special occasions",
      content: "We celebrated our anniversary on this cruise and it was magical. The sunset views combined with the city lights were breathtaking. Highly recommend!",
      helpful: 18,
      avatar: "A",
    },
    {
      id: 3,
      name: "John D.",
      country: "USA",
      date: "1 month ago",
      rating: 4,
      title: "Great experience overall",
      content: "Beautiful views and good food. The only minor issue was it got a bit crowded at dinner time, but still a wonderful experience.",
      helpful: 12,
      avatar: "J",
    },
  ];

  // Rating distribution
  const ratingDistribution = [
    { stars: 5, percentage: 78 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 },
  ];

  return (
    <div className="bg-card rounded-xl p-6 shadow-md">
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">
        Customer Reviews
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Overall Rating */}
        <div className="text-center md:border-r border-border pr-8">
          <div className="text-5xl font-bold text-foreground mb-2">{rating}</div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(rating)
                    ? "fill-secondary text-secondary"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            Based on {reviewCount.toLocaleString()} reviews
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="md:col-span-2 space-y-2">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <span className="text-sm font-medium w-8">{item.stars} ★</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-12">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-t border-border pt-6 first:border-t-0 first:pt-0"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-semibold text-secondary">{review.avatar}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="font-semibold text-foreground">{review.name}</span>
                    <span className="text-muted-foreground text-sm ml-2">• {review.country}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-secondary text-secondary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>

                <h4 className="font-semibold text-foreground mb-1">{review.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {review.content}
                </p>

                {/* Helpful */}
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More */}
      <button className="w-full mt-6 py-3 text-center text-secondary font-semibold hover:underline">
        View all {reviewCount.toLocaleString()} reviews
      </button>
    </div>
  );
};

export default ReviewsSection;
