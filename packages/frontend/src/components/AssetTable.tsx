// frontend/src/components/assetTables.tsx
import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';

const AssetTable = ({ navFilter } : { navFilter : string | null}) => {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the assets data
    const fetchAssets = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/admin/getUsersByRole/${navFilter}`);
        if (response.data.data && response.data.data.length > 0) {
          setAssets(response.data.data);
        } else {
          setError(`No ${navFilter}s  found`);
        }
      } catch (err) {
        console.log(err)
        setError(`Failed to fetch ${navFilter}s`);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [navFilter]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', padding: 2 }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        {navFilter && `${navFilter.charAt(0).toLocaleUpperCase + navFilter?.slice(1)}s`} str.charAt(0).toUpperCase() + str.slice(1)
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
              {assets.map((asset, index) => (
                <TableRow key={index}>
                  <TableCell>{asset.ethereumAddress}</TableCell>
                  <TableCell>{asset.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AssetTable;
