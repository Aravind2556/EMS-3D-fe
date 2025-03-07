import React, { createContext, useEffect, useState } from 'react'

export const DContext = createContext()
function Datacontext(props) {
    const apiurl = process.env.REACT_APP_API_URL;

    const [Auth,setAuth]=useState(null)
    const [User,setUser]=useState(null)
    const [Device,setdevice]=useState(null)
    const [users, setUsers] = useState(null)

  



    useEffect(()=>{

      if(apiurl){

        fetch(`${apiurl}/fetch-users`,{
          method:"GET",
          credentials:'include'
        })
        .then(res=>res.json())
        .then(data=>{
          if(data.success === true){
            setUsers(data.users)
          }
          else{
              alert(data.message)
          }
        })
        .catch(err=>{
          console.log("error fetching in checkauth",err)
        })

        fetch(`${apiurl}/checkauth`,{
          method:"GET",
          credentials:'include'
        })
        .then(res=>res.json())
        .then(data=>{
          if(data.success === true){
            setAuth(data.user)
          }
          else{
            setAuth(false)
            console.log(data.messsage)
          }
        })
        .catch(err=>{
          console.log("error fetching in checkauth",err)
        })

        fetch(`${apiurl}/fetch-user`,{
          method:"GET",
          credentials:'include'
        })
        .then(res=>res.json())
        .then(data=>{
          if(data.success === true){
            setUser(data.user)
            
            
          }
          else{
            console.log(data.messsage)
          }
        })
        .catch(err=>{
          console.log("error fetching to username",err)
        })

        fetch(`${apiurl}/fetch-user-device`,{
          method:"GET",
          credentials:'include'
        })
        .then(res=>res.json())
        .then(data=>{
          if(data.success === true){
            setdevice(data.data)
            
            
            
          }
          else{
            console.log(data.messsage)
          }
        })
        .catch(err=>{
          console.log("error fetching to username",err)
        })

      }

    },[apiurl])
  



    const data = {Auth,setAuth,User,Device, users, apiurl}
return (
   

   
        <DContext.Provider value={data}>
            {props.children}
        </DContext.Provider>
  )
}

export default Datacontext
