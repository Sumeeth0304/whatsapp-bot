import express from "express";
import bodyParser from "body-parser";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Temporary in-memory state store
const userState = {};

app.post("/whatsapp", (req, res) => {
  const from = req.body.From;

  // Handle both buttons + text fallback
  const message =
    req.body.ButtonPayload ||
    (req.body.Body || "").trim().toUpperCase();

  const twiml = new twilio.twiml.MessagingResponse();
  const state = userState[from] || "WELCOME";

  /* =====================
     1️⃣ WELCOME
  ====================== */
  if (state === "WELCOME") {
    const msg = twiml.message(
      "🙏 Welcome to Swaruchi – Authentic Home-Style Indian Food\n\nHow would you like to order today?"
    );

    msg.addAction({
      buttons: [
        {
          type: "reply",
          reply: { id: "ORDER_MENU", title: "🍽️ Order from Menu" }
        },
        {
          type: "reply",
          reply: { id: "SUBSCRIBE", title: "🥘 Subscribe to Meals" }
        }
      ]
    });

    userState[from] = "MAIN_MENU";
  }

  /* =====================
     2️⃣ MAIN MENU
  ====================== */
  else if (state === "MAIN_MENU") {
    if (message === "ORDER_MENU") {
      const msg = twiml.message("🍽️ Choose a menu type:");

      msg.addAction({
        buttons: [
          {
            type: "reply",
            reply: { id: "VEG_MENU", title: "🥗 Veg Menu" }
          },
          {
            type: "reply",
            reply: { id: "NON_VEG_MENU", title: "🍗 Non-Veg Menu" }
          }
        ]
      });

      userState[from] = "MENU_TYPE";
    }

    else if (message === "SUBSCRIBE") {
      const msg = twiml.message("🥘 Choose a subscription type:");

      msg.addAction({
        buttons: [
          {
            type: "reply",
            reply: { id: "SUB_VEG", title: "🥗 Veg Meals" }
          },
          {
            type: "reply",
            reply: { id: "SUB_NON_VEG", title: "🍗 Non-Veg Meals" }
          }
        ]
      });

      userState[from] = "SUB_TYPE";
    }

    else {
      twiml.message("Please choose an option using the buttons.");
    }
  }

  /* =====================
     3️⃣ MENU TYPE
  ====================== */
  else if (state === "MENU_TYPE") {
    if (message === "VEG_MENU") {
      twiml.message(
        "🥗 Veg Menu:\n\n" +
        "• Paneer Butter Masala\n" +
        "• Dal Tadka\n" +
        "• Veg Thali\n\n" +
        "Ordering coming next 🙂"
      );
    }

    else if (message === "NON_VEG_MENU") {
      twiml.message(
        "🍗 Non-Veg Menu:\n\n" +
        "• Chicken Curry\n" +
        "• Chicken Biryani\n" +
        "• Goat Curry\n\n" +
        "Ordering coming next 🙂"
      );
    }

    else {
      twiml.message("Please select a menu using the buttons.");
    }
  }

  /* =====================
     4️⃣ SUBSCRIPTION TYPE
  ====================== */
  else if (state === "SUB_TYPE") {
    if (message === "SUB_VEG") {
      twiml.message(
        "🥗 Veg Meal Subscription\n\n" +
        "Fresh home-style vegetarian meals.\n\n" +
        "Next: choose duration."
      );
      userState[from] = "SUB_CONFIRM";
    }

    else if (message === "SUB_NON_VEG") {
      twiml.message(
        "🍗 Non-Veg Meal Subscription\n\n" +
        "Chicken-based home-style meals.\n\n" +
        "Next: choose duration."
      );
      userState[from] = "SUB_CONFIRM";
    }

    else {
      twiml.message("Please choose a subscription using the buttons.");
    }
  }

  /* =====================
     5️⃣ SUB CONFIRM
  ====================== */
  else if (state === "SUB_CONFIRM") {
    const msg = twiml.message("📅 How long would you like to subscribe?");

    msg.addAction({
      buttons: [
        {
          type: "reply",
          reply: { id: "1_WEEK", title: "1️⃣ 1 Week" }
        },
        {
          type: "reply",
          reply: { id: "2_WEEKS", title: "2️⃣ 2 Weeks" }
        },
        {
          type: "reply",
          reply: { id: "1_MONTH", title: "📆 1 Month" }
        }
      ]
    });

    userState[from] = "SUB_DURATION";
  }

  /* =====================
     DEFAULT FALLBACK
  ====================== */
  else {
    twiml.message("Type MENU to start over.");
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot running on port ${PORT}`);
});
