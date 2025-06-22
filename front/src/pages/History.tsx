import HistoryTable from '../components/History';
import Navbar from '../components/Navbar';



const History = () => {
  return (<>
  
  <Navbar/>
  <div className="flex flex-col min-h-screen bg-white bg-cover bg-center bg-gradient-to-b from-[#7a422c]/80 to-white">
<div>
<h1 className="font-playfair italic text-3xl font-bold text-center mt-30 mb-5 text-white! z-20">
    Your History</h1>
  
  </div>
  <div className="mt-10 min-h-screen py-10 px-4">
     
<HistoryTable/>
    </div>
    </div>
  </>
  
  );
};

export default History;
