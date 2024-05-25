import { useNavigate } from 'react-router-dom';
import flag from '../assets/flag.png'

function Navbar() {

    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    }

    return (
        <div className="h-24 w-full fixed back custom-red flex items-center">
            <h1 className="text-4xl ml-10 hover:cursor-pointer" onClick={handleLogoClick}>DeutschLearn</h1>
            <img src={flag} className="ml-4"/>
        </div>
    );
}

export default Navbar;