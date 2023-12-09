// Card.js

import React from 'react';

const StratedyCard = ({ heading, description, apy }) => {
  return (
    <div className="bg-white rounded-md shadow-md p-4 my-8">
      <h2 className="m-8 text-xl font-bold mb-2">{heading}</h2>
      <p className="m-8 text-gray-700">{description}</p>
      <hr className="my-4" />

      <h2  className="m-8 text-lg font-light mb-2"> Projected APY</h2>
      <p className="m-8 text-gray-700">{apy}%</p>

      <hr className="my-4" />

        <div className='flex bg-slate-50'>
          <div className='m-8 w-1/2'>
            <h3 className='m-2 p-2'>Total token usage{}</h3>

            <h2 className='mx-2 p-2'>Total users</h2>


          </div>


            <div className='m-8 w-1/2'>
                <h3 className='m-2 p-2'>Other Infos:{}</h3>

                <h2 className='mx-2 p-2'>extra details</h2>


             </div>

        </div>
    </div>
  );
};

export default StratedyCard;