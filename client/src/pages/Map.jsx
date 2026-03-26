import { Box} from '@mui/material';
import Header from '../Components/Header';
import GeoMap from '../Components/GeoMap';
import { Link } from 'react-router-dom';

const Map = () => {
    return (
        <Box sx={{width: 1200, height: 700}} m='10px'>
        <Header title="Map Chart" subtitle="By Country" />            
        <Box mt="-10px" height="75vh">            
        <GeoMap />
        <h5 className="left" style={{marginLeft: '0.4rem', color: 'black'}}>{<Link className="link" to="/audios">Back</Link>}</h5>
        </Box>
    </Box>
    )

}

export default Map; 