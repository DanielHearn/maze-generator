import './App.css';
import MazeEditor from './MazeEditor'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <MazeEditor/>
      <ToastContainer 
        position={ 'top-left' }
        limit={3}
        autoClose={2500}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
    </div>
  );
}

export default App;
