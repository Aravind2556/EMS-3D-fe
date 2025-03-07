import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DContext } from '../../context/Datacontext'

function UserDetails() {

    const {id} = useParams()
    const {users} = useContext(DContext)
    const [user, setUser] = useState(null)

    useEffect(()=>{
        if(id && users){
            if(users.length>0){
                const fetchUser = users.find(User=>User.Id===Number(id))
                if(fetchUser){
                    setUser(fetchUser)
                }
                else{
                    setUser({})
                }
            }
            else{
                setUser({})
            }
        }
    },[id, users])

    console.log("user:", user)
  // Helper to check if user object is empty
  const isEmpty = (obj) => obj && Object.keys(obj).length === 0;

  return (
    <div className="container mt-4">
      {user === null ? (
        <div className="text-center">Loading...</div>
      ) : isEmpty(user) ? (
        <div className="alert alert-warning">User not found</div>
      ) : (
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h3 className="card-title mb-0">User Details</h3>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Name:</strong>
                <p>{user.Name}</p>
              </div>
              <div className="col-md-6">
                <strong>Email:</strong>
                <p>{user.Email}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Contact:</strong>
                <p>{user.Contact}</p>
              </div>
              <div className="col-md-6">
                <strong>Role:</strong>
                <p>{user.Role}</p>
              </div>
            </div>
            {user.Role!=="Admin" && 
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>User ID:</strong>
                <p>{user.userid}</p>
              </div>
              <div className="col-md-6">
                <strong>Devices:</strong>
                <div className='d-flex flex-wrap justify-content-start align-items-center gap-2'>
                    {user.devices&&user.devices.map((device, i)=>(
                        <a className='text-dark' href={`/Chart-data/${device}`}>{device}</a>
                    ))}
                </div>
              </div>
            </div>}
            <div className="row">
              <div className="col-md-6">
                <strong>Created At:</strong>
                <p>{new Date(user.createdAt).toLocaleString()}</p>
              </div>
              <div className="col-md-6">
                <strong>Updated At:</strong>
                <p>{new Date(user.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetails