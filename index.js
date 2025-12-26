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
  const message = req.body.Body.trim();

  const twiml = new twilio.twiml.MessagingResponse();
  const state = userState[from] || "WELCOME";

  // 1️⃣ Welcome
  if (state === "WELCOME") {
    twiml.message(
      "🙏 Welcome to Swaruchi – Authentic Home-Style Indian Food\n\n" +
      "How would you like to order today?\n\n" +
      "1️⃣ Order from menu\n" +
      "2️⃣ Subscribe to meals\n\n" +
      "Reply with 1 or 2"
    );
    userState[from] = "MAIN_MENU";
  }

  // 2️⃣ Main Menu
  else if (state === "MAIN_MENU") {
    if (message === "1") {
      twiml.message(
        "🍽️ Menu Type:\n\n" +
        "1️⃣ Veg Menu\n" +
        "2️⃣ Non-Veg Menu\n\n" +
        "Reply with 1 or 2"
      );
      userState[from] = "MENU_TYPE";
    }
    else if (message === "2") {
      twiml.message(
        "🥘 Meal Subscriptions:\n\n" +
        "1️⃣ Veg Meals\n" +
        "2️⃣ Non-Veg Meals\n\n" +
        "Reply with 1 or 2"
      );
      userState[from] = "SUB_TYPE";
    }
    else {
      twiml.message("Please reply with 1 or 2");
    }
  }

  // 3️⃣ Menu Type
  else if (state === "MENU_TYPE") {
    if (message === "1") {
      twiml.message(
        "🥗 Veg Menu:\n\n" +
        "1️⃣ Paneer Butter Masala\n" +
        "2️⃣ Dal Tadka\n" +
        "3️⃣ Veg Thali\n\n" +
        "Reply with item number"
      );
      userState[from] = "VEG_ITEM";
    } else if (message === "2") {
      twiml.message(
        "🍗 Non-Veg Menu:\n\n" +
        "1️⃣ Chicken Curry\n" +
        "2️⃣ Chicken Biryani\n" +
        "3️⃣ Goat Curry\n\n" +
        "Reply with item number"
      );
      userState[from] = "NON_VEG_ITEM";
    } else {
      twiml.message("Reply with 1 or 2");
    }
  }

  // 4️⃣ Subscription Type
  else if (state === "SUB_TYPE") {
    if (message === "1") {
      twiml.message(
        "🥗 Veg Meal Subscription\n\n" +
        "Fresh home-style veg meals\n\n" +
        "Reply YES to continue or MENU to go back"
      );
      userState[from] = "SUB_CONFIRM";
    } else if (message === "2") {
      twiml.message(
        "🍗 Non-Veg Meal Subscription\n\n" +
        "Chicken-based home-style meals\n\n" +
        "Reply YES to continue or MENU to go back"
      );
      userState[from] = "SUB_CONFIRM";
    } else {
      twiml.message("Reply with 1 or 2");
    }
  }

  // 5️⃣ Subscription Confirm
  else if (state === "SUB_CONFIRM") {
    if (message.toUpperCase() === "YES") {
      twiml.message(
        "How long would you like to subscribe?\n\n" +
        "1️⃣ 1 Week\n" +
        "2️⃣ 2 Weeks\n" +
        "3️⃣ 1 Month"
      );
      userState[from] = "SUB_DURATION";
    } else {
      twiml.message("Reply YES to continue");
    }
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot running on port ${PORT}`);
});
