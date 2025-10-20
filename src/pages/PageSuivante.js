import { useNavigate } from 'react-router-dom';

const MonComposant = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log('Commencer');
    navigate('./PageSuivante'); // Utilisation d'un chemin relatif
  };

  return (
    <Button
      className="bg-csiblue hover:bg-csiblue-dark text-white px-8 py-6 text-lg"
      onClick={handleClick}
    >
      Commencer
    </Button>
  );
};

export default MonComposant;

