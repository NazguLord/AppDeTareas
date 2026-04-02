import React from 'react';
import { Box, Paper } from "@mui/material";
import Header from "../Components/Header";
import BootlegForm from "../Components/BootlegForm";
import "../Components/BootlegCreateModal.scss";

const Form = () => {
  return (
    <Box className="bootleg-form-shell">
      <Header title="Crear Bootleg" subtitle="Ingrese los datos" />
      <Paper elevation={0} className="bootleg-form-shell-card">
        <BootlegForm submitLabel="Crear bootleg" />
      </Paper>
    </Box>
  );
}

export default Form;
