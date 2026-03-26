import React from 'react';
import { Navigate } from 'react-router-dom';

const Add = () => {
  return <Navigate to="/?new=1" replace />;
};

export default Add;
