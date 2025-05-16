import '../styles/Settings.css'
import { useNavigate } from 'react-router-dom';
const DepartmentPage = () => {
    const navigate = useNavigate()
    return (
        <div style={{width: '90%', justifySelf: 'center', marginTop: '20px'}}>
            <div className='settings-section'>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <div className="back-button" onClick={() => { navigate('/home')}}>{"<"}</div>
                    <h3> My groups </h3>

                </div>
                <div style={{display: 'flex'}}>
                    <button className= "new-item-button" style={{alignSelf: "center"}}>Join Group</button>
                    <button className= "new-item-button" style={{alignSelf: "center"}}>Create New Group</button>
                </div>
            </div>
        </div>
    );
}

export default DepartmentPage;