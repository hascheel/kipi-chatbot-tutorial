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