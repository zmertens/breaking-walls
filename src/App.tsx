import React, { useEffect, useState, Suspense } from "react";
import { useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import { Box, CircularProgress } from "@mui/material";

function App() {
  const [isDomAvailable, setIsDomAvailable] = useState(false);
  const { isLoading } = useAuth();

  useEffect(() => {
    setIsDomAvailable(true);
  }, []);

  const DynamicComponent = React.lazy(() =>
    isDomAvailable
      ? import("./components/BreakingWalls.tsx")
      : Promise.resolve({ default: () => <div /> })
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      }>
        {isDomAvailable && <DynamicComponent />}
      </Suspense>
    </>
  );
}

export default App;
