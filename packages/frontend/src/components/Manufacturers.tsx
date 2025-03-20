// frontend/src/components/Manufacturers.tsx
import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';

const Manufacturers = () => {
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the manufacturers data
    const fetchManufacturers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/getUsersByRole/manufacturer');
        if (response.data.data && response.data.data.length > 0) {
          setManufacturers(response.data.data);
        } else {
          setError('No manufacturers found.');
        }
      } catch (err) {
        setError('Failed to fetch manufacturers.');
      } finally {
        setLoading(false);
      }
    };

    fetchManufacturers();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', padding: 2 }}>
        <Typography variant="h6">Loading manufacturers...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Manufacturers
      </Typography>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ethereum Address</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {manufacturers.map((manufacturer, index) => (
                <TableRow key={index}>
                  <TableCell>{manufacturer.ethereumAddress}</TableCell>
                  <TableCell>{manufacturer.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Manufacturers;
