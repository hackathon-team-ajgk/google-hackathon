function Contact() {
  return (
    <form className="contact-us">
      <h2 id="form-heading">Get in Touch</h2>
      <div className="form-field">
        <input
          id="first-name-input"
          className="contact-input"
          type="text"
          placeholder="First Name"
          required
        />
        <input
          id="last-name-input"
          className="contact-input"
          type="text"
          placeholder="Last Name"
          required
        />
      </div>
      <div className="form-field">
        <input
          id="email-input"
          className="contact-input"
          type="email"
          placeholder="Email"
          autoComplete="current-email"
          required
        />
        <input
          id="phone-input"
          className="contact-input"
          type="text"
          placeholder="Phone Number"
          required
        />
      </div>
      <input
        id="address-input"
        className="contact-input"
        type="text"
        placeholder="Address"
        required
      />
      <textarea
        id="contact-textarea"
        className="form-textarea"
        placeholder="Type your message here"
      />
      <button type="submit" id="contact-button" className="button">
        Submit
      </button>
    </form>
  );
}

export default Contact;
