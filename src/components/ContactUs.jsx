import React, { useState } from "react";
import axios from "axios";

function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", website: "", message: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/contact-us", form);
      if (res.data.success) {
        setMsg("Message sent successfully!");
        setForm({ name: "", email: "", phone: "", website: "", message: "" });
      }
    } catch (err) {
      setMsg("Failed to send message!");
      console.error(err);
    }
  };

  return (
    <div className="contact-us-page">
      <h2>Contact Us</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td><label>Name:</label></td>
              <td><input name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" required /></td>
            </tr>
            <tr>
              <td><label>Email:</label></td>
              <td><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required /></td>
            </tr>
            <tr>
              <td><label>Phone:</label></td>
              <td><input name="phone" value={form.phone} onChange={handleChange} placeholder="Enter your phone" /></td>
            </tr>
            <tr>
              <td><label>Website:</label></td>
              <td><input name="website" value={form.website} onChange={handleChange} placeholder="Enter your website" /></td>
            </tr>
            <tr>
              <td><label>Message:</label></td>
              <td><textarea name="message" value={form.message} onChange={handleChange} placeholder="Write your message" required /></td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Submit</button>
        {msg && <p>{msg}</p>}
      </form>
    </div>
  );
}

export default ContactUs;
