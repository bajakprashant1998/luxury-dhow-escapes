import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";

const AdminCustomers = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Customers
            </h1>
            <p className="text-muted-foreground">
              View and manage customer information
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            Customer Management
          </h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            View booking history, manage customer details, and track repeat customers.
          </p>
          <Button variant="outline">Coming Soon</Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
