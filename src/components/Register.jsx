// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Register.css";

// function Register() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     mobile: "",
//     dob: "",
//     address: "",
//     countryCode: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       alert("❌ Passwords do not match!");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       if (data.success) {
//         alert("✅ Registration Successful! Please login.");
//         navigate("/login");
//       } else {
//         alert("❌ " + data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong!");
//     }
//   };

//   return (
//     <div className="register-container">
//       <h2>New Registration</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="fullName"
//           placeholder="Full Name"
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email Address"
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="mobile"
//           placeholder="Mobile Number"
//           onChange={handleChange}
//           required
//         />
//         <input type="date" name="dob" onChange={handleChange} required />
//         <input
//           type="text"
//           name="address"
//           placeholder="Address"
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="countryCode"
//           placeholder="Country Code"
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="confirmPassword"
//           placeholder="Confirm Password"
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Register</button>
//       </form>
//     </div>
//   );
// }

// export default Register;







import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    dob: "",
    address: "",
    countryCode: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();

      if (data.success) {
        alert("✅ Registration Successful! Please login.");
        navigate("/login");
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Register Error:", err);
      alert("❌ Something went wrong. Check your network or backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>New Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="countryCode"
          placeholder="Country Code"
          value={formData.countryCode}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;
