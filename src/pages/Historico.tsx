import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Cloud, Thermometer, Droplets, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HistoricoItem {
  id: string;
  cidade: string;
  clima: string;
  temperatura: number;
  temperatura_max: number;
  temperatura_min: number;
  umidade: number;
  descricao: string;
  data_pesquisa: string;
}

const Historico = () => {
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      carregarHistorico();
    };

    checkAuth();
  }, [navigate]);

  const carregarHistorico = async () => {
    try {
      const { data, error } = await supabase
        .from("historico_pesquisas")
        .select("*")
        .order("data_pesquisa", { ascending: false })
        .limit(20);

      if (error) throw error;

      setHistorico(data || []);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Histórico de Pesquisas</h1>
        </div>

        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Carregando histórico...</p>
            </CardContent>
          </Card>
        ) : historico.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Você ainda não fez nenhuma pesquisa de clima.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {historico.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.cidade}</CardTitle>
                      <CardDescription className="capitalize">
                        {item.descricao}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {Math.round(item.temperatura)}°C
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-primary" />
                      <span>Clima: {item.clima}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-primary" />
                      <span>Umidade: {item.umidade}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-hot" />
                      <span>Máx: {Math.round(item.temperatura_max)}°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-cold" />
                      <span>Mín: {Math.round(item.temperatura_min)}°C</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {format(new Date(item.data_pesquisa), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Historico;