const API_KEY = "AIzaSyAW59hma9c3fiN2Ig37s4P8V_sQ6MNYJ4Q";

const chatBox = document.getElementById("chatBox");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const userText = input.value.trim();

  if (!userText) return;

  addMessage(userText, "user");
  input.value = "";

  addMessage("Typing...", "bot");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userText }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    chatBox.lastChild.remove(); // remove typing

    const botReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    addMessage(botReply, "bot");

  } catch (error) {
    chatBox.lastChild.remove();
    addMessage("Error connecting to AI", "bot");
    console.error(error);
  }
}