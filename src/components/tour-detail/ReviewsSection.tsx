import { useState } from "react";
import { Star, ThumbsUp, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useTourReviews,
  useAdminTourReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  useIsAdmin,
  Review,
} from "@/hooks/useReviews";
import { formatDistanceToNow } from "date-fns";

interface ReviewsSectionProps {
  rating: number;
  reviewCount: number;
  tourId?: string;
}

const ReviewsSection = ({ rating, reviewCount, tourId }: ReviewsSectionProps) => {
  const { data: isAdmin } = useIsAdmin();
  const { data: publicReviews, isLoading: publicLoading } = useTourReviews(tourId);
  const { data: adminReviews, isLoading: adminLoading } = useAdminTourReviews(tourId);
  
  const reviews = isAdmin ? adminReviews : publicReviews;
  const isLoading = isAdmin ? adminLoading : publicLoading;

  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    rating: 5,
    review_text: "",
    status: "approved",
  });

  const resetForm = () => {
    setFormData({
      customer_name: "",
      customer_email: "",
      rating: 5,
      review_text: "",
      status: "approved",
    });
  };

  const handleAddReview = async () => {
    if (!tourId) return;
    
    await createReview.mutateAsync({
      tour_id: tourId,
      customer_name: formData.customer_name,
      customer_email: formData.customer_email || undefined,
      rating: formData.rating,
      review_text: formData.review_text || undefined,
      status: formData.status,
    });
    
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditReview = async () => {
    if (!selectedReview) return;
    
    await updateReview.mutateAsync({
      id: selectedReview.id,
      customer_name: formData.customer_name,
      customer_email: formData.customer_email || null,
      rating: formData.rating,
      review_text: formData.review_text || null,
      status: formData.status,
    });
    
    setIsEditDialogOpen(false);
    setSelectedReview(null);
    resetForm();
  };

  const handleDeleteReview = async () => {
    if (!selectedReview || !tourId) return;
    
    await deleteReview.mutateAsync({ id: selectedReview.id, tourId });
    
    setIsDeleteDialogOpen(false);
    setSelectedReview(null);
  };

  const openEditDialog = (review: Review) => {
    setSelectedReview(review);
    setFormData({
      customer_name: review.customer_name,
      customer_email: review.customer_email || "",
      rating: review.rating,
      review_text: review.review_text || "",
      status: review.status || "pending",
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteDialogOpen(true);
  };

  // Calculate rating distribution from actual reviews
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews?.filter((r) => r.rating === stars).length || 0;
    const total = reviews?.length || 1;
    return {
      stars,
      percentage: Math.round((count / total) * 100) || 0,
    };
  });

  // Calculate actual average rating
  const actualRating = reviews?.length 
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : rating;

  const actualReviewCount = reviews?.length || reviewCount;

  return (
    <div className="bg-card rounded-xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Customer Reviews
        </h2>
        {isAdmin && (
          <Button onClick={() => setIsAddDialogOpen(true)} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Review
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Overall Rating */}
        <div className="text-center md:border-r border-border pr-8">
          <div className="text-5xl font-bold text-foreground mb-2">{actualRating}</div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(actualRating)
                    ? "fill-secondary text-secondary"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            Based on {actualReviewCount.toLocaleString()} reviews
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
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-t border-border pt-6 first:border-t-0 first:pt-0">
              <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-t border-border pt-6 first:border-t-0 first:pt-0"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-semibold text-secondary">
                    {review.customer_name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{review.customer_name}</span>
                      {isAdmin && review.status !== "approved" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600">
                          {review.status}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                      </span>
                      {isAdmin && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => openEditDialog(review)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => openDeleteDialog(review)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
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

                  {review.review_text && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      {review.review_text}
                    </p>
                  )}

                  {/* Helpful */}
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          No reviews yet. Be the first to share your experience!
        </p>
      )}

      {/* Show More - only if we have more reviews than displayed */}
      {reviews && reviews.length > 0 && actualReviewCount > reviews.length && (
        <button className="w-full mt-6 py-3 text-center text-secondary font-semibold hover:underline">
          View all {actualReviewCount.toLocaleString()} reviews
        </button>
      )}

      {/* Add Review Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Review</DialogTitle>
            <DialogDescription>
              Add a new customer review for this tour.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer_name">Customer Name *</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="John D."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer_email">Email (optional)</Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label>Rating *</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= formData.rating
                          ? "fill-secondary text-secondary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="review_text">Review Text</Label>
              <Textarea
                id="review_text"
                value={formData.review_text}
                onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                placeholder="Share the customer's experience..."
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddReview}
              disabled={!formData.customer_name || createReview.isPending}
            >
              {createReview.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Review Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>
              Update the review details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_customer_name">Customer Name *</Label>
              <Input
                id="edit_customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_customer_email">Email (optional)</Label>
              <Input
                id="edit_customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Rating *</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= formData.rating
                          ? "fill-secondary text-secondary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_review_text">Review Text</Label>
              <Textarea
                id="edit_review_text"
                value={formData.review_text}
                onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditReview}
              disabled={!formData.customer_name || updateReview.isPending}
            >
              {updateReview.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review from {selectedReview?.customer_name}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReview}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteReview.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReviewsSection;
