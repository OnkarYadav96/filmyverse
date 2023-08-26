import React, { useState,useEffect } from 'react'
import { TailSpin } from 'react-loader-spinner'
import ReactStars from "react-stars"
import {getDocs} from 'firebase/firestore'
import {moviesRef} from '../firebase/firebase'
import {Link} from 'react-router-dom'

const Cards = () => {
    const [data, setData] = useState([])
    const [loading,setLoading]=useState(false)
    useEffect(()=>{
        async function getData(){
          setLoading(true)
            const _data=await getDocs(moviesRef);
            _data.forEach((doc)=>{
                setData((prev)=>[...prev,{...(doc.data()),id:doc.id}] )
            })
          setLoading(false);
        }
        getData();
    },[])
    return (
       <div className='flex flex-wrap justify-between px-3 mt-2'>
        {loading?<div className=' w-full flex justify-center items-center h-96'><TailSpin height={40} color="white"/></div>:
            data.map((element, index) => {
                return (
                    <Link to={`/details/${element.id}`}>   <div key={index} className='card font-medium shadow-lg p-2 hover:-translate-y-3 cursor-pointer  mt-6 transition-all duration-500'>
                        <img className='h-60 md:h-72' src={element.image} alt="" />
                        <h1> {element.title}</h1>
                        <h1 className="flex items-center"><span className='text-gray-500 mr-1'>Rating:</span> 
                        <ReactStars size={20} half={true} value= {element.rating/element.rated} edit={false}/></h1>
                        <h1><span className='text-gray-500'>Year:</span>  {element.year}</h1>
                    </div> </Link>
                )
            }
            )
        }
        </div>
       
    )
}

export default Cards