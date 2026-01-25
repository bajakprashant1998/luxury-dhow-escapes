import { MoreHorizontal, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";

interface TourWithStats {
  id: string;
  title: string;
  image_url: string | null;
  price: number;
  slug: string;
  bookingCount: number;
  changePercent: number;
  isPositive: boolean;
}

const ToursTable = () => {
  const navigate = useNavigate();

  const { data: popularTours, isLoading } = useQuery({
    queryKey: ["admin-popular-tours"],
    queryFn: async (): Promise<TourWithStats[]> => {
      // Fetch tours with their booking counts
      const { data: tours, error: toursError } = await supabase
        .from("tours")
        .select("id, title, image_url, price, slug")
        .eq("status", "active")
        .limit(10);

      if (toursError) throw toursError;

      // Fetch booking counts for each tour (this month vs last month for change %)
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

      const toursWithStats = await Promise.all(
        (tours || []).map(async (tour) => {
          // This month bookings
          const { count: thisMonthCount } = await supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("tour_id", tour.id)
            .gte("created_at", thisMonthStart);

          // Last month bookings
          const { count: lastMonthCount } = await supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("tour_id", tour.id)
            .gte("created_at", lastMonthStart)
            .lte("created_at", lastMonthEnd);

          const thisMonth = thisMonthCount || 0;
          const lastMonth = lastMonthCount || 0;

          let changePercent = 0;
          if (lastMonth > 0) {
            changePercent = ((thisMonth - lastMonth) / lastMonth) * 100;
          } else if (thisMonth > 0) {
            changePercent = 100;
          }

          return {
            id: tour.id,
            title: tour.title,
            image_url: tour.image_url,
            price: tour.price,
            slug: tour.slug,
            bookingCount: thisMonth,
            changePercent: Math.round(changePercent * 10) / 10,
            isPositive: changePercent >= 0,
          };
        })
      );

      // Sort by booking count descending and take top 5
      return toursWithStats
        .sort((a, b) => b.bookingCount - a.bookingCount)
        .slice(0, 5);
    },
  });

  const handleViewDetails = (slug: string) => {
    window.open(`/tours/${slug}`, "_blank");
  };

  const handleEditTour = (id: string) => {
    navigate(`/admin/tours/edit/${id}`);
  };

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              Popular Tours
            </h3>
            <p className="text-sm text-muted-foreground">
              Top performing tours this month
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/tours">View All</Link>
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Tour</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead>Change</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
              </TableCell>
            </TableRow>
          ) : popularTours && popularTours.length > 0 ? (
            popularTours.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={tour.image_url || "/placeholder.svg"}
                      alt={tour.title}
                      className="w-12 h-12 rounded-lg object-cover bg-muted"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                    <span className="font-medium">{tour.title}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  AED {tour.price.toLocaleString()}
                </TableCell>
                <TableCell>{tour.bookingCount}</TableCell>
                <TableCell>
                  <div
                    className={`flex items-center gap-1 ${
                      tour.isPositive ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {tour.isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {tour.isPositive ? "+" : ""}
                      {tour.changePercent}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(tour.slug)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditTour(tour.id)}>
                        Edit Tour
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No tours found. <Link to="/admin/tours/add" className="text-primary hover:underline">Create your first tour</Link>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ToursTable;
