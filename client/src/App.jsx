import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import {
  Ripple,
  initTE,
} from "tw-elements";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    const provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider());

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);
  return (
    <>
      {" "}
      {!modalOpen && (
        
        <button
        type="button"
        onClick={() => setModalOpen(true)}
        data-te-ripple-init
        data-te-ripple-color="light"
        className="border-0 -z-1 p-4 mt-2  bg-gradient-to-r from-red-400 to-red-500 w-16 h-12 text-white rounded drop-shadow-lg hover:drop-shadow-xl text-xs shadow-[0 8px 16px 0_rgba(0, 0, 0, 0.2]">
         Share{" "}
      </button>
        
      )}{" "}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}>
          {" "}
        </Modal>
      )}{" "}
      <div className="App">
        <h1 style={{ color: "white" }}> Decentralized File System </h1> <div class="bg"> </div>{" "}
        <div class="bg bg2"> </div> <div class="bg bg3"> </div>
        <p style={{ color: "white" }}>
          Account: {account ? account : "Not connected"}{" "}
        </p>{" "}
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        ></FileUpload>{" "}
        <Display contract={contract} account={account}>
          {" "}
        </Display>{" "}
      </div>{" "}
    </>
  );
}

export default App;
