import * as Font from "expo-font";
import { useEffect, useState } from "react";

export function useAssetPreload() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // no-op
        await Font.loadAsync({
          // no-op
        });

        const cacheImages = [];

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
