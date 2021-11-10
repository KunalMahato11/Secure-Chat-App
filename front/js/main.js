const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

let sym = ['[', ']', '{', '}', ';', ':', '/', '>', '<', '.', '?', '*', '#', '@', '!'];

function isUpperCase(letter) {
	var l = letter.charCodeAt();
	if (l > 64 && l < 91) {
		return true;
	} else {
		return false;
	}
}

function isLowerCase(letter) {
	let l = letter.charCodeAt();
	if (l > 96 && l < 123) {
		return true;
	} else {
		return false;
	}
}

function isLetter(letter) {
	if (isLowerCase(letter) || isUpperCase(letter)) {
		return true;
	} else {
		return false;
	}
}

function mod(n, m) {
	return ((n % m) + m) % m;
}

function isPresent(a) {
	for (let i = 0; i < sym.length; i++) {
		if (a == sym[i]) return true;
	}
	return false;
}

let key = '2cqltITyz12cqltITyz12cqltITyz1';

function autoKeyGeneration(plaintext) {
	plaintext.toLowerCase();
	for (let i = 0; i < plaintext.length; i++) {
		let currentLetter = plaintext[i];
		if (currentLetter != ' ' && isPresent(currentLetter) == false) {
			key += currentLetter;
		}
	}
}

// sbanavat@gitam.edu


// Encryption using Vigenere cipher
function encrypt(plaintext) {
	let encrypted = '';
	let j = 0;
	for (let i = 0; i < plaintext.length; i++) {
		let currentLetter = plaintext[i];
		const A = 65;
		const a = 97;

		if (isUpperCase(currentLetter)) {
			let Pi = currentLetter.charCodeAt(0) - A;
			let Ki = key[j % key.length].toUpperCase().charCodeAt() - A;
			let upperLetter = mod(Pi + Ki, 26);

			encrypted += String.fromCharCode(upperLetter + A);

			j++;
		} else if (isLowerCase(currentLetter)) {
			let Pi = currentLetter.charCodeAt() - a;
			let Ki = key[j % key.length].toLowerCase().charCodeAt() - a;
			let lowerLetter = mod(Pi + Ki, 26);

			encrypted += String.fromCharCode(lowerLetter + a);

			j++;
		} else {
			encrypted += currentLetter;
		}
	}
	return encrypted;
}

// Decryption using Vigenere Cipher
function decrypt(enc) {
	let decrypted = '';
	let j = 0;
	for (let i = 0; i < enc.length; i++) {
		let currentLetter = enc[i];
		const A = 65;
		const a = 97;

		if (isUpperCase(currentLetter)) {
			let Ci = currentLetter.charCodeAt(0) - A;
			let Ki = key[j % key.length].toUpperCase().charCodeAt() - A;
			let upperLetter = mod(Ci - Ki, 26);

			decrypted += String.fromCharCode(upperLetter + A);

			j++;
		} else if (isLowerCase(currentLetter)) {
			let Ci = currentLetter.charCodeAt(0) - a;
			let Ki = key[j % key.length].toLowerCase().charCodeAt() - a;
			let lowerLetter = mod(Ci - Ki, 26);

			decrypted += String.fromCharCode(lowerLetter + a);

			j++;
		} else {
			decrypted += currentLetter;
		}
	}
	return decrypted;
}

let fromUser = 'John';
let toUser = 'Maria';

function storeDetails() {
	fromUser = document.getElementById('from').value;
	toUser = document.getElementById('to').value;
	element = document.querySelectorAll('.chat-messages');
	socket.emit('userDetails', { fromUser, toUser }); //emits details of established chat
}

//Submit message
chatForm.addEventListener('submit', (e) => {
	e.preventDefault(); //Prevents default logging to a file
	// let key = '2cqltITyz12cqltITyz12cqltITyz1';
	let msg = e.target.elements.msg.value;
	autoKeyGeneration(msg);
	msg = encrypt(msg, key);
	console.log(msg);
	final = {
		fromUser: fromUser,
		toUser: toUser,
		msg: msg,
	};
	socket.emit('chatMessage', final); //emits chat message along with sender and reciever to server
	document.getElementById('msg').value = ' ';
});

socket.on('output', (data) => {
	//recieves the entire chat history upon logging in between two users and displays them
	for (var i = 0; i < data.length; i++) {
		outputMessage(data[i]);
	}
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('message', (data) => {
	//recieves a message and displays it
	outputMessage(data);
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

function outputMessage(message) {
	const div = document.createElement('div');
	div.classList.add('message');
	// let key = '2cqltITyz12cqltITyz12cqltITyz1';
	let decryptedMessage = decrypt(message.message, key);
	div.innerHTML = `<p class="meta">${message.from}<span> ${message.time}, ${message.date}</span></p>
    <p class ="text">
        ${decryptedMessage}
    </p>`;
	document.querySelector('.chat-messages').appendChild(div);
}
