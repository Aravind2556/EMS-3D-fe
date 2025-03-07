import React, { useContext, useEffect, useState } from 'react'
import Loading from '../Loading';
import { DContext } from '../../context/Datacontext';

export const UserInfo = () => {

    const {users} = useContext(DContext)



    if(users===null){
      return <Loading/>
    }

    console.log("users:",users)

  return (
    <div style={{minHeight: '80vh'}}>
          <h2 className='text-center my-3 fw-bolder'>Users List</h2>
            {/* Device Table */}
          <div className="table-responsive mx-auto col-12 col-md-10 col-lg-8 my-2">
          <table className="table table-bordered text-center">
            <thead className="table-primary">
              <tr>
                <th>Sl. No</th>
                <th>Assigned Devices</th>
                <th>User ID</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.deviceId}>
                    <td>{index + 1}</td>
                    <td>{user.devices?user.devices.length:0}</td>
                    <td>{user.userid||"-"}</td>
                    <td>{user.Name}</td>
                    <td><i className='bi bi-eye fs-5 mx-2' onClick={() => window.location.href=`/user/${user.Id}`} role='button'></i></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5 text-center">No Devices Available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    </div>
  )
}
