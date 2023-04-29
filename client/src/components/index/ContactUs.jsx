import "../../css/contact.css";
import ContactForm from "./ContactForm";
export default function ContactUs() {
  return (
    <div className="container contact">
      <div className="contact-wrap">
        <div className="contact-info">
          <ul>
            <li className="contact-list">
              <img src="/images/call_us.png" alt="pic" className="list-logo" />
              <span>Call Us</span>
              <div>(389) 678-8935</div>
            </li>
            <li className="contact-list">
              <img src="/images/location.png" alt="pic" className="list-logo" />
              <span>Location</span>
              <div>7VVJ+QFR, Natalio B. Bacalso Ave, Cebu City, 6000 Cebu</div>
            </li>
            <li className="contact-list">
              <img
                src="/images/business_hours.png"
                alt="pic"
                className="list-logo"
              />
              <span>Business Hours</span>
              <div>Mon - Fri ... 8 am - 5 pm</div>
            </li>
          </ul>
        </div>
        <div className="contact-form">
          <div className="form-wrap">
            <div>Contact Us</div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
