import * as Font from "expo-font";
import { useEffect, useState } from "react";

export function useAssetPreload() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Pré-carregar fontes se necessário
        await Font.loadAsync({
          // Adicione fontes customizadas aqui se houver
        });

        // Pré-carregar assets críticos
        const cacheImages = [];
        // Adicione imagens críticas aqui se necessário

        await Promise.all([...cacheImages]);
      } catch (e) {
        console.warn("Erro ao pré-carregar assets:", e);
      } finally {
        setIsReady(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isReady;
}
