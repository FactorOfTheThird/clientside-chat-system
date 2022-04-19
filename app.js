'use strict'

// Elements
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messageList = document.getElementById('messages');
const messageType = document.getElementById('messageType');
const optionsEl = document.querySelector('.options');

const alternate = document.getElementById('alternate');
const theme = document.getElementById('theme');

// Main App Class
class App {

    constructor() {
        this._loadSettings();

        messageForm.addEventListener('submit', this._onFormSubmit.bind(this));

        messageList.addEventListener('mouseover',this._onHover.bind(1));
        messageList.addEventListener('mouseout',this._onHover.bind(0));

        messageList.addEventListener('click', this._onMessageDelete);

        optionsEl.addEventListener('change', this._saveSettings.bind(this))
        // alternate.addEventListener('change', this._saveSettings.bind(this))
        // messageType.addEventListener('change', this._saveSettings.bind(this))
        // theme.addEventListener('change', this._saveSettings.bind(this))
    }

    // When the user tries to send a message
    _onFormSubmit(e) {
        e.preventDefault();

        const text = messageInput.value;
        const type = messageType.value;
        const id = Math.trunc(Math.random() * 500_000 + 1)
        let html;

        if (type === "msg-left") {
            html = `
            <div class="message-container ${type}" data-id='${id}'>
                <div class="message">${text}</div>
                <button class="messageDelete">Delete</button>
            </div>
            `
        } else {
            html = `
            <div class="message-container ${type}" data-id='${id}'>
                <button class="messageDelete">Delete</button>
                <div class="message">${text}</div>
            </div>
            `
        }

        // Insert messages at the top - If you enable this one, comment out the "scrollIntoView" line
        // messageList.insertAdjacentHTML("afterbegin",html)

        // Insert messages at the bottom
        messageList.insertAdjacentHTML("beforeend",html)

        // Scroll to the bottom
        messageList.lastElementChild.scrollIntoView({behavior: 'smooth'})

        messageInput.value = '';

        // Message alternation, so you can go back and forth
        if (alternate.value === 'true') {
            messageType.value === 'msg-right' ? messageType.value = 'msg-left' : messageType.value = 'msg-right'
        }
    }

    // When the user hovers over a message
    _onHover(e) {
        const container = e.target.closest('.message-container')

        if (container) {
            const deleteButton = container.querySelector('.messageDelete')
            // console.log(deleteButton);
            deleteButton.style.opacity = this
        }
    }

    // When the user tries to delete a message
    _onMessageDelete(e) {
        if (e.target.classList.contains('messageDelete')) {
            const container = e.target.closest('.message-container')
            container.remove();
        }
    }

    _changeTheme() {
        if (theme.value === 'dark') {
            document.body.classList.add('darkBG');
            optionsEl.classList.add('darkOptions')
            messageList.classList.add('darkMessages')
            messageInput.classList.add('darkInput')

        } else {
            document.body.classList.remove('darkBG');
            optionsEl.classList.remove('darkOptions')
            messageList.classList.remove('darkMessages')
            messageInput.classList.remove('darkInput')
        }
    }

    _saveSettings(e) {
        localStorage.setItem('options', JSON.stringify({by: messageType.value, alt: alternate.value, theme: theme.value}));
        
        if (e.target === theme) this._changeTheme()
    }

    _loadSettings() {
        const options = JSON.parse(localStorage.getItem('options'));

        if (options) {
            messageType.value = options.by;
            alternate.value = options.alt
            theme.value = options.theme

            this._changeTheme()
        }
    }
}

// Initiates everything
const app = new App();