
import { useState } from "react";
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First verify if the user exists in the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        setError("User not found. Please verify your email address.");
        setLoading(false);
        return;
      }

      // If user exists, attempt to authenticate
      if (userData.password === password) {
        // Successful login, redirect to dashboard
        toast({
          title: "Login successful",
          description: `Welcome back, ${email}`,
        });
        
        // Store user information in localStorage to maintain session
        localStorage.setItem('user', JSON.stringify({
          email: userData.email,
          company_id: userData.company_id,
          user_id: userData.user_id
        }));
        
        navigate("/inventory");
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Error logging in. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-black/60 backdrop-blur-md rounded-lg border border-inventory-teal/20 shadow-[0_0_20px_rgba(51,195,240,0.2)]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-inventory-teal">Login</h2>
        <p className="mt-2 text-sm text-inventory-light-blue">
          Enter your credentials to access the system
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-800">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleLogin} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-inventory-light-blue">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 bg-black/50 border-inventory-teal/30 focus-visible:ring-inventory-teal"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-inventory-light-blue">
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
                className="pr-10 bg-black/50 border-inventory-teal/30 focus-visible:ring-inventory-teal"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-inventory-light-blue" />
                ) : (
                  <Eye className="h-4 w-4 text-inventory-light-blue" />
                )}
              </button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-inventory-teal hover:bg-inventory-teal/90 shadow-[0_0_10px_rgba(51,195,240,0.4)] transition-all duration-300"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Logging in...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <LogIn className="h-4 w-4 mr-2" />
              <span>Login</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
