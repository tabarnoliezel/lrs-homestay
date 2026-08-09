
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed"
    });
  }

  try {
    const {
      name,
      contact,
      email,
      checkIn,
      checkOut,
      guests,
      notes
    } = req.body;

    if (!name || !contact || !email || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        message: "Please complete all required fields."
      });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`
      },

      body: JSON.stringify({
        from: "LRS Homestay <onboarding@resend.dev>",
        to: ["lrshomestay@gmail.com"],
        reply_to: email,
        subject: `New Booking Inquiry - ${name}`,

        html: `
          <h2>New Guest Booking Inquiry</h2>

          <p><strong>Guest Name:</strong> ${name}</p>

          <p><strong>Contact Number:</strong> ${contact}</p>

          <p><strong>Email Address:</strong> ${email}</p>

          <p><strong>Check-in:</strong> ${checkIn}</p>

          <p><strong>Check-out:</strong> ${checkOut}</p>

          <p><strong>Number of Guests:</strong> ${guests}</p>

          <p><strong>Additional Notes:</strong><br>
          ${notes || "None"}
          </p>

          <hr>

          <p>
            This is a booking inquiry only.
            Please contact the guest to confirm availability.
          </p>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend error:", data);

      return res.status(500).json({
        message: "Failed to send inquiry."
      });
    }

    return res.status(200).json({
      message: "Inquiry sent successfully."
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      message: "Something went wrong."
    });
  }
}
