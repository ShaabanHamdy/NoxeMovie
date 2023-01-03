import axios from "axios";
import joi from "joi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  // ----------------useState-----------------------------------------------------------
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    age: "",
    password: "",
  });

  // ---------ErorrMessage----------------------------------------------------------
  const [erorrMeg, setErorrMeg] = useState("");
  const [erorrList, seterorrList] = useState([]);
  const [loading, setLoading] = useState(false);
  // ---------submitData----------------------------------------------------------
  let submitData = async (e) => {
  
    showaleart();
    e.preventDefault();
    setLoading(true);
    let validationResponse = validateFormData();
     
    if (validationResponse.error) {
       
      seterorrList(validationResponse.error.details);
   
    }
    
    else {
   
      let { data } = await axios.post(
        "https://sticky-note-fe.vercel.app/signup",
        
        user
      );
      
      if (data.message === "success") {
        goToLogin();
      } else {
        setErorrMeg(data.message);
      }
      
    }
    setLoading(false); 
  };
  // ------------------------useNavigate-----------------------
  let navigate = useNavigate();
  let goToLogin = () => {
    navigate("/login");
  };
  // -------------getInPutValue------------------------------------------------------------
  let getInPutValue = (e) => {
    let myUser = { ...user };
    myUser[e.target.name] = e.target.value;
    setUser(myUser);
  };
  // ------------------Validation Form---------------------------------------------------------------
  let validateFormData = () => {
    const schema = joi.object({
      first_name: joi.string().alphanum().required().min(2).max(10),
      last_name: joi.string().alphanum().required().min(2).max(10),
      age: joi.number().required().min(20).max(80),
      email: joi
        .string()
        .email({ tlds: { allow: ["com", "net"] } })
        .required(),
      password: joi
        .string()
        .required()
        
    });
    return schema.validate(user, { abortEarly: false });
  };

  let showaleart = (proms) => {
    let x = erorrList.filter((er) => er.message.includes(proms));
    if (x[0] !== undefined) {
      return <div className="alert bg-danger p-1 ">{x[0].message}</div>;
    } else {
      return "";
    }
  };

  // -------------------------------------------------------------------------------------------------
  return (
    <>
      <div className=" w-75 m-auto mt-5 p-5">
        <h2 className="Registeration">Registeration form</h2>

        {erorrMeg ? (
          <div className="alert alert-danger p-2">{erorrMeg.slice(26)}</div>
        ) : (
          ""
        )}
        <form onSubmit={submitData}>
          <div>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              className=" form-control mb-2 "
              name="first_name"
              onChange={getInPutValue}
            />
          </div>

          {erorrMeg ? (''):  (showaleart("first_name"))} 
          <div>
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              className=" form-control mb-2 "
              name="last_name"
              onChange={getInPutValue}
            />
          </div>
        
          {erorrMeg ? (''):  (showaleart("last_name"))} 
          <div>
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              className=" form-control mb-2 "
              name="age"
              onChange={getInPutValue}
            />
          </div>
          
          {erorrMeg ? (''):  (showaleart("age"))} 
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className=" form-control mb-2"
              name="email"
              onChange={getInPutValue}
            />
          </div>
          
          {erorrMeg ? (''):  (showaleart("email"))} 
          <div>
          
            <label htmlFor="password">Password:</label>
            <input
              type="Password"
              className="mb-2 form-control rNput"
              name="password"
              onChange={getInPutValue}
            />
          </div>
          
          {erorrMeg ? (''):  (showaleart("password"))} 
          {loading?

(<button className=" btn btn-info mt-3 float-end">
<i className="fas fa-spinner fa-spin"></i> </button>)
:

(<button className="RegisterBtn btn btn-info mt-3 float-end">
Register</button>)

}
          <div className="clearfix"></div>
        </form>
      </div>
    </>
  );
}
