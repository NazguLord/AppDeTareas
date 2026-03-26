import React, { useEffect, useState } from 'react';
import api from '../api';

const Total = ({ total: totalProp }) => {
  const [totalState, setTotalState] = useState(totalProp || '0.00');

  useEffect(() => {
    if (typeof totalProp !== 'undefined') {
      setTotalState(totalProp || '0.00');
      return;
    }

    const fetchAllTotales = async () => {
      try {
        const res = await api.get('/total');
        setTotalState(res.data?.[0]?.Total || '0.00');
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllTotales();
  }, [totalProp]);

  return (
    <div className="total-card">
      <span className="total-label">Balance actual</span>
      <strong className="total-value">$ {totalState}</strong>
      <p className="total-copy">Total acumulado calculado desde tus registros de tareas.</p>
    </div>
  );
};

export default Total;
