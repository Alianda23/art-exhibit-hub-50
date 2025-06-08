
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import TwoFactorVerification from "@/components/TwoFactorVerification";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState<{email: string, password: string} | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const sendTwoFactorCode = async (userEmail: string, userType: 'user' | 'artist' = 'user') => {
    try {
      const response = await fetch('http://localhost:8000/send-2fa-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          userType
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }
      
      return data;
    } catch (error) {
      console.error('Error sending 2FA code:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Attempting login with:", { email });
      
      // First, validate credentials without logging in
      const response = await fetch('http://localhost:8000/validate-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          userType: 'user'
        }),
      });

      const data = await response.json();
      
      if (data.valid) {
        // Credentials are valid, send 2FA code
        await sendTwoFactorCode(email, 'user');
        setPendingCredentials({ email, password });
        setShowTwoFactor(true);
        
        toast({
          title: "Verification Code Sent",
          description: "Please check your email for the verification code.",
        });
      } else {
        setError("Invalid email or password");
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Connection error. Please try again later.");
      toast({
        title: "Connection Error",
        description: "Could not reach the server. Please check if the server is running.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorSuccess = async () => {
    if (!pendingCredentials) return;
    
    try {
      const success = await login(pendingCredentials.email, pendingCredentials.password);
      
      if (success) {
        toast({
          title: "Success",
          description: "You have successfully logged in",
        });
        navigate("/home");
      }
    } catch (error) {
      console.error("Final login error:", error);
      toast({
        title: "Error",
        description: "Login failed after verification. Please try again.",
        variant: "destructive",
      });
      setShowTwoFactor(false);
      setPendingCredentials(null);
    }
  };

  const handleResendCode = async () => {
    if (!pendingCredentials) return;
    await sendTwoFactorCode(pendingCredentials.email, 'user');
  };

  if (showTwoFactor && pendingCredentials) {
    return (
      <TwoFactorVerification
        email={pendingCredentials.email}
        userType="user"
        onVerificationSuccess={handleTwoFactorSuccess}
        onResendCode={handleResendCode}
      />
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center bg-secondary">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-serif text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-gold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm py-2">{error}</div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-gold hover:bg-gold-dark text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-gold hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
