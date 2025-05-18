import '../styles/Settings.css'
import { create_department, get_departments, join_department } from '../api/departments';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const DepartmentPage = () => {
    const navigate = useNavigate()
    const [newDepartment, setNewDepartment] = useState(false);
    const [joinDepartment, setJoinDepartment] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [createdValue, setCreatedValue] = useState('');

    let departments_lookup = false

    async function getDepartments (){
        setJoinDepartment(!joinDepartment);
        if (!departments_lookup){
            const response = await get_departments();
            console.log(response)
            setDepartments(response);
            departments_lookup = true
        }
    }

    async function createDepartment (){
        console.log(createdValue)
        const response = await create_department(createdValue);
        setNewDepartment(!newDepartment);

        if (response.status === 200) {
            return (
                <div className='modal-overlay' onClick={() => setNewDepartment(false)}>
                    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                        <h3> Group Created </h3>
                        <button className= "new-item-button" style={{alignSelf: "center"}} onClick={() => {setNewDepartment(!newDepartment)}}> Continue </button>
                    </div>
                </div>
            )
        } else {
            return (
                <div className='modal-overlay' onClick={() => setNewDepartment(false)}>
                    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                        <h3> Group Creation Failed </h3>
                        <button className= "new-item-button" style={{alignSelf: "center"}} onClick={() => {setNewDepartment(!newDepartment)}}> Continiue </button>
                    </div>
                </div>
            )
        }
            
    }

    const handleChange = (event) => {
        const { value } = event.target;
        setSelectedValue(value);
    }

    async function requestDepartmentJoin() {
        const response = await join_department(selectedValue);
        setJoinDepartment(!joinDepartment);

        if (response.status === 200) {
            return (
                <div className='modal-overlay' onClick={() => setJoinDepartment(false)}>
                    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                        <h3> Group Joined </h3>
                        <button className= "new-item-button" style={{alignSelf: "center"}} onClick={() => {setJoinDepartment(!joinDepartment)}}> Continue </button>
                    </div>
                </div>
            )
        } else {
            return (
                <div className='modal-overlay' onClick={() => setJoinDepartment(false)}>
                    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                        <h3> Group Joining Failed </h3>
                        <button className= "new-item-button" style={{alignSelf: "center"}} onClick={() => {setJoinDepartment(!joinDepartment)}}> Continiue </button>
                    </div>
                </div>
            )
        }
    }

    return (
        <div style={{width: '90%', justifySelf: 'center', marginTop: '20px'}}>
            {newDepartment && (
                <div className='modal-overlay' onClick={() => setNewDepartment(false)}>
                    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                        <h3> Create New Group </h3>
                      <input
                        style={{ width: '90%' }}
                        type="text"
                        placeholder="Group Name"
                        value={createdValue} // Bind the input's value to the state
                        onChange={(e) => setCreatedValue(e.target.value)} // Update state on input change
                        />
                        <div>
                            <button className= "new-item-button" style={{alignSelf: "center"}} onClick={createDepartment}> Create </button>
                            <button className= "cancel-button" style={{alignSelf: "center"}} onClick={() => {setNewDepartment(!newDepartment)}}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {joinDepartment && (
                <div className='modal-overlay' onClick={() => setJoinDepartment(false)}>
                    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                        <h3> Join Group </h3>
                        {departments.length > 0 ? (
                            <select
                                style={{ width: '90%', padding: '8px', borderRadius: '10px' }}
                                value={selectedValue}
                                onChange={(e) => handleChange(e)}
                            >
                                <option value="">Select a department</option> {/* Default option */}
                                {departments.map((department) => (
                                    <option key={department.id} value={department.id}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p>No departments found. You could start by creating one</p>
                        )}
                        <div>
                            <button className= "new-item-button" style={{alignSelf: "center"}} onClick={requestDepartmentJoin} disabled={!selectedValue}>Join</button>
                            <button className= "cancel-button" style={{alignSelf: "center"}} onClick={() => {setJoinDepartment(!joinDepartment)}}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
                

            <div className='settings-section'>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <div className="back-button" onClick={() => { navigate('/home')}}>{"<"}</div>
                    <h3> My groups </h3>

                </div>
                <div style={{display: 'flex'}}>
                    <button className= "new-item-button" style={{alignSelf: "center"}} onClick={getDepartments}>Join Group</button>
                    <button className= "new-item-button" style={{alignSelf: "center"}} onClick={() => {setNewDepartment(!newDepartment)}}>Create New Group</button>
                </div>
            </div>
        </div>
    );
}

export default DepartmentPage;