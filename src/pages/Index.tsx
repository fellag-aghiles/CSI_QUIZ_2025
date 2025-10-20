
import { useState, useEffect } from 'react';
import Background3D from '@/components/Background3D';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un temps de chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-transparent text-white">
      <Background3D />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80 z-0"></div>
      
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 animate-spin rounded-full border-t-4 border-csiblue"></div>
            <p className="mt-4 text-csiblue">Chargement...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-3xl w-full text-center">
            <div className="relative">
              <img 
                src="https://i.postimg.cc/qRwn6k1M/csi2.png" 
                alt="CSI Quiz Logo" 
                className="w-48 h-48 mb-6 animate-float"
              />
              <div className="absolute inset-0 bg-csiblue/20 rounded-full blur-xl animate-pulse-light -z-10"></div>
            </div>
            
            <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-white to-csiblue bg-clip-text text-transparent">
              CSI Quizz
            </h1>
            
            <p className="text-xl text-white mb-8 max-w-lg">
              La plateforme interactive où la connaissance rencontre la technologie.
              Testez vos compétences et votre esprit d'analyse à travers des quiz stimulants.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
            <a href="./index.html">
  <Button 
    className="bg-csiblue hover:bg-csiblue-dark text-white px-8 py-6 text-lg"
    onClick={() => console.log('Commencer')}
  >
    Commencer
  </Button>
</a>


            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

