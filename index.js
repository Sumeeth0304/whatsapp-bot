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
  const message = (req.body.Body || "").trim();

  const twiml = new twilio.twiml.MessagingResponse();
  const state = userState[from] || "WELCOME";

  /* =====================
     1️⃣ WELCOME
  ====================== */
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

  /* =====================
     2️⃣ MAIN MENU
  ====================== */
  else if (state === "MAIN_MENU") {
    if (message === "1") {
      twiml.message(
        "🍽️ Our Menu Categories:\n\n" +
        "1️⃣ Appetizers\n" +
        "2️⃣ Curries\n" +
        "3️⃣ Yogurt / Batter\n" +
        "4️⃣ Pulav Specials\n" +
        "5️⃣ Noodles & Rice\n" +
        "6️⃣ Snacks\n" +
        "7️⃣ Chat & Drinks\n\n" +
        "Reply with the number to continue"
      );
      userState[from] = "MENU_CATEGORY";
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
      twiml.message("Please reply with 1 or 2.");
    }
  }

  /* =====================
     3️⃣ MENU CATEGORY
  ====================== */
  else if (state === "MENU_CATEGORY") {
    if (message === "1") {
      twiml.message("🥟 Appetizers:\n\n(Menu items coming next)");
    }
    else if (message === "2") {
      twiml.message("🍛 Curries:\n\n(Menu items coming next)");
    }
    else if (message === "3") {
      twiml.message("🥣 Yogurt / Batter:\n\n(Menu items coming next)");
    }
    else if (message === "4") {
      twiml.message("🍚 Pulav Specials:\n\n(Menu items coming next)");
    }
    else if (message === "5") {
      twiml.message("🍜 Noodles & Rice:\n\n(Menu items coming next)");
    }
    else if (message === "6") {
      twiml.message("🥨 Snacks:\n\n(Menu items coming next)");
    }
    else if (message === "7") {
      twiml.message("🥤 Chat & Drinks:\n\n(Menu items coming next)");
    }
    else {
      twiml.message("Please reply with a number from 1 to 7.");
    }
  }

  /* =====================
     4️⃣ SUBSCRIPTION TYPE
  ====================== */
  else if (state === "SUB_TYPE") {
    if (message === "1") {
      twiml.message(
        "🥗 Veg Meal Subscription\n\n" +
        "Fresh home-style vegetarian meals.\n\n" +
        "Reply YES to continue or MENU to go back."
      );
      userState[from] = "SUB_CONFIRM";
    }
    else if (message === "2") {
      twiml.message(
        "🍗 Non-Veg Meal Subscription\n\n" +
        "Chicken-based home-style meals.\n\n" +
        "Reply YES to continue or MENU to go back."
      );
      userState[from] = "SUB_CONFIRM";
    }
    else {
      twiml.message("Please reply with 1 or 2.");
    }
  }

  /* =====================
     5️⃣ SUB CONFIRM
  ====================== */
  else if (state === "SUB_CONFIRM") {
    if (message.toUpperCase() === "YES") {
      twiml.message(
        "📅 How long would you like to subscribe?\n\n" +
        "1️⃣ 1 Week\n" +
        "2️⃣ 2 Weeks\n" +
        "3️⃣ 1 Month\n\n" +
        "Reply with 1, 2, or 3"
      );
      userState[from] = "SUB_DURATION";
    }
    else {
      twiml.message("Reply YES to continue or MENU to go back.");
    }
  }

  /* =====================
     DEFAULT / FALLBACK
  ====================== */
  else {
    twiml.message("Type MENU to start over.");
    userState[from] = "WELCOME";
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

/* =====================
   SERVER
====================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot running on port ${PORT}`);
});
