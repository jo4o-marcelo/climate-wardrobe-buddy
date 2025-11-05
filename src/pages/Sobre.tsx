import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Cloud, Database, Code } from "lucide-react";

const Sobre = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Sobre o App</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cloud className="h-6 w-6 text-primary" />
              <CardTitle>Climate Wardrobe Buddy</CardTitle>
            </div>
            <CardDescription>
              Seu assistente pessoal de clima e guarda-roupa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Descrição do Aplicativo</h3>
              <p className="text-sm text-muted-foreground">
                O Climate Wardrobe Buddy é um aplicativo mobile que ajuda você a se vestir
                adequadamente de acordo com as condições climáticas. Basta buscar a previsão
                do tempo da sua cidade e receber sugestões personalizadas de roupas baseadas
                na temperatura, umidade e condições meteorológicas atuais.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Code className="h-4 w-4" />
                API Utilizada
              </h3>
              <p className="text-sm text-muted-foreground">
                <strong>OpenWeatherMap API:</strong> Utilizamos a API da OpenWeatherMap para
                obter dados meteorológicos em tempo real, incluindo temperatura, umidade,
                velocidade do vento e condições climáticas de qualquer cidade do mundo.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Database className="h-4 w-4" />
                Supabase
              </h3>
              <p className="text-sm text-muted-foreground">
                O aplicativo utiliza o <strong>Supabase</strong> como backend para:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                <li>Autenticação segura de usuários (login e cadastro)</li>
                <li>Armazenamento de perfis de usuário</li>
                <li>Histórico de pesquisas de clima</li>
                <li>Gerenciamento de dados em tempo real</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Projeto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="font-semibold">Desenvolvedores:</div>
              <div className="text-muted-foreground">[Seus Nomes]</div>
              
              <div className="font-semibold">Turma:</div>
              <div className="text-muted-foreground">[Sua Turma]</div>
              
              <div className="font-semibold">Turno:</div>
              <div className="text-muted-foreground">[Seu Turno]</div>
              
              <div className="font-semibold">Unidade:</div>
              <div className="text-muted-foreground">[Sua Unidade]</div>
              
              <div className="font-semibold">Período:</div>
              <div className="text-muted-foreground">[1º ou 2º] - [Ano]</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/10">
          <CardHeader>
            <CardTitle className="text-base">Tecnologias Utilizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• React + TypeScript</li>
              <li>• Capacitor (para mobile nativo)</li>
              <li>• Supabase (Backend e Autenticação)</li>
              <li>• OpenWeatherMap API</li>
              <li>• Tailwind CSS (Design System)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sobre;