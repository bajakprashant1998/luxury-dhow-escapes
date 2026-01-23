import { MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";
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

// Sample tour data for dashboard
const popularTours = [
  {
    id: "1",
    name: "Dhow Cruise Marina",
    image: "/src/assets/tours/dhow-cruise-marina.jpg",
    price: 149,
    sold: 156,
    change: 12.5,
    positive: true,
  },
  {
    id: "2",
    name: "Private Yacht 55ft",
    image: "/src/assets/tours/private-yacht-55ft.jpg",
    price: 1299,
    sold: 48,
    change: 8.2,
    positive: true,
  },
  {
    id: "3",
    name: "Megayacht Burj Khalifa",
    image: "/src/assets/tours/megayacht-burj-khalifa.jpg",
    price: 349,
    sold: 89,
    change: -3.1,
    positive: false,
  },
  {
    id: "4",
    name: "Yacht Sunset Tour",
    image: "/src/assets/tours/yacht-sunset-tour.jpg",
    price: 199,
    sold: 234,
    change: 24.8,
    positive: true,
  },
  {
    id: "5",
    name: "Catamaran Burj Al Arab",
    image: "/src/assets/tours/catamaran-burj-al-arab.jpg",
    price: 279,
    sold: 67,
    change: 5.4,
    positive: true,
  },
];

const ToursTable = () => {
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
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Tour</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Sold</TableHead>
            <TableHead>Change</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {popularTours.map((tour) => (
            <TableRow key={tour.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <span className="font-medium">{tour.name}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                AED {tour.price.toLocaleString()}
              </TableCell>
              <TableCell>{tour.sold}</TableCell>
              <TableCell>
                <div
                  className={`flex items-center gap-1 ${
                    tour.positive ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {tour.positive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {tour.positive ? "+" : ""}
                    {tour.change}%
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
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Tour</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ToursTable;
