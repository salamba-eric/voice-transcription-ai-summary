import '../styles/Settings.css'
import { create_department, get_departments, join_department, get_department_details } from '../api/departments';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { get_employee_details, get_my_departments, list_all_employees } from '../api/staff_data';

const DepartmentPage = () => {
    const navigate = useNavigate()
    const [newDepartment, setNewDepartment] = useState(false);
    const [joinDepartment, setJoinDepartment] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedMember, setSelectedMember] = useState('')
    const [allEmployees, setAllEmployees] = useState([])
    const [createdValue, setCreatedValue] = useState('');
    const [myDepartments, setMyDepartments] = useState([]);
    const [departmentDetails, setDepartmentDetails] = useState([]);
    const [departmentMembers, setDepartmentMembers] = useState([]);
    const [addingMember, setAddingMember] = useState(false)

    let departments_lookup = false

    useEffect(() => {
    async function getMyDepartments(){
        const response = await get_my_departments();
        console.log(response)
        setMyDepartments(response);
    }; getMyDepartments();
    }, [departments_lookup])

    async function getDepartments (){
        setJoinDepartment(!joinDepartment);
        if (!departments_lookup){
            const response = await get_departments();
            console.log(response)
            setDepartments(response);
            departments_lookup = true
        }
    }

    async function get_all_employees(){
        if (allEmployees.length === 0){
            const response = await list_all_employees()
            console.log(response)
            setAllEmployees(response)
        }
    }
    async function getDepartmentDetails(department_id) {
        setShowDetails(!showDetails);
        try {
            const response = await get_department_details(department_id);
            setDepartmentDetails(response); // Set department details first

            const employeeDetails = await Promise.all(
            response.employees.map(async (member) => {
                return await get_employee_details(member);
            })
            );
            setDepartmentMembers(employeeDetails);

        } catch (error) {
            console.error("Error fetching department details:", error);
        }
        console.log(departmentMembers)
    }

    async function createDepartment (){
        console.log(createdValue)
        const response = await create_department(createdValue);
        setNewDepartment(!newDepartment);
        departments_lookup = false

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
        if (addingMember) setSelectedMember(value)
        else { setSelectedValue(value); }
    }

    async function handle_invite(department_id){
        try{
            const response = await join_department(department_id, selectedMember)
            console.log(response)
        } catch (error){}

    }
    async function requestDepartmentJoin() {
        const response = await join_department(selectedValue, null);
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

            {showDetails && (
                <div className='modal-overlay' onClick={() => setShowDetails(false)}>
                    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                        <h4> {departmentDetails.name} : Group Details </h4>
                        {departmentMembers.length > 0 && departmentMembers.map((member, index) => (
                            <div key={index} style={{padding: '10px', margin: '10px', borderRadius: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '90%', border: '1px solid'}}>
                                <p>Name: {member[index].user.username}</p>
                                <p key={index}>Role: {member.role === ""? member.role: "Default"}</p>
                                <button className='danger-btn'> Remove Member </button>
                            </div>
                        ))}
                        {addingMember && (
                            <div style={{ display: 'flex', width: '100%', margin: '7px' }}>
                                <select
                                    style={{ width: '80%', padding: '8px', borderRadius: '10px', marginLeft: '10%' }}
                                    value={selectedMember}
                                    onChange={(e) => handleChange(e)}
                                >
                                    <option value="">Select a colleague</option>
                                    {allEmployees
                                        .filter((employee) => {
                                            const isInDepartment = departmentDetails.employees.some(
                                                (deptEmployee) => deptEmployee.toString() === employee.id.toString()
                                                );
                                                return !isInDepartment;
                                        })
                                        .map((employee) => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.user.username}
                                            </option>
                                        ))}
                                </select>
                                <button style={{ margin: '7px' }} onClick={() => {handle_invite(departmentDetails.id); setAddingMember(!addingMember)}}> Invite </button>
                            </div>
                        )}
                        <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
                            <button className='new-item-button' onClick={() => {setAddingMember(!addingMember); get_all_employees();}}> {addingMember? "Cancel":  "Add Member"} </button>
                            <button className= "new-item-button" style={{alignSelf: "center"}} onClick={() => {setShowDetails(!showDetails); setAddingMember(false)}}> Close </button>
                        </div>
                    </div>
                </div>
            )}
                

            <div className='settings-section'>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <div className="back-button" onClick={() => { navigate('/home')}}>◀</div>
                    <h3> My groups </h3>
                </div>
                {myDepartments.map((department) => (
                    <div key={department.id} className="department-card" onClick={() => {getDepartmentDetails(department.id)}}>
                        <h4>{department.name}</h4>
                        {departmentMembers.length > 0 && departmentMembers.map((member, index) => (
                            <p key={index}>Role: {department.creator === member.id? "Default": "Creator"}</p>
                        ))}

                    </div>
                ))}
                <div style={{display: 'flex'}}>
                    <button className= "new-item-button" style={{alignSelf: "center"}} onClick={getDepartments}>Join Group</button>
                    <button className= "new-item-button" style={{alignSelf: "center"}} onClick={() => {setNewDepartment(!newDepartment)}}>Create New Group</button>
                </div>
            </div>
        </div>
    );
}

export default DepartmentPage;