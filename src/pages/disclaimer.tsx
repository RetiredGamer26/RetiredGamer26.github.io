import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Disclaimer() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6">
            <p>
              This application is provided for informational purposes only. Statuses,
              timelines, and franchise availability may be updated without notice.
            </p>
            <p>
              Always verify important details directly with the relevant franchise or
              organization before making decisions based on this information.
            </p>
            <div>
              <Button asChild variant="outline">
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default Disclaimer;
