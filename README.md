# Chatbot programming tutorial
[German version / Deutsche Version](/docs/Chatbot-Programmier-Tutorial.md)

This is a tutorial of how to program your own ChatGPT chatbot client for real conversations. This web application uses the Flask webapplication framework and Bootstrap UI libraries. You'll need an OpenAI user account an OpenAI api key.

## Create the app

Creating a web application using Flask (Python for the backend) and Bootstrap (for the frontend) that allows for a real-time conversation with a GPT model can be divided into several main parts:

1. **Backend (Flask Application)**
2. **Frontend (HTML with Bootstrap)**
3. **Integration (JS for async interaction)**

### Step-by-Step Guide

1. **Install Required Packages**:
   Make sure you have Flask and OpenAI installed. You can install them using pip:
   ```bash
   pip install flask openai
   ```

2. **Project Structure**:

   ```
   chatbot_app/
   ├── templates/
   │   └── index.html
   ├── static/
   │   └── script.js
   ├── app.py
   └── requirements.txt
   ```

3. **Backend: `app.py`**:
   This is the main backend file for the Flask application.

   ```python
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
   ```

4. **Frontend: `templates/index.html`**:
   This file contains the HTML structure and includes Bootstrap for styling.

   ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ChatBot with ChatGPT App</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="container mt-5">
            <h3 class="text-center">Chatbot</h3>
            <div class="card">
                <div class="card-body">
                    <div id="chat-box" style="height: 400px; overflow-y: scroll; border: 1px solid #ccc;">
                        <!-- Chat messages will appear here -->
                    </div>
                    <div class="input-group mt-3">
                        <input id="user-input" type="text" class="form-control" placeholder="Type your message here..." aria-label="User Input">
                        <div class="input-group-append">
                            <button id="send-btn" class="btn btn-primary" type="button">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="{{ url_for('static', filename='script.js') }}"></script>
    </body>
    </html>
   ```

5. **Frontend: `static/script.js`**:
   This file contains the JavaScript to handle user input and interaction with the backend.

   ```javascript
    $(document).ready(function() {
        // Listen for user input: Is the Send button clicked with a mouse? Then send the message to the Flask backend via AJAX POST request.
        $('#send-btn').click(function() {
            sendMessage();
        });

        // Listen for user input: Is the enter key pressed? Then send the message to the Flask backend via AJAX POST request.
        $('#user-input').keypress(function(e) {
            if (e.which == 13) {
                sendMessage();
            }
        });

        function sendMessage() {
            const userMessage = $('#user-input').val();
            if (userMessage.trim() === "") {
                return;
            }

            // Update the chatbox with the user message.
            $('#chat-box').append(`<div><strong>You:</strong> ${userMessage}</div>`);

            $.ajax({
                url: '/chat',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ message: userMessage }),
                success: function(response) {
                    const gptReply = response.reply;
                    $('#chat-box').append(`<div><strong>ChatGPT:</strong> ${gptReply}</div>`);  // Updates the chatbox ChatGPT's responses dynamically.
                    $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
                },
                error: function(error) {
                    console.log(error);
                }
            });

            $('#user-input').val('').focus();
        }
    });
   ```

### Explanation:

1. **Backend**:

   - **`app.py`**:
     - Uses Flask to create a web server.
     - Establishes a home route (`/`) that serves the HTML template.
     - Defines a `/chat` endpoint that handles POST requests to fetch messages from the user, send them to the OpenAI API, and return responses.

2. **Frontend**:

   - **`index.html`**:
     - Provides a html container and input elements styled with Bootstrap.
     - Links the Bootstrap CSS library for styling and jQuery for handling UI interactions.

   - **`script.js`**:
     - Listens for user input and sends it to the Flask backend via AJAX POST requests.
     - Updates the chatbox with user messages and GPT-4's responses dynamically.

### Running the Application:

1. Save the directory structure with the respective files.
2. Ensure you’ve installed Flask and OpenAI as mentioned above at: Install Required Packages.
3. Replace `'TYPE IN YOUR OPENAI API KEY HERE!'` in the `app.py` file with your actual OpenAI API key.
4. Run the Flask application:
   ```bash
   python app.py
   ```
5. Open your browser and go to `http://127.0.0.1:5000/` to interact with your ChatGPT app.