
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import {  useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import api from '../api';

const PieChart = () => {
const theme = useTheme();
const colors = tokens(theme.palette.mode);
const [data, setData] =  useState([]);
//const [total, setTotal] = useState(0); 

useEffect(() => { 
  const fetchAllData = async () =>{
      try {
          const res = await api.get(`/audios`);
          const bootlegs = res.data;
          // Contar la cantidad de bootlegs en cada categoría
          const categoryCounts = {};
          bootlegs.forEach((bootleg) => {
            const tipo = bootleg.tipo;
            if (tipo in categoryCounts) {
              categoryCounts[tipo]++;
            } else {
              categoryCounts[tipo] = 1;
            }
          });  
          // Convertir los datos en el formato requerido para el pie chart
          const pieChartData = Object.keys(categoryCounts).map((tipo) => ({
            id: tipo,
            label: tipo,
            value: categoryCounts[tipo],            
          }));
  
          //const totalValue = pieChartData.reduce((acc, curr) => acc + curr.value, 0);
         // setTotal(totalValue);
           //console.log("Total",total)
          setData(pieChartData);

      } catch (error) {
          console.log(error);
      }
  }
  fetchAllData();
}, []);

const formatteData = data;
console.log('FormattData Es:', formatteData);

    return(     
    
    <ResponsivePie
        data={formatteData}
        colors={{ scheme: 'dark2' }}        
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
          tooltip: {
            container: {
              color: theme.palette.primary.main,
            },
          },
        }}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}        
        radialLabelsTextXOffset={15}
        radialLabelsLinkOffset={0}
        activeOuterRadiusOffset={8}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabel={d => `${d.id} (${d.formattedValue})`}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={colors.grey[100]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        enableArcLabels={true}
        arcLabelsRadiusOffset={0.4}
        arcLabelsSkipAngle={7}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />     
    );   
};


export default PieChart;