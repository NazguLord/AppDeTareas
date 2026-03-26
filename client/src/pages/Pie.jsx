import { Box} from '@mui/material';
import Header from '../Components/Header';
import PieChart from '../Components/PieChart';
import { Link } from 'react-router-dom';

const Pie = () => {
    return (
        <Box sx={{width: 800, height: 700}} m='10px'>
            <Header title="Pie Chart" subtitle="By Category" />            
            <Box mt="30px" height="75vh">            
            <PieChart />
            <h5 className="left" style={{marginLeft: '0.4rem', color: 'black'}}>{<Link className="link" to="/audios">Back</Link>}</h5>
            </Box>
        </Box>
    )
}

export default Pie; 