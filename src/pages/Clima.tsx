import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  Search,
  LogOut,
  History,
  Info,
  Shirt
} from "lucide-react";
import { Session } from "@supabase/supabase-js";

const OPENWEATHER_API_KEY = "YOUR_API_KEY_HERE"; // Usuário precisa adicionar a chave

interface WeatherData {
  name: string;
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
}

const Clima = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [cidade, setCidade] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/login");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const buscarClima = async () => {
    if (!cidade.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite uma cidade",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`
      );

      if (!response.ok) {
        throw new Error("Cidade não encontrada");
      }

      const data: WeatherData = await response.json();
      setWeatherData(data);

      // Salvar no histórico
      if (session?.user) {
        await supabase.from("historico_pesquisas").insert({
          user_id: session.user.id,
          cidade: data.name,
          clima: data.weather[0].main,
          temperatura: data.main.temp,
          temperatura_max: data.main.temp_max,
          temperatura_min: data.main.temp_min,
          umidade: data.main.humidity,
          descricao: data.weather[0].description,
        });
      }

      toast({
        title: "Clima atualizado!",
        description: `Dados de ${data.name} carregados`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível buscar os dados do clima",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSugestaoRoupa = (temp: number, clima: string) => {
    if (clima.toLowerCase().includes("rain") || clima.toLowerCase().includes("chuva")) {
      return {
        icon: <CloudRain className="h-16 w-16 text-rainy" />,
        sugestao: "🌂 Guarda-chuva ou capa de chuva",
        detalhes: "Está chovendo! Não esqueça de se proteger da água."
      };
    } else if (temp > 30) {
      return {
        icon: <Sun className="h-16 w-16 text-hot" />,
        sugestao: "👕 Roupas leves, chapéu e óculos de sol",
        detalhes: "Está muito quente! Vista roupas leves e se hidrate."
      };
    } else if (temp >= 20 && temp <= 30) {
      return {
        icon: <Sun className="h-16 w-16 text-sunny" />,
        sugestao: "👔 Camiseta e calça leve",
        detalhes: "Temperatura agradável para roupas confortáveis."
      };
    } else if (temp >= 10 && temp < 20) {
      return {
        icon: <Cloud className="h-16 w-16 text-cloudy" />,
        sugestao: "🧥 Jaqueta ou suéter",
        detalhes: "Está fresco, melhor levar uma jaqueta."
      };
    } else {
      return {
        icon: <Cloud className="h-16 w-16 text-cold" />,
        sugestao: "🧣 Casaco pesado, cachecol e luvas",
        detalhes: "Está frio! Agasalhe-se bem antes de sair."
      };
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (!session) {
    return null;
  }

  const sugestao = weatherData ? getSugestaoRoupa(weatherData.main.temp, weatherData.weather[0].main) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-accent/10 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header com navegação */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Climate Wardrobe</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate("/historico")}>
              <History className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigate("/sobre")}>
              <Info className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Busca */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Clima</CardTitle>
            <CardDescription>Digite o nome da cidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Ex: São Paulo"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && buscarClima()}
              />
              <Button onClick={buscarClima} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dados do clima */}
        {weatherData && (
          <>
            <Card className="bg-gradient-to-br from-primary/20 to-accent/20">
              <CardHeader>
                <CardTitle className="text-2xl">{weatherData.name}</CardTitle>
                <CardDescription className="text-lg capitalize">
                  {weatherData.weather[0].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="text-6xl font-bold">
                    {Math.round(weatherData.main.temp)}°C
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-hot" />
                    <span>Máx: {Math.round(weatherData.main.temp_max)}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-cold" />
                    <span>Mín: {Math.round(weatherData.main.temp_min)}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-primary" />
                    <span>Umidade: {weatherData.main.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-muted-foreground" />
                    <span>Vento: {weatherData.wind.speed} km/h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sugestão de roupa */}
            {sugestao && (
              <Card className="border-2 border-accent">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shirt className="h-5 w-5 text-accent" />
                    <CardTitle>Sugestão de Roupa</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="flex justify-center">
                    {sugestao.icon}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold">{sugestao.sugestao}</p>
                    <p className="text-muted-foreground">{sugestao.detalhes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Clima;