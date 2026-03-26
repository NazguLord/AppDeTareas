
import { ResponsiveChoropleth } from '@nivo/geo';
//import { tokens } from "../theme";
import {  Box, useTheme,  } from "@mui/material";
import {useState, useEffect } from 'react';
import { geoData } from '../state/geoData';
import api from '../api';
import { countryToAlpha3  } from "country-to-iso";


const GeoMap = () => {
 const theme = useTheme();
 //const colors = tokens(theme.palette.mode);
 const [data, setData] =  useState([]);


console.log(geoData);
 useEffect(() => {
    const fetchAllAudios = async () => {
      try {
        const res = await api.get('/audios');
        // Mapea tus datos para obtener solo el país a partir de la propiedad 'lugar'
        const lugares = res.data; 
        const countryCount  = {};
        lugares.forEach(item => {
            const lugarParts = item.lugar.split(', ');
            const pais = countryToAlpha3(lugarParts[lugarParts.length - 1]);            
            // Incrementa el recuento del país correspondiente
            if (countryCount[pais]) {
                countryCount[pais]++;
            } else {
                countryCount[pais] = 1;
            }
          });
          const mappedData = Object.keys(countryCount).map(id => ({
            id,
            value: countryCount[id],
          }));
  
          setData(mappedData);
          console.log('mappedData:', mappedData)
          console.log(res);    
        
       
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllAudios();
  }, []);

  const formatData = data; 
  console.log("FormatData",data)

 return (
     <Box m="1.5rem 2.5rem">
      
      <Box
        mt="40px"
        height="75vh"
        border={`1px solid ${theme.palette.secondary[200]}`}
        borderRadius="4px"
      >
        {data ? (
          <ResponsiveChoropleth
            data={formatData}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: theme.palette.secondary[200],
                  },
                },
                legend: {
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
                ticks: {
                  line: {
                    stroke: theme.palette.secondary[200],
                    strokeWidth: 1,
                  },
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
              },
              legends: {
                text: {
                  fill: theme.palette.secondary[200],
                },
              },
              tooltip: {
                container: {
                  color: theme.palette.primary.main,
                },
              },
            }}
            features={geoData.features}
            margin={{ top: 0, right: 0, bottom: 0, left: -50 }}
            domain={[0, 20]}
            unknownColor="#666666"
            label="properties.name"
            valueFormat=".2s"
            projectionScale={120}
            projectionTranslation={[0.45, 0.6]}
            projectionRotation={[0, 0, 0]}
            borderWidth={1.3}
            borderColor="#ffffff"
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: true,
                translateX: 50,
                translateY: -45,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: theme.palette.secondary[200],
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: theme.palette.background.alt,
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        ) : (
          <>Loading...</>
        )}
      </Box>
    </Box>
  )
}

export default GeoMap