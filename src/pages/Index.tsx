import { useState } from "react";
import { Header } from "@/components/Header";
import { SetupPanel } from "@/components/SetupPanel";
import { ChatPanel } from "@/components/ChatPanel";

const Index = () => {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState("");

  const handleSetupComplete = (name: string, age: string) => {
    setUserName(name);
    setUserAge(age);
    setIsSetupComplete(true);
  };

  return (
    <div className="min-h-screen flex flex-col marble-texture">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        {!isSetupComplete ? (
          <div className="w-full">
            <SetupPanel onComplete={handleSetupComplete} />
          </div>
        ) : (
          <div className="w-full grid md:grid-cols-2 gap-0 border-t-2 border-gold/20">
            {/* Left panel - Setup info display */}
            <div className="bg-muted/30 border-r-2 border-gold/20 p-8 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="mb-8 greek-key-bottom pb-6">
                  <h3 className="text-3xl font-cinzel font-bold text-bronze-dark mb-2">
                    {userName}
                  </h3>
                  <p className="text-xl text-muted-foreground font-crimson">
                    Age {userAge}
                  </p>
                </div>
                
                <div className="space-y-6 text-left">
                  <blockquote className="border-l-4 border-gold pl-4 py-2">
                    <p className="font-crimson text-lg italic text-foreground">
                      "The only true wisdom is in knowing you know nothing."
                    </p>
                    <footer className="text-sm text-bronze mt-2 font-cinzel">
                      — Socrates
                    </footer>
                  </blockquote>
                  
                  <blockquote className="border-l-4 border-bronze pl-4 py-2">
                    <p className="font-crimson text-lg italic text-foreground">
                      "To find yourself, think for yourself."
                    </p>
                    <footer className="text-sm text-bronze mt-2 font-cinzel">
                      — Socrates
                    </footer>
                  </blockquote>
                  
                  <blockquote className="border-l-4 border-gold pl-4 py-2">
                    <p className="font-crimson text-lg italic text-foreground">
                      "An unexamined life is not worth living."
                    </p>
                    <footer className="text-sm text-bronze mt-2 font-cinzel">
                      — Socrates
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
            
            {/* Right panel - Chat */}
            <div className="h-[calc(100vh-180px)]">
              <ChatPanel userName={userName} userAge={userAge} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
