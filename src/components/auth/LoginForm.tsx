
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
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
      // Primero verificamos si el usuario existe en la tabla users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        setError("Usuario no encontrado. Por favor verifique su correo electrónico.");
        setLoading(false);
        return;
      }

      // Si el usuario existe, intentamos autenticarlo
      if (userData.password === password) {
        // Inicio de sesión exitoso, redirigimos al dashboard
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido de nuevo, ${email}`,
        });
        
        // Guardamos la información del usuario en localStorage para mantener la sesión
        localStorage.setItem('user', JSON.stringify({
          email: userData.email,
          company_id: userData.company_id,
          user_id: userData.user_id
        }));
        
        navigate("/inventory");
      } else {
        setError("Contraseña incorrecta. Por favor inténtelo de nuevo.");
      }
    } catch (err) {
      console.error("Error de inicio de sesión:", err);
      setError("Error al iniciar sesión. Por favor inténtelo de nuevo más tarde.");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-inventory-blue">Iniciar Sesión</h2>
        <p className="mt-2 text-sm text-inventory-gray">
          Ingrese sus credenciales para acceder al sistema
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleLogin} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-inventory-gray">
              Correo Electrónico
            </label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-inventory-gray">
              Contraseña
            </label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-inventory-gray" />
                ) : (
                  <Eye className="h-4 w-4 text-inventory-gray" />
                )}
              </button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-inventory-teal hover:bg-inventory-teal/90"
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
