import axios from "axios";
import joi from "joi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login({saveUserData}) {
  // ----------------useState-----------------------------------------------------------
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  // -------------getInPutValue------------------------------------------------------------
  let getInPutValue = (e) => {
    let myUser = { ...user };
    myUser[e.target.name] = e.target.value;
    setUser(myUser);
  };
  // ---------ErorrMessage----------------------------------------------------------
  const [erorrMeg, setErorrMeg] = useState("");
  const [erorrList, seterorrList] = useState([]);
  // ---------submitData----------------------------------------------------------
  let submitData = async (e) => {
    e.preventDefault();
    setLoading(true)
    let validationResponse = validateFormData();

    if (validationResponse.error) {
      seterorrList(validationResponse.error.details);
      shwoAlert()
     
    } else {

      let { data } = await axios.post("https://sticky-note-fe.vercel.app/signin",
        user
      );
      
      if (data.message === "success") {
        localStorage.setItem('token',data.token)
        saveUserData()
        goToHome();
      } else {
        setErorrMeg(data.message);
      }
      
    }
    setLoading(false) 
  };
  // ------------------------useNavigate-----------------------
  let navigate = useNavigate();
  let goToHome = () => {
    navigate("/");
  };
  // ------------------Validation Form---------------------------------------------------------------
  let validateFormData = () => {
    const schema = joi.object({
      email: joi
        .string()
        .email({ tlds: { allow: ["com", "net"] } })
        .required(),
      password: joi
        .string()
        .required()
        .pattern(new RegExp(/^[a-z][0-9]{3}$/)),
    });
    return schema.validate(user, { abortEarly: false });

  };
 
//  =======================================================================================
  let shwoAlert=(emaill)=>{
    let x =erorrList.filter((erorrr)=> erorrr.message.includes(emaill))
    if(x[0] !== undefined){
    return <div  className="alert bg-danger p-1"> {x[0].message} </div> 
  }
  else{
    return '';
  }
  }
  
  return (
    <>
      <div className=" w-75 m-auto mt-5 p-5">
        <h2>Login form</h2>
       
        {/* {erorrList.map((error, index) => { 
          
          if (error.message.includes('pattern')){error.message='Password should starts with small litter and three numbers'}
          return <div key={index} className="alert alert-danger mt-2 p-2"> {error.message} </div>} )} */}
        
        <form onSubmit={submitData}>
          <div> <label htmlFor="email">Email:</label>
      
            <input  type="email"className=" form-control mb-2"name="email"  onChange={getInPutValue}/>
      
       
          </div>
          {erorrMeg ? (<div className="alert alert-danger p-2">{erorrMeg}</div>) : erorrList.length>0?shwoAlert('email'):''}

                    
         
          <div><label htmlFor="password">Password:</label>
            <input  type="Password" className=" form-control mb-2 rNput"  name="password" onChange={getInPutValue} />
       
          </div>
          {erorrMeg ? '' : erorrList.length>0?shwoAlert('password'):''}
           {loading?

           (<button className=" btn btn-info mt-3 float-end">
          <i className="fas fa-spinner fa-spin"></i> </button>)
          :

          (<button className=" btn btn-info mt-3 float-end">
          Login</button>)
          
           }
          
          <div className="clearfix"></div>
        </form>
      </div>
    </>
  );
}
