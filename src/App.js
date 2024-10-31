import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Web3 from 'web3';

const ADDRESS = "0xcCaB59AeAE86F41643b20200f24a3D48126be416";
const ABI = [
	{
		"inputs": [],
		"name": "decreaseNumber",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "increaseNumber",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "newMessage",
				"type": "string"
			}
		],
		"name": "setMessage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_startingPoint",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_startingMessage",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "getNumber",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "message",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

function App() {
    const [number, setNumber] = useState("none");
    const [currentMessage, setCurrentMessage] = useState("none");
    const [newMessage, setNewMessage] = useState("");

    const web3 = new Web3(window.ethereum || "http://localhost:8545");
    const myContract = new web3.eth.Contract(ABI, ADDRESS);

    async function getNumber() {
        try {
            const result = await myContract.methods.getNumber().call();
            setNumber(result.toString());
        } catch (error) {
            console.error("Error fetching number:", error);
        }
    }

    async function getMessage() {
        try {
            const message = await myContract.methods.message().call();
            setCurrentMessage(message);
        } catch (error) {
            console.error("Error fetching message:", error);
        }
    }

    async function increaseNumber() {
        try {
            const accountsConnected = await web3.eth.requestAccounts();
            await myContract.methods.increaseNumber().send({ from: accountsConnected[0] });
            getNumber();
        } catch (error) {
            console.error("Error increasing number:", error);
        }
    }

    async function decreaseNumber() {
        try {
            const accountsPresent = await web3.eth.requestAccounts();
            await myContract.methods.decreaseNumber().send({ from: accountsPresent[0] });
            getNumber();
        } catch (error) {
            console.error("Error decreasing number:", error);
        }
    }

    async function updateMessage() {
        try {
            const connectedAccounts = await web3.eth.requestAccounts();
            await myContract.methods.setMessage(newMessage).send({ from: connectedAccounts[0] });
            setNewMessage(""); // Clear the input
            getMessage();
        } catch (error) {
            console.error("Error updating message:", error);
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <button onClick={getNumber}>Get Number</button>
                <br />
                <button onClick={increaseNumber}>Increase Number</button>
                <br />
                <button onClick={decreaseNumber}>Decrease Number</button>
                <br />
                <p>Number: {number}</p>
                <br />
                <button onClick={getMessage}>Get Message</button>
                <br />
                <p>Message: {currentMessage}</p>
                <br />
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Enter new message"
                />
                <br />
                <button onClick={updateMessage}>Update Message</button>
            </header>
        </div>
    );
}

export default App;
