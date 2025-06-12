
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, TrendingUp, Users, Calendar, ShoppingBag, Ticket } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getAllArtworks, getAllExhibitions, getAllTickets, authFetch } from '@/services/api';
import { format } from 'date-fns';

const AdminReports = () => {
  const { toast } = useToast();
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  // Fetch data for reports
  const { data: artworks } = useQuery({
    queryKey: ['artworks'],
    queryFn: getAllArtworks,
  });

  const { data: exhibitions } = useQuery({
    queryKey: ['exhibitions'],
    queryFn: getAllExhibitions,
  });

  const { data: ticketsData } = useQuery({
    queryKey: ['tickets'],
    queryFn: getAllTickets,
  });

  const { data: ordersData } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await authFetch('/orders');
      return response;
    },
  });

  const generateCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header.toLowerCase().replace(' ', '_')] || '';
        return `"${value.toString().replace(/"/g, '""')}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateReport = async (reportType: string) => {
    setGeneratingReport(reportType);
    
    try {
      switch (reportType) {
        case 'sales':
          const salesData = ordersData?.orders?.map((order: any) => ({
            order_id: order.id,
            customer_name: order.user_name,
            item_title: order.item_title,
            total_amount: order.total_amount,
            payment_status: order.payment_status,
            order_date: format(new Date(order.order_date), 'yyyy-MM-dd'),
          })) || [];
          generateCSV(salesData, 'sales_report', ['Order ID', 'Customer Name', 'Item Title', 'Total Amount', 'Payment Status', 'Order Date']);
          break;

        case 'artworks':
          console.log('Generating artwork report with data:', artworks);
          const artworkData = artworks?.map((artwork: any) => ({
            title: artwork.title,
            artist_name: artwork.artist, // Fixed: using 'artist' instead of 'artist_name'
            medium: artwork.medium,
            price: artwork.price,
            available: artwork.status === 'available' ? 'Yes' : 'No', // Fixed: using 'status' field
            created_at: artwork.created_at ? format(new Date(artwork.created_at), 'yyyy-MM-dd') : 'N/A',
          })) || [];
          console.log('Processed artwork data for CSV:', artworkData);
          generateCSV(artworkData, 'artworks_report', ['Title', 'Artist Name', 'Medium', 'Price', 'Available', 'Created At']);
          break;

        case 'exhibitions':
          const exhibitionData = exhibitions?.map((exhibition: any) => ({
            title: exhibition.title,
            location: exhibition.location,
            start_date: format(new Date(exhibition.startDate), 'yyyy-MM-dd'),
            end_date: format(new Date(exhibition.endDate), 'yyyy-MM-dd'),
            status: exhibition.status,
            ticket_price: exhibition.ticketPrice,
          })) || [];
          generateCSV(exhibitionData, 'exhibitions_report', ['Title', 'Location', 'Start Date', 'End Date', 'Status', 'Ticket Price']);
          break;

        case 'tickets':
          const ticketData = ticketsData?.tickets?.map((ticket: any) => ({
            user_name: ticket.user_name,
            exhibition_title: ticket.exhibition_title,
            booking_date: format(new Date(ticket.booking_date), 'yyyy-MM-dd'),
            slots: ticket.slots,
            status: ticket.status,
            total_amount: ticket.total_amount,
          })) || [];
          generateCSV(ticketData, 'tickets_report', ['User Name', 'Exhibition Title', 'Booking Date', 'Slots', 'Status', 'Total Amount']);
          break;

        case 'financial':
          const totalSales = ordersData?.orders?.reduce((sum: number, order: any) => 
            order.payment_status === 'completed' ? sum + (order.total_amount || 0) : sum, 0) || 0;
          const totalTickets = ticketsData?.tickets?.reduce((sum: number, ticket: any) => 
            sum + (ticket.total_amount || 0), 0) || 0;
          
          const financialData = [
            {
              category: 'Artwork Sales',
              total_revenue: totalSales,
              count: ordersData?.orders?.filter((o: any) => o.payment_status === 'completed').length || 0,
              report_date: format(new Date(), 'yyyy-MM-dd'),
            },
            {
              category: 'Exhibition Tickets',
              total_revenue: totalTickets,
              count: ticketsData?.tickets?.length || 0,
              report_date: format(new Date(), 'yyyy-MM-dd'),
            },
            {
              category: 'Total Revenue',
              total_revenue: totalSales + totalTickets,
              count: (ordersData?.orders?.length || 0) + (ticketsData?.tickets?.length || 0),
              report_date: format(new Date(), 'yyyy-MM-dd'),
            }
          ];
          generateCSV(financialData, 'financial_report', ['Category', 'Total Revenue', 'Count', 'Report Date']);
          break;
      }

      toast({
        title: "Success",
        description: "Report generated and downloaded successfully",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingReport(null);
    }
  };

  const reports = [
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'Complete sales data including orders, payments, and customer information',
      icon: ShoppingBag,
      color: 'bg-green-500',
      dataCount: ordersData?.orders?.length || 0,
    },
    {
      id: 'artworks',
      title: 'Artworks Inventory',
      description: 'All artworks with details, pricing, and availability status',
      icon: FileText,
      color: 'bg-blue-500',
      dataCount: artworks?.length || 0,
    },
    {
      id: 'exhibitions',
      title: 'Exhibitions Report',
      description: 'Exhibition schedules, locations, and ticket pricing information',
      icon: Calendar,
      color: 'bg-purple-500',
      dataCount: exhibitions?.length || 0,
    },
    {
      id: 'tickets',
      title: 'Ticket Bookings',
      description: 'Exhibition ticket bookings and attendance data',
      icon: Ticket,
      color: 'bg-orange-500',
      dataCount: ticketsData?.tickets?.length || 0,
    },
    {
      id: 'financial',
      title: 'Financial Summary',
      description: 'Revenue analysis from sales and ticket bookings',
      icon: TrendingUp,
      color: 'bg-red-500',
      dataCount: ((ordersData?.orders?.length || 0) + (ticketsData?.tickets?.length || 0)),
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Generate and download comprehensive reports for your gallery management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
          const IconComponent = report.icon;
          return (
            <Card key={report.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${report.color} text-white`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <Badge variant="secondary">{report.dataCount} records</Badge>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{report.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{report.description}</p>
              
              <Button 
                onClick={() => generateReport(report.id)}
                disabled={generatingReport === report.id}
                className="w-full flex items-center justify-center gap-2"
              >
                {generatingReport === report.id ? (
                  "Generating..."
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download CSV
                  </>
                )}
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="mt-12">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {ordersData?.orders?.filter((o: any) => o.payment_status === 'completed').length || 0}
              </div>
              <div className="text-sm text-gray-600">Completed Sales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{artworks?.length || 0}</div>
              <div className="text-sm text-gray-600">Total Artworks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{exhibitions?.length || 0}</div>
              <div className="text-sm text-gray-600">Active Exhibitions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{ticketsData?.tickets?.length || 0}</div>
              <div className="text-sm text-gray-600">Tickets Booked</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
