
import { useState } from "react";
import "../pagesStyles/UpdateChannel.css";
import { updateAccountDetails } from "../utils/auth";

const UpdateChannel = () => {

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");

    const updateAccount = async() =>{

      try {

        const res = await updateAccountDetails();
        console.log(res);
        
      } catch (error) {
        console.log("update error", error)
      }

    }

  return (
    <div className="update-channel">

      <h2 className="page-title">Customize Channel</h2>

      {/* COVER IMAGE */}

      <div className="cover-section">
        <div className="cover-preview">
          {/* cover image preview */}

        </div>


        <button className="change-btn">Change Cover</button>
      </div>

      {/* AVATAR + FORM */}
      <div className="channel-form">

        <div className="avatar-section">
          <div className="avatar-preview">
            {/* avatar preview */}

          </div>
          <button className="change-btn">Change Avatar</button>
        </div>

        <div className="form-fields">
          <label>
            Channel Title
            <input type="text" value={fullname} placeholder="Enter channel title" onChange={(e)=>setFullname(e.target.value)} />
          </label>

          <label>
            Description
            <textarea placeholder="Tell viewers about your channel" value={email}  onChange={(e)=>setEmail(e.target.value)}/>
          </label>

          <div className="form-actions">
            <button className="btn cancel" >Cancel</button>
            <button className="btn save" onClick={updateAccount}>Save Changes</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UpdateChannel;
