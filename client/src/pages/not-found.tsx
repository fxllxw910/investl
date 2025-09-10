import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4 bg-background/40 backdrop-blur-md border border-white/10">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center mb-6">
            <AlertCircle className="h-16 w-16 text-destructive mb-4" />
            <h1 className="text-3xl font-bold text-foreground">404</h1>
            <p className="text-xl mt-2 text-foreground/80">Страница не найдена</p>
          </div>

          <p className="my-6 text-muted-foreground text-center">
            Запрашиваемая страница не существует или была перемещена по другому адресу.
          </p>
          
          <div className="flex justify-center mt-6">
            <Button asChild variant="glass" size="lg">
              <Link href="/">Вернуться на главную</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
