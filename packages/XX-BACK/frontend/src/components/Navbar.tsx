import { useState } from "react";
import { 
  AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem, Dialog, DialogContent, 
  DialogActions, Button, TextField 
} from "@mui/material";
import { Factory, Storefront, PhoneIphone, Warehouse, PersonOutline, Add } from "@mui/icons-material";
import Manufacturers from "./Manufacturers";

const Navbar = ({ account, onLogin, accessGranted }: { account: string | null, onLogin: () => void, accessGranted: boolean }) => {
  const [showManufacturers, setShowManufacturers] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [entityId, setEntityId] = useState("");
  const [entityType, setEntityType] = useState<"Manufacturer" | "Provider" | "Retailer" | "Customer" | "Device">("Manufacturer");

  const handleMetaMaskClick = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("Cuentas obtenidas:", accounts);

        if (accounts && accounts.length > 0) {
          onLogin();
        }
      } catch (error) {
        console.error("Error al conectar con MetaMask:", error);
      }
    } else {
      alert("MetaMask no está instalado.");
    }
  };

  // Manejo del menú desplegable
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Manejo del diálogo de entidad
  const handleOpenDialog = (type: "Manufacturer" | "Provider" | "Retailer" | "Customer" | "Device") => {
    setEntityType(type);
    setDialogOpen(true);
    handleCloseMenu(); // Cierra el menú desplegable al abrir el diálogo
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setWalletAddress(""); 
    setEntityId(""); // Resetea los campos al cerrar
  };

  const handleAddEntity = () => {
    console.log(`Adding ${entityType}:`, { entityId, walletAddress });
    // Aquí puedes manejar la lógica para agregar la entidad correspondiente
    handleCloseDialog();
  };

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#7396FF", userSelect: "none" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>System Manager</Typography>

          {!accessGranted ? (
            <IconButton color="inherit" onClick={handleMetaMaskClick}>
              <img src="/images/metamask.svg" alt="MetaMask" style={{ width: 30, height: 30 }} />
            </IconButton>
          ) : (
            <Box display="flex">
              <IconButton color="inherit" title="Add" onClick={handleOpenMenu}>
                <Add />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem onClick={() => handleOpenDialog("Manufacturer")}>Manufacturer</MenuItem>
                <MenuItem onClick={() => handleOpenDialog("Provider")}>Provider</MenuItem>
                <MenuItem onClick={() => handleOpenDialog("Retailer")}>Retailer</MenuItem>
                <MenuItem onClick={() => handleOpenDialog("Customer")}>Customer</MenuItem>
                <MenuItem onClick={() => handleOpenDialog("Device")}>Device</MenuItem>
              </Menu>

              <IconButton color="inherit" title="Manufacturers" onClick={() => setShowManufacturers(!showManufacturers)}>
                <Factory />
              </IconButton>
              <IconButton color="inherit" title="Distributors">
                <Warehouse />
              </IconButton>
              <IconButton color="inherit" title="Retailers">
                <Storefront />
              </IconButton>
              <IconButton color="inherit" title="Customers">
                <PersonOutline />
              </IconButton>
              <IconButton color="inherit" title="Devices">
                <PhoneIphone />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mostrar el componente de Manufacturers si está seleccionado */}
      {showManufacturers && <Manufacturers />}

      {/* Diálogo para agregar entidad */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogContent sx={{ padding: "20px", minWidth: "350px" }}>
          <TextField
            autoFocus
            margin="dense"
            label={`${entityType} ID`}
            type="text"
            fullWidth
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Ethereum Wallet Address"
            type="text"
            fullWidth
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x1234567890abcdef1234567890abcdef12345678"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingBottom: "16px" }}>
          <Button onClick={handleCloseDialog} sx={{ color: "#FF4C4C", textTransform: "none" }}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddEntity} 
            sx={{ 
              backgroundColor: "#4CAF50", 
              color: "white", 
              textTransform: "none", 
              "&:hover": { backgroundColor: "#388E3C" } 
            }}
          >
            Add {entityType}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
