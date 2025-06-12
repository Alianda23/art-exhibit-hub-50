import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatDate } from '@/utils/formatters';
import { CalendarIcon, MapPinIcon, UserIcon, PhoneIcon, MailIcon, Loader2, Sparkles } from 'lucide-react';
import { authFetch, getAllArtworks } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { RecommendationEngine } from '@/services/recommendationService';
import ArtworkCard from '@/components/ArtworkCard';
import { Artwork } from '@/types';
import { format } from 'date-fns';
import jsPDF from 'jspdf';

type UserOrder = {
  id: string;
  artworkId: string;
  artworkTitle: string;
  artist: string;
  date: string;
  price: number;
  deliveryFee: number;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
};

type UserBooking = {
  id: string;
  exhibitionId: string;
  exhibitionTitle: string;
  date: string;
  location: string;
  slots: number;
  totalAmount: number;
  status: string;
};

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [recommendedArtworks, setRecommendedArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [generatingTicket, setGeneratingTicket] = useState<string | null>(null);

  useEffect(() => {
    console.log('Profile: useEffect triggered for user:', currentUser?.id);
    
    if (currentUser && currentUser.id) {
      console.log('Profile: Fetching orders for user ID:', currentUser.id);
      fetchUserOrders();
    } else {
      console.log('Profile: No current user or user ID found');
    }
  }, [currentUser]);

  // Load recommendations when user switches to recommendations tab
  useEffect(() => {
    if (activeTab === 'recommendations' && currentUser?.id && recommendedArtworks.length === 0) {
      loadPersonalizedRecommendations();
    }
  }, [activeTab, currentUser]);

  if (!currentUser) {
    console.log('Profile: Redirecting to login - no current user');
    navigate('/login');
    return null;
  }

  const fetchUserOrders = async () => {
    console.log('Profile: fetchUserOrders called with currentUser:', currentUser);
    
    if (!currentUser.id) {
      console.log('Profile: No user ID available. CurrentUser object:', currentUser);
      return;
    }
    
    console.log('Profile: Starting to fetch orders for user ID:', currentUser.id);
    setLoading(true);
    try {
      console.log('Profile: Making request to /user/{user_id}/orders endpoint using authFetch');
      const data = await authFetch(`/user/${currentUser.id}/orders`);
      console.log("Profile: User orders response:", data);
      
      if (data.error) {
        console.error('Profile: Error in response:', data.error);
        toast({
          title: "Error",
          description: data.error || "Failed to load your orders and bookings",
          variant: "destructive"
        });
        return;
      }
      
      if (data.orders) {
        console.log('Profile: Setting orders:', data.orders);
        setOrders(data.orders);
      } else {
        console.log('Profile: No orders in response');
        setOrders([]);
      }
      
      if (data.bookings) {
        console.log('Profile: Setting bookings:', data.bookings);
        setBookings(data.bookings);
      } else {
        console.log('Profile: No bookings in response');
        setBookings([]);
      }
    } catch (error) {
      console.error('Profile: Error fetching user orders:', error);
      toast({
        title: "Error",
        description: "Failed to load your orders and bookings. Please check if the server is running.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPersonalizedRecommendations = async () => {
    console.log('Loading personalized recommendations');
    setLoadingRecommendations(true);
    try {
      const allArtworks = await getAllArtworks();
      const recommendations = await RecommendationEngine.generatePersonalizedRecommendations(
        currentUser.id,
        allArtworks,
        6
      );
      setRecommendedArtworks(recommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to load personalized recommendations.",
        variant: "destructive"
      });
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const generateTicketPDF = (booking: UserBooking) => {
    try {
      setGeneratingTicket(booking.id);
      console.log(`Generating PDF ticket for booking: ${booking.id}`);
      
      // Create new PDF document
      const doc = new jsPDF();
      
      // Set font and colors
      doc.setFont('helvetica');
      
      // Title
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 0);
      doc.text('EXHIBITION TICKET', 105, 30, { align: 'center' });
      
      // Subtitle
      doc.setFontSize(12);
      doc.text('Gallery Management System', 105, 40, { align: 'center' });
      
      // Draw border
      doc.rect(20, 50, 170, 120);
      
      // Ticket details
      doc.setFontSize(14);
      doc.setTextColor(51, 51, 51);
      
      let yPosition = 70;
      const lineHeight = 15;
      
      // User name
      doc.setFontSize(12);
      doc.setTextColor(102, 102, 102);
      doc.text('User:', 30, yPosition);
      doc.setTextColor(51, 51, 51);
      doc.text(currentUser.name, 70, yPosition);
      yPosition += lineHeight;
      
      // Exhibition title
      doc.setTextColor(102, 102, 102);
      doc.text('Exhibition:', 30, yPosition);
      doc.setTextColor(51, 51, 51);
      doc.text(booking.exhibitionTitle, 70, yPosition);
      yPosition += lineHeight;
      
      // Booking date
      doc.setTextColor(102, 102, 102);
      doc.text('Booking Date:', 30, yPosition);
      doc.setTextColor(51, 51, 51);
      doc.text(formatDate(booking.date), 70, yPosition);
      yPosition += lineHeight;
      
      // Location
      doc.setTextColor(102, 102, 102);
      doc.text('Location:', 30, yPosition);
      doc.setTextColor(51, 51, 51);
      doc.text(booking.location, 70, yPosition);
      yPosition += lineHeight;
      
      // Slots
      doc.setTextColor(102, 102, 102);
      doc.text('Slots:', 30, yPosition);
      doc.setTextColor(51, 51, 51);
      doc.text(String(booking.slots), 70, yPosition);
      yPosition += lineHeight;
      
      // Status
      doc.setTextColor(102, 102, 102);
      doc.text('Status:', 30, yPosition);
      doc.setTextColor(51, 51, 51);
      doc.text(booking.status.toUpperCase(), 70, yPosition);
      yPosition += 25;
      
      // Ticket code (centered and highlighted)
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      const ticketCode = `TICKET-${String(booking.id).toUpperCase()}`;
      doc.text(ticketCode, 105, yPosition, { align: 'center' });
      
      // Draw rectangle around ticket code
      const codeWidth = doc.getTextWidth(ticketCode);
      doc.rect(105 - codeWidth/2 - 5, yPosition - 8, codeWidth + 10, 12);
      
      // Footer
      yPosition += 30;
      doc.setFontSize(10);
      doc.setTextColor(102, 102, 102);
      doc.text('Please present this ticket at the exhibition entrance', 105, yPosition, { align: 'center' });
      doc.text(`Generated on ${format(new Date(), 'MMMM do, yyyy h:mm a')}`, 105, yPosition + 10, { align: 'center' });
      
      // Save the PDF
      const fileName = `exhibition-ticket-${booking.id}.pdf`;
      doc.save(fileName);
      
      toast({
        title: "Success",
        description: "PDF ticket generated and downloaded successfully",
      });

    } catch (error) {
      console.error("Error generating PDF ticket:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingTicket(null);
    }
  };

  return (
    <div className="min-h-screen bg-secondary py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-serif font-bold mb-8">My Account</h1>

        <Tabs defaultValue="profile" onValueChange={setActiveTab} className="bg-white rounded-lg shadow-md">
          <TabsList className="grid w-full grid-cols-4 rounded-t-lg">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="bookings">Exhibition Bookings</TabsTrigger>
            <TabsTrigger value="orders">Artwork Orders</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="p-6">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <UserIcon className="h-5 w-5 mr-3 text-gold" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">{currentUser.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <MailIcon className="h-5 w-5 mr-3 text-gold" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{currentUser.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <PhoneIcon className="h-5 w-5 mr-3 text-gold" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{currentUser.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Account Management</CardTitle>
                    <CardDescription>Manage your account settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full">Edit Profile</Button>
                      <Button variant="outline" className="w-full">Change Password</Button>
                      <Button 
                        variant="destructive" 
                        className="w-full" 
                        onClick={handleLogout}
                      >
                        Log Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="p-6">
            <h2 className="text-xl font-serif font-semibold mb-4">Your Exhibition Bookings</h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
                <span className="ml-2">Loading your bookings...</span>
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{booking.exhibitionTitle}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <CalendarIcon className="h-4 w-4 mr-1 text-gold" />
                            <span className="text-sm">{formatDate(booking.date)}</span>
                          </div>
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPinIcon className="h-4 w-4 mr-1 text-gold" />
                            <span className="text-sm">{booking.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm mb-1">
                            <span className="text-gray-600">Tickets: </span>
                            <span className="font-medium">{booking.slots}</span>
                          </div>
                          <div className="text-sm mb-2">
                            <span className="text-gray-600">Total: </span>
                            <span className="font-medium">{formatPrice(booking.totalAmount)}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 mt-3">
                            <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              {booking.status}
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => generateTicketPDF(booking)}
                              disabled={generatingTicket === booking.id}
                            >
                              {generatingTicket === booking.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Generating...
                                </>
                              ) : (
                                'Print Ticket'
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-600">You haven't booked any exhibitions yet.</p>
                <Button 
                  className="mt-4 bg-gold hover:bg-gold-dark text-white"
                  onClick={() => navigate('/exhibitions')}
                >
                  Explore Exhibitions
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="p-6">
            <h2 className="text-xl font-serif font-semibold mb-4">Your Artwork Orders</h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
                <span className="ml-2">Loading your orders...</span>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{order.artworkTitle}</h3>
                          <p className="text-gray-600 text-sm">by {order.artist}</p>
                          <div className="flex items-center text-gray-600 mt-1">
                            <CalendarIcon className="h-4 w-4 mr-1 text-gold" />
                            <span className="text-sm">Ordered on {formatDate(order.date)}</span>
                          </div>
                          {order.deliveryAddress && (
                            <div className="text-gray-600 mt-2 text-sm">
                              <p><strong>Delivery Address:</strong></p>
                              <p>{order.deliveryAddress}</p>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm mb-1">
                            <span className="text-gray-600">Price: </span>
                            <span className="font-medium">{formatPrice(order.price)}</span>
                          </div>
                          {order.deliveryFee > 0 && (
                            <div className="text-sm mb-1">
                              <span className="text-gray-600">Delivery: </span>
                              <span className="font-medium">{formatPrice(order.deliveryFee)}</span>
                            </div>
                          )}
                          <div className="text-sm mb-2">
                            <span className="text-gray-600">Total: </span>
                            <span className="font-medium">{formatPrice(order.totalAmount)}</span>
                          </div>
                          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                            ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}
                          `}>
                            {order.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-600">You haven't purchased any artworks yet.</p>
                <Button 
                  className="mt-4 bg-gold hover:bg-gold-dark text-white"
                  onClick={() => navigate('/artworks')}
                >
                  Explore Artworks
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="p-6">
            <div className="flex items-center mb-6">
              <Sparkles className="h-6 w-6 text-gold mr-2" />
              <h2 className="text-xl font-serif font-semibold">Personalized Recommendations</h2>
            </div>
            
            <div className="mb-6 p-4 bg-gold/10 rounded-lg border border-gold/20">
              <p className="text-sm text-gray-700">
                These recommendations are based on your purchase history and preferences. 
                The more you purchase, the better our recommendations become!
              </p>
            </div>
            
            {loadingRecommendations ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
                <span className="ml-2">Loading personalized recommendations...</span>
              </div>
            ) : recommendedArtworks.length > 0 ? (
              <div className="artwork-grid">
                {recommendedArtworks.map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  No personalized recommendations available yet.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Start by purchasing some artworks or booking exhibitions to help us understand your preferences.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    className="bg-gold hover:bg-gold-dark text-white"
                    onClick={() => navigate('/artworks')}
                  >
                    Browse Artworks
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/exhibitions')}
                  >
                    View Exhibitions
                  </Button>
                </div>
              </div>
            )}
            
            {recommendedArtworks.length > 0 && (
              <div className="mt-8 text-center">
                <Button 
                  variant="outline"
                  onClick={loadPersonalizedRecommendations}
                  disabled={loadingRecommendations}
                >
                  Refresh Recommendations
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
