import "./Card.css";
import { useState } from "react";
import ABI from "./contractABI.json";
import { ethers } from "ethers";


function Card(props) {

    const [checked, setChecked] = useState(props.done)

    const toggle = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract("0x320E01FAB5b31eF456e02eF9CBE768cE5e30652B", ABI, signer);

        const toggleContract = await contract.toggleTask(props.id);
        
        const receipt = await toggleContract.wait();
        if (receipt.confirmations > 0) {
            setChecked(!checked);

        }
        

    }

    return (
        <div className = "ToDoItem">
            <p>{props.Name} </p>
            <input onClick={toggle} type="checkbox" checked={checked} />
        </div>
    );
}

export default Card;