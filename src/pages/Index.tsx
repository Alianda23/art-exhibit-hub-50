
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Palette, Calendar, Users, Star, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="font-serif text-2xl font-bold text-charcoal-dark">
              <span className="text-gold">The Art Gallery</span> of Nairobi
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/home" className="text-charcoal hover:text-gold transition-colors">Home</Link>
              <Link to="/artworks" className="text-charcoal hover:text-gold transition-colors">Artworks</Link>
              <Link to="/exhibitions" className="text-charcoal hover:text-gold transition-colors">Exhibitions</Link>
              <Link to="/contact" className="text-charcoal hover:text-gold transition-colors">Contact</Link>
              <Link to="/login">
                <Button variant="outline" className="mr-2">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gold hover:bg-gold-dark text-white">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary to-accent py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-charcoal-dark mb-6">
                Discover African <span className="text-gold">Art</span> Excellence
              </h1>
              <p className="text-xl text-charcoal mb-8 leading-relaxed">
                Experience the finest collection of Kenyan artworks and exhibitions. Connect with talented artists and immerse yourself in the vibrant culture of East Africa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/artworks">
                  <Button size="lg" className="bg-gold hover:bg-gold-dark text-white w-full sm:w-auto">
                    Explore Artworks
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/exhibitions">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Exhibitions
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=1000" 
                alt="Art Gallery Interior" 
                className="rounded-lg shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-charcoal-dark mb-4">
              Why Choose Our Gallery
            </h2>
            <p className="text-xl text-charcoal max-w-2xl mx-auto">
              We provide a comprehensive platform for art lovers, collectors, and artists to connect and thrive.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-gold" />
                </div>
                <CardTitle className="font-serif text-xl">Curated Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Discover handpicked artworks from Kenya's most talented artists, featuring diverse styles and mediums.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gold" />
                </div>
                <CardTitle className="font-serif text-xl">Exclusive Exhibitions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Attend premium art exhibitions and cultural events that celebrate African artistic heritage.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gold" />
                </div>
                <CardTitle className="font-serif text-xl">Artist Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Connect directly with artists, learn their stories, and support the local creative community.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000" 
                alt="Art Gallery Space" 
                className="rounded-lg shadow-lg w-full h-[400px] object-cover"
              />
            </div>
            <div>
              <h2 className="font-serif text-4xl font-bold text-charcoal-dark mb-6">
                About Our Gallery
              </h2>
              <p className="text-lg text-charcoal mb-6 leading-relaxed">
                The Art Gallery of Nairobi has been at the forefront of promoting Kenyan art and culture for over a decade. We serve as a bridge between traditional African artistry and contemporary expressions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-gold mr-3" />
                  <span className="text-charcoal">Over 500 featured artworks</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-gold mr-3" />
                  <span className="text-charcoal">100+ partnered artists</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-gold mr-3" />
                  <span className="text-charcoal">Monthly curated exhibitions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-gold mr-3" />
                  <span className="text-charcoal">Secure online purchasing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-charcoal-dark mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-charcoal">
              Hear from art enthusiasts who have found their perfect pieces with us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gold fill-current" />
                  ))}
                </div>
                <p className="text-charcoal mb-4 italic">
                  "The quality of artwork and the seamless purchasing experience exceeded my expectations. Found the perfect piece for my home."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mr-4">
                    <span className="font-semibold text-gold">SM</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal-dark">Sarah Muthoni</h4>
                    <p className="text-sm text-charcoal">Art Collector</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gold fill-current" />
                  ))}
                </div>
                <p className="text-charcoal mb-4 italic">
                  "As an artist, this platform has given me incredible exposure. The support team is fantastic and the commission structure is fair."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mr-4">
                    <span className="font-semibold text-gold">JK</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal-dark">James Kiprop</h4>
                    <p className="text-sm text-charcoal">Featured Artist</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gold fill-current" />
                  ))}
                </div>
                <p className="text-charcoal mb-4 italic">
                  "The exhibitions are world-class. Each event is carefully curated and provides great insight into contemporary African art."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mr-4">
                    <span className="font-semibold text-gold">AN</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal-dark">Aisha Ndovu</h4>
                    <p className="text-sm text-charcoal">Gallery Visitor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-charcoal text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-serif text-4xl font-bold mb-6">
            Ready to Start Your Art Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of art enthusiasts who have discovered their passion through our curated collections and exclusive events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gold hover:bg-gold-dark text-white w-full sm:w-auto">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/artworks">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-charcoal w-full sm:w-auto">
                Browse Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal-dark text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-serif text-xl font-bold mb-4">
                <span className="text-gold">The Art Gallery</span> of Nairobi
              </h3>
              <p className="text-gray-300 mb-4">
                Showcasing the finest artworks and exhibitions from talented Kenyan artists.
              </p>
            </div>

            <div>
              <h4 className="font-serif text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/home" className="text-gray-300 hover:text-gold transition-colors">Home</Link></li>
                <li><Link to="/artworks" className="text-gray-300 hover:text-gold transition-colors">Artworks</Link></li>
                <li><Link to="/exhibitions" className="text-gray-300 hover:text-gold transition-colors">Exhibitions</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-gold transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg font-semibold mb-4">For Artists</h4>
              <ul className="space-y-2">
                <li><Link to="/artist-signup" className="text-gray-300 hover:text-gold transition-colors">Join as Artist</Link></li>
                <li><Link to="/artist-login" className="text-gray-300 hover:text-gold transition-colors">Artist Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gold" />
                  <span>Kimathi Street, Nairobi</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-gold" />
                  <span>+254 712 345 678</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gold" />
                  <span>info@artgallery.co.ke</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} The Art Gallery of Nairobi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
