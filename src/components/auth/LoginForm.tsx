
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Clear any previous auth errors
    setError(null);
    
    // Check if user is already authenticated
    const checkExistingAuth = () => {
      const existingUser = localStorage.getItem('user');
      if (existingUser) {
        navigate("/inventory", { replace: true });
      }
    };
    
    checkExistingAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Attempting login with email:", email);
      
      // First verify if the user exists in the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.trim())
        .maybeSingle();

      console.log("User query result:", userData, "Error:", userError);

      if (userError) {
        console.error("Database error:", userError);
        setError("Error connecting to database. Please try again later.");
        setLoading(false);
        return;
      }

      if (!userData) {
        console.log("No user found with email:", email);
        setError("User not found. Please verify your email address.");
        setLoading(false);
        return;
      }

      // If user exists, compare passwords
      console.log("Validating password for user:", userData.email);
      
      if (userData.password === password) {
        console.log("Password validated successfully");
        
        // Successful login
        toast({
          title: "Login successful",
          description: `Welcome to Stock Savvy Connect`,
        });
        
        // Store user information in localStorage to maintain session
        const userSession = {
          email: userData.email,
          company_id: userData.company_id,
          user_id: userData.user_id
        };
        
        console.log("Setting user session:", userSession);
        localStorage.setItem('user', JSON.stringify(userSession));
        
        // Redirect to dashboard
        navigate("/inventory");
      } else {
        console.log("Password validation failed");
        setError("Incorrect password. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Error logging in. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-black/80 backdrop-blur-md rounded-lg border border-inventory-teal/30 shadow-[0_0_20px_rgba(51,195,240,0.3)]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white text-glow-strong">Access Portal</h2>
        <p className="mt-2 text-sm text-gray-300">
          Enter your credentials to access the system
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-900/80 border-red-800 text-white animate-pulse">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleLogin} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 bg-black/60 border-inventory-teal/40 focus-visible:ring-inventory-teal text-white placeholder:text-gray-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10 bg-black/60 border-inventory-teal/40 focus-visible:ring-inventory-teal text-white placeholder:text-gray-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-inventory-teal hover:bg-inventory-teal/90 text-white font-medium shadow-[0_0_10px_rgba(51,195,240,0.5)] transition-all duration-300"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Authenticating...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <LogIn className="h-4 w-4 mr-2" />
              <span>Access System</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
