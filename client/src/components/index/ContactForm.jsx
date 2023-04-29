export default function ContactForm() {
  return (
    <>
      <form>
        <input
          className="input-form"
          type="text"
          id="fname"
          name="fname"
          placeholder="Name"
        />
        <input
          className="input-form"
          type="text"
          id="lname"
          name="lname"
          placeholder="Email Address"
        />

        <textarea
          className="input-form textarea-form"
          id="w3review"
          name="w3review"
          rows="10"
        ></textarea>
        <input
          className="btn-form"
          id="btn-desc"
          type="submit"
          value="Submit"
        />
      </form>
    </>
  );
}
