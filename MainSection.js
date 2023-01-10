import "./MainSection.css";
import Cat from "./Cat.js";
import { useState , useEffect } from "react";
import {ethers} from "ethers";
import ABI from "./contractABI.json";
import Card from "./Card.js";

function MainSection() {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [chainName, setChainName] = useState(null);
  const [balance, setBalance] = useState(null);
  const [task, setTask] = useState([]);

  const [input, setInput] = useState(null);

  const change = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract("0x320E01FAB5b31eF456e02eF9CBE768cE5e30652B", ABI, signer);

    const createTask = await contract.createTask(input);
  }

  const getData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract("0x320E01FAB5b31eF456e02eF9CBE768cE5e30652B", ABI, signer);

    const total = await contract.totalTasks();
    console.log(total)

    setTask([]);
    for(var i = 0; i < total; i++) {
      const currentTask = await contract.taskList(i);
      setTask(prevTask => [...prevTask, currentTask]);
    }
    console.log(task)

  }

  const getWalletAddress = async() => {
    if(window.ethereum && window.ethereum.isMetaMask){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts");
      const currentAddress = await provider.getSigner().getAddress();
      console.log(currentAddress);
      
      setCurrentAccount(currentAddress)

      const chain = await provider.getNetwork();
      setChainName(chain.name);

    }

  }

  const chainChanged = () => {
    window.location.reload();
  }
  window.ethereum.on('chainChanged', chainChanged);
  window.ethereum.on('accountsChanged', getWalletAddress);

  useEffect(() => {
    getWalletAddress();
    getData();
  }, []);

  return (
    <div class="MainSection">
        <div class="Content">

            <p>{currentAccount}</p>
            <p>Chain name: {chainName}</p>
            <input value={input} onInput={e => setInput(e.target.value)}/>
            <button onClick={change} > Add Task </button>

            {task.map((item) =>(
              <Card Name={item.taskName} id={item.id} done={item.completedYet} />

            ))}

            
        </div>
            
        <div class="SideBar">
            <Cat id="309" name ="Bob"/>
            <Cat id="310" name ="Alice"/>
            <Cat id="308" name ="Theodore"/>
            <Cat id="312"/>
        </div>

    </div>
  );
}

export default MainSection;