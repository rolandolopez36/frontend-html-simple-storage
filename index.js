import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const setNumberButton = document.getElementById("setNumberButton");
const getNumberButton = document.getElementById("getNumberButton");
const numberInput = document.getElementById("numberInput");
const currentNumber = document.getElementById("currentNumber");

connectButton.onclick = connect;
setNumberButton.onclick = setNumber;
getNumberButton.onclick = getNumber;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error(error);
    }
    connectButton.innerHTML = "Connected";
  } else {
    connectButton.innerHTML = "Please install MetaMask";
  }
}

async function setNumber() {
  const number = numberInput.value;
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.setNumber(number);
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.error(error);
    }
  }
}

async function getNumber() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    try {
      const number = await contract.getNumber();
      currentNumber.innerHTML = `Current Number: ${number}`;
    } catch (error) {
      console.error(error);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations. `
      );
      resolve();
    });
  });
}
