"use client";

import { useEffect, useState, useRef } from "react";
import { useWeb3 } from "@/context/web3.provide.context";
import { Container, Typography, Box, Snackbar, Alert, CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ALLOWED_ACCOUNT = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const Home = () => {
  const { account, connect, isConnected } = useWeb3();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessGranted, setAccessGranted] = useState<boolean>(false); // Estado para controlar el acceso
  const hasAccessRef = useRef<boolean>(false);

  // Función que valida la cuenta y actualiza los estados
  const validateAccount = (account : string | null) => {
    if (!account || account.length === 0) {
      setError("MetaMask is locked or not connected");
      setAccessGranted(false);
      return;
    }
    // const userAddress = accounts[0];
    // console.log("✅ Cuenta recibida:", userAddress);
    // setAccount(userAddress);

    if (account.toLowerCase() === ALLOWED_ACCOUNT.toLowerCase()) {
      setError(null);
      setAccessGranted(true); // Acceso concedido
      if (!hasAccessRef.current) {
        setSuccessMessage("Access Granted for System Manager");
        hasAccessRef.current = true;
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } else {
      setError("Access forbidden for this user, change MetaMask account");
      setAccessGranted(false); // Acceso denegado
      hasAccessRef.current = false;
    }
  };

  // Función de login con MetaMask
  const handleLogin = async () => {
    connect();
    if (isConnected) {
      try {
        validateAccount(account);
      } catch (err) {
        setError("Error connecting to MetaMask");
      }
    } else {
      setError("MetaMask is not installed");
    }
  };

  // useEffect(() => {
  //   // Verifica la cuenta al montar el componente
  //   const checkAccount = async () => {
  //     if (window.ethereum) {
  //       try {
  //         const accounts: string[] = await window.ethereum.request({ method: "eth_accounts" });
  //         console.log("🔄 Cuenta al montar:", accounts);  // Log para ver la cuenta en el montaje
  //         validateAccount(account);
  //         setLoading(false);
  //       } catch (error) {
  //         setError("Error fetching accounts");
  //         setLoading(false);
  //       }
  //     } else {
  //       setLoading(false);
  //     }
  //   };

  //   checkAccount(); // Verificamos la cuenta al cargar

  //   // Listener para cambios en la cuenta
  //   const handleAccountsChanged = (accounts: string[]) => {
  //     console.log("🔄 Cuentas cambiaron:", accounts);  // Log para verificar si cambia la cuenta
  //     validateAccount(account);
  //   };

  //   if (window.ethereum) {
  //     window.ethereum.on("accountsChanged", handleAccountsChanged);
  //   }

  //   return () => {
  //     if (window.ethereum) {
  //       window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
  //     }
  //   };
  // }, []);

  useEffect(() => {
    if(isConnected) {
      try {
        validateAccount(account)
        setLoading(false)
      } catch (error) {
        setError("Error fetching accounts");
        setLoading(false);
      }
    } else {
        setLoading(false)
    }
  }, [isConnected])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ "& *:focus": { outline: "none" } }}>
      {/* Título Centrado */}
      <Container sx={{ textAlign: "center", py: 5 }} tabIndex={-1}>
        <Typography variant="h2" fontWeight="bold" tabIndex={-1}>
          Mobile Phone Traceability
        </Typography>
      </Container>

      {/* Navbar siempre visible */}
      <Navbar onLogin={handleLogin} accessGranted={accessGranted} />

      {successMessage && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open
          autoHideDuration={3000}
          onClose={() => setSuccessMessage(null)}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            {successMessage}
          </Alert>
        </Snackbar>
      )}

      {error && (
        <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open>
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      )}

      <Footer />
    </Box>
  );
};

export default Home;
