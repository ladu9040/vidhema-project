import React from 'react';
import Header from '../components/Header';

function Home() {
  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4  overflow-hidden">
        
        <div className="text-center max-w-4xl mx-auto ">
          <div className='h-full w-full  opacity-10 relative'>
          <img src="/vidhema.png " alt="" className=' scale-[5] absolute' />
          </div>
       
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Vidhema
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-8">
            User Management System
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your user administration with our comprehensive management solution
          </p>
        </div>
      </div>
    </>

  );
}

export default Home;