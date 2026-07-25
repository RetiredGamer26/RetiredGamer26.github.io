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
              I made this webpage under the idea that a franchise whose founding 
              members left long ago have lost it's esence and thus the franchise 
              is no longer the same. This is a personal opinion and should not be 
              taken as fact. 
            </p>
            <p>
              This webpage is provided for informational purposes only. The 
              information used only comes from the games' credits, claimings of 
              "deception", "bias" or "harming" should be consulted with the game 
              credit's itself. However, if mistakes or inaccuracies were to be 
              be found in this webpage please contact me with corresponding 
              proof and it shall be corrected when time from my part is avalable.
            </p>
            <p>
              Email: jason2026lee@gmail.com
            </p>
            <p>
              Sincerly, <br />
              <strong>RetiredGamer</strong>
            </p>
            <div>
              <Button asChild variant="outline">
                <Link href={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}>Back to home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default Disclaimer;
