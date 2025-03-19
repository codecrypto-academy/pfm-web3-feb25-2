import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#f5f5f5',
        py: 3,
        textAlign: 'center',
        marginTop: 'auto',
      }}
    >
      <Typography variant="body2">
        <Link href="#" color="inherit" sx={{ mx: 2 }}>
          Acerca de nosotros
        </Link>
        <Link href="#" color="inherit" sx={{ mx: 2 }}>
          Política de Privacidad
        </Link>
        <Link href="#" color="inherit" sx={{ mx: 2 }}>
          Contacto
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;

