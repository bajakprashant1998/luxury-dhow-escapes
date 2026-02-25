import { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/admin/StatusBadge";
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
  ChevronLeft,
  ChevronRight,
  Users,
  DollarSign,
  GripVertical,
  CalendarClock,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Booking {
  id: string;
  tour_id: string;
  tour_name: string;
  booking_date: string;
  adults: number;
  children: number;
  infants: number;
  total_price: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  special_requests: string | null;
  status: string;
  created_at: string;
  booking_type: string | null;
}

interface BookingCalendarProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onBookingUpdated?: () => void;
}

const STATUS_DOT_COLORS: Record<string, string> = {
  pending: "bg-amber-500",
  confirmed: "bg-emerald-500",
  cancelled: "bg-rose-500",
};

export default function BookingCalendar({ bookings, onSelectBooking, onBookingUpdated }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [draggedBooking, setDraggedBooking] = useState<Booking | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const [rescheduleConfirm, setRescheduleConfirm] = useState<{
    booking: Booking;
    newDate: string;
  } | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of bookings) {
      const key = b.booking_date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(b);
    }
    return map;
  }, [bookings]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const selectedDateBookings = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, "yyyy-MM-dd");
    return bookingsByDate.get(key) || [];
  }, [selectedDate, bookingsByDate]);

  const monthBookings = useMemo(() => {
    return bookings.filter((b) => {
      const d = new Date(b.booking_date);
      return d >= monthStart && d <= monthEnd;
    });
  }, [bookings, monthStart, monthEnd]);

  const monthRevenue = monthBookings
    .filter((b) => b.status === "confirmed")
    .reduce((s, b) => s + Number(b.total_price), 0);

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent, booking: Booking) => {
    if (booking.status === "cancelled") {
      e.preventDefault();
      return;
    }
    setDraggedBooking(booking);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", booking.id);
    // Add a slight delay to allow the drag image to render
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = "0.5";
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = "1";
    setDraggedBooking(null);
    setDragOverDate(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, dateKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverDate(dateKey);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverDate(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, dateKey: string) => {
      e.preventDefault();
      setDragOverDate(null);

      if (!draggedBooking) return;

      // Don't reschedule to the same date
      if (draggedBooking.booking_date === dateKey) {
        setDraggedBooking(null);
        return;
      }

      // Show confirmation dialog
      setRescheduleConfirm({
        booking: draggedBooking,
        newDate: dateKey,
      });
      setDraggedBooking(null);
    },
    [draggedBooking]
  );

  const confirmReschedule = async () => {
    if (!rescheduleConfirm) return;

    setIsRescheduling(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ booking_date: rescheduleConfirm.newDate })
        .eq("id", rescheduleConfirm.booking.id);

      if (error) throw error;

      toast.success(
        `Rescheduled ${rescheduleConfirm.booking.customer_name}'s booking to ${format(
          new Date(rescheduleConfirm.newDate),
          "MMM d, yyyy"
        )}`
      );
      onBookingUpdated?.();
    } catch (error) {
      console.error("Reschedule error:", error);
      toast.error("Failed to reschedule booking");
    } finally {
      setIsRescheduling(false);
      setRescheduleConfirm(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Month header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {monthBookings.length} bookings · AED {monthRevenue.toLocaleString()} confirmed revenue
            {draggedBooking && (
              <span className="ml-2 text-primary font-medium animate-pulse">
                ← Drop on a date to reschedule
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setCurrentMonth(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Calendar grid */}
        <Card className="border-border overflow-hidden">
          <CardContent className="p-0">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-border bg-muted/30">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const key = format(day, "yyyy-MM-dd");
                const dayBookings = bookingsByDate.get(key) || [];
                const inMonth = isSameMonth(day, currentMonth);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const today = isToday(day);
                const isDragOver = dragOverDate === key;
                const isSameAsSource = draggedBooking?.booking_date === key;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    onDragOver={(e) => handleDragOver(e, key)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, key)}
                    className={cn(
                      "relative min-h-[72px] sm:min-h-[88px] p-1 sm:p-1.5 border-b border-r border-border text-left transition-all cursor-pointer hover:bg-muted/40 focus:outline-none",
                      !inMonth && "bg-muted/10",
                      isSelected && "bg-primary/5 ring-1 ring-primary/30 ring-inset",
                      isDragOver && !isSameAsSource && "bg-primary/10 ring-2 ring-primary/50 ring-inset scale-[1.02] shadow-lg",
                      isDragOver && isSameAsSource && "bg-muted/20",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium",
                        !inMonth && "text-muted-foreground/40",
                        inMonth && "text-foreground",
                        today && "bg-primary text-primary-foreground font-bold",
                        isSelected && !today && "bg-accent text-accent-foreground",
                      )}
                    >
                      {format(day, "d")}
                    </span>

                    {/* Booking chips - draggable */}
                    {dayBookings.length > 0 && (
                      <div className="mt-0.5 space-y-0.5">
                        {dayBookings.length <= 3 ? (
                          dayBookings.map((b) => (
                            <div
                              key={b.id}
                              draggable={b.status !== "cancelled"}
                              onDragStart={(e) => {
                                e.stopPropagation();
                                handleDragStart(e, b);
                              }}
                              onDragEnd={handleDragEnd}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectBooking(b);
                              }}
                              className={cn(
                                "truncate rounded px-1 py-0.5 text-[9px] sm:text-[10px] leading-tight font-medium flex items-center gap-0.5 group/chip",
                                b.status === "confirmed" && "bg-emerald-500/10 text-emerald-700",
                                b.status === "pending" && "bg-amber-500/10 text-amber-700",
                                b.status === "cancelled" && "bg-rose-500/10 text-rose-600 line-through",
                                b.status !== "cancelled" && "cursor-grab active:cursor-grabbing hover:ring-1 hover:ring-primary/30",
                              )}
                            >
                              {b.status !== "cancelled" && (
                                <GripVertical className="w-2.5 h-2.5 shrink-0 opacity-0 group-hover/chip:opacity-50 transition-opacity" />
                              )}
                              <span className="hidden sm:inline truncate">{b.customer_name.split(" ")[0]}</span>
                              <span className="sm:hidden">{b.customer_name.charAt(0)}</span>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex -space-x-0.5">
                              {Object.entries(
                                dayBookings.reduce<Record<string, number>>((acc, b) => {
                                  acc[b.status] = (acc[b.status] || 0) + 1;
                                  return acc;
                                }, {})
                              ).map(([status]) => (
                                <span
                                  key={status}
                                  className={cn("w-2 h-2 rounded-full", STATUS_DOT_COLORS[status] || "bg-muted-foreground")}
                                />
                              ))}
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground">
                              {dayBookings.length}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Drop indicator */}
                    {isDragOver && !isSameAsSource && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-primary/10 border-2 border-dashed border-primary/40 rounded-lg p-1">
                          <CalendarClock className="w-4 h-4 text-primary/60" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Day detail sidebar */}
        <Card className="border-border h-fit lg:sticky lg:top-20">
          <CardContent className="p-4">
            {selectedDate ? (
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground">
                    {format(selectedDate, "EEEE, MMM d")}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {selectedDateBookings.length} booking{selectedDateBookings.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {selectedDateBookings.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">No bookings on this day</p>
                    {draggedBooking && (
                      <p className="text-xs text-primary mt-1 animate-pulse">Drop a booking here to reschedule</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {selectedDateBookings.map((booking) => (
                      <div
                        key={booking.id}
                        draggable={booking.status !== "cancelled"}
                        onDragStart={(e) => handleDragStart(e, booking)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onSelectBooking(booking)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border border-border bg-card hover:bg-muted/40 transition-colors space-y-2 cursor-pointer",
                          booking.status !== "cancelled" && "cursor-grab active:cursor-grabbing",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {booking.status !== "cancelled" && (
                              <GripVertical className="w-3.5 h-3.5 shrink-0 text-muted-foreground/40" />
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">{booking.customer_name}</p>
                              <p className="text-xs text-muted-foreground truncate">{booking.tour_name}</p>
                            </div>
                          </div>
                          <StatusBadge status={booking.status} size="sm" showPulse={false} />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {booking.adults + booking.children + booking.infants}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-foreground">
                            <DollarSign className="w-3 h-3" />
                            AED {Number(booking.total_price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Day summary */}
                {selectedDateBookings.length > 0 && (
                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Day total</span>
                    <span className="font-bold text-foreground">
                      AED{" "}
                      {selectedDateBookings
                        .filter((b) => b.status !== "cancelled")
                        .reduce((s, b) => s + Number(b.total_price), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <p className="text-sm text-muted-foreground">Select a day to view bookings</p>
                <p className="text-[10px] text-muted-foreground/60">
                  Drag bookings to reschedule them
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          Confirmed
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          Pending
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          Cancelled
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground/60">
          <GripVertical className="w-3 h-3" />
          Drag to reschedule
        </div>
      </div>

      {/* Reschedule Confirmation Dialog */}
      <AlertDialog open={!!rescheduleConfirm} onOpenChange={() => setRescheduleConfirm(null)}>
        <AlertDialogContent className="max-w-[calc(100vw-32px)] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-primary" />
              Reschedule Booking
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Are you sure you want to reschedule this booking?
                </p>
                {rescheduleConfirm && (
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        {rescheduleConfirm.booking.customer_name}
                      </span>
                      <StatusBadge status={rescheduleConfirm.booking.status} size="sm" showPulse={false} />
                    </div>
                    <p className="text-xs text-muted-foreground">{rescheduleConfirm.booking.tour_name}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded-full line-through">
                        {format(new Date(rescheduleConfirm.booking.booking_date), "MMM d, yyyy")}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">
                        {format(new Date(rescheduleConfirm.newDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0" disabled={isRescheduling}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReschedule}
              disabled={isRescheduling}
            >
              {isRescheduling ? "Rescheduling..." : "Confirm Reschedule"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
