from flask import Flask, render_template, request, jsonify
import openai

app = Flask(__name__)

# Setup your OpenAI API key.
openai.api_key = 'TYPE IN YOUR OPENAI API KEY HERE!'

conversation_history = []

@app.route('/')
def home():
    return render_template('index.html')

# Define a /chat endpoint that handles POST requests to fetch messages from the user, send these messages to the OpenAI API, and return responses.
@app.route('/chat', methods=['POST'])
def chat():
    global conversation_history
    user_message = request.json.get("message")

    conversation_history.append({"role": "user", "content": user_message})
    response = openai.chat.completions.create(
        model="gpt-4o",  # Use the appropriate GPT-4 model.
        messages=conversation_history
    )

    gpt_reply = response.choices[0].message.content
    conversation_history.append({"role": "assistant", "content": gpt_reply})

    return jsonify({"reply": gpt_reply})

# Start the app. Use Flask to create a web server.
if __name__ == '__main__':
    app.run(debug=True)