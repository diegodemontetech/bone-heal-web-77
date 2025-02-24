
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { UserPlus, Loader2 } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Check if profile exists
  const checkProfile = async (userId: string) => {
    console.log('Checking profile for user:', userId);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw new Error('Erro ao buscar perfil');
      }

      if (!profile) {
        throw new Error('Perfil não encontrado. Por favor, registre-se primeiro.');
      }

      console.log('Profile found:', profile);
      return profile;
    } catch (error) {
      console.error('Profile check error:', error);
      throw error;
    }
  };

  const onSubmit = async (values: LoginFormData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting login for:', values.email);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw signInError;
      }
      
      if (!data.user) {
        throw new Error('Usuário não encontrado');
      }

      console.log('User authenticated successfully:', data.user.id);
      
      // Check if profile exists
      await checkProfile(data.user.id);
      
      console.log('Login successful, navigating to home');
      toast.success('Login realizado com sucesso!');
      navigate('/');

    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Falha ao fazer login');
      toast.error(error.message || 'Falha ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  // Check if already logged in
  React.useEffect(() => {
    console.log('Checking existing session...');
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
      if (session?.user) {
        try {
          await checkProfile(session.user.id);
          console.log('Session valid, navigating to home');
          navigate('/');
        } catch (error) {
          console.error('Session profile check error:', error);
          // If there's an error with the profile, we'll let the user stay on the login page
        }
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Área do Cliente
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Acesse sua conta como
            </p>
            <div className="mt-4 flex gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 border border-purple-600 text-sm font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Pessoa Física
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 border border-purple-600 text-sm font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Pessoa Jurídica
              </Link>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">Já é cadastrado?</h3>
              <p className="text-sm text-gray-600">Entre com suas credenciais abaixo</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    {...form.register('email')}
                    type="email"
                    required
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <input
                    id="password"
                    {...form.register('password')}
                    type="password"
                    required
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Novo por aqui?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Crie sua conta agora e tenha acesso a todos os nossos produtos e serviços
              </p>
              <Link
                to="/register"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-purple-600 text-sm font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <UserPlus className="h-4 w-4" />
                Criar conta
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
