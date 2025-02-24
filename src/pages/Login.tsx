
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
import { UserPlus } from 'lucide-react';

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
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw new Error('Erro ao buscar perfil');
      }

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

      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) throw signInError;
      
      if (user) {
        // Check if profile exists
        const profile = await checkProfile(user.id);
        
        if (!profile) {
          throw new Error('Perfil não encontrado. Por favor, registre-se primeiro.');
        }

        toast.success('Login realizado com sucesso!');
        navigate('/');
      }

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
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        try {
          await checkProfile(session.user.id);
          navigate('/');
        } catch (error) {
          console.error('Session profile check error:', error);
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
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email
                    </label>
                    <input
                      id="email"
                      {...form.register('email')}
                      type="email"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Senha
                    </label>
                    <input
                      id="password"
                      {...form.register('password')}
                      type="password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                      placeholder="Senha"
                    />
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
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
                className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 border border-purple-600 text-sm font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
