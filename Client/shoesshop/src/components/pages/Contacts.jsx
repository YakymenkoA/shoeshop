export default function Contacts() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">
          <div className="mb-5">
            <h3 className="mb-3" style={{ color: "black" }}>Our Office</h3>
            <p style={{ color: "black" }}>
              <strong>Address:</strong> 1234 Example Street, City, Country
            </p>
            <p style={{ color: "black" }}>
              <strong>Phone:</strong> +1 234 567 890
            </p>
            <p style={{ color: "black" }}>
              <strong>Email:</strong> contact@company.com
            </p>
            <p style={{ color: "black" }}>
              <strong>Working Hours:</strong><br />
              Monday to Friday: 9:00 AM - 6:00 PM<br />
              Saturday: 10:00 AM - 4:00 PM<br />
              Sunday: Closed
            </p>
          </div>
          <h1 className="display-4 text-center mb-4" style={{ color: "black" }}>Contact Us</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label" style={{ color: "black" }}>Name</label>
              <input type="text" className="form-control" id="name" placeholder="Your Name" />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label" style={{ color: "black" }}>Email address</label>
              <input type="email" className="form-control" id="email" placeholder="Your Email" />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label" style={{ color: "black" }}>Message</label>
              <textarea className="form-control" id="message" rows="4" placeholder="Your Message"></textarea>
            </div>
            <button type="submit" className="btn btn-dark w-100">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
