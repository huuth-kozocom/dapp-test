import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Swal from 'sweetalert2'
import "bootstrap/dist/css/bootstrap.css";
import Web3 from "web3";

export default function TransactionWeb3js() {
    const [walletAddress, setWalletAddress] = useState("");
    const [walletBalance, setWalletBalance] = useState("");
    const [amount, setAmount] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [gasPrice, setGasPrice] = useState("");
    const [network, setNetwork] = useState({});
    const address = JSON.parse(localStorage.getItem('wallet_address'));
    // api key from etherscan
    const apiKey = "ENBK5HBW1JFGY2INMUN28UDA88VM1Y6GJS";
    // company wallet
    const masterWallet = "0x8d834b4eCf449754affC35D9Ee21255bD07F6423";

    useEffect(()=>{
      //get transactions from DB
      getTransactions()
      //change account display when account changed
      checkAccountChanged()
      //get gas price from etherscan api
      getGasPrice()
      //change network display when network changed
      checkNetwork()
    },[])

    const getTransactions = () => {
      axios.get(`http://localhost:8001/api/transaction-web3js`).then(({data})=>{
          setTransactions(data)
      })
    }

    const createTransactions = (data) => {
      axios.post(`http://localhost:8001/api/transaction-web3js/create`, data)
      .then((res) => {
        if (res) {
          window.location.reload();
        }
      })
    }

    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

    const checkAccountChanged = () => {
      keepAccountData();

      ethereum.on("accountsChanged", accounts => {
        if (accounts.length === 0){
          setWalletAddress(null)
          setWalletBalance(null)
          localStorage.removeItem('wallet_address')
        }
      });
    }

    const checkNetwork = () => {
      ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    //to keep data of account when reloading
    const keepAccountData = () => {
      setWalletAddress(address)
      getBalance(address)
      getNetwork()
    }

    const getGasPrice = async () => {
      try {
        const res = await axios.get(`https://api-ropsten.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=${apiKey}`);
        const gasPrice = Number(web3.utils.fromWei(res.data.result.toString(), 'gwei')).toFixed(1);
        setGasPrice(gasPrice.toString());
      } catch (err) {
        console.log(err);
      }
    }

    const getAccount = () => {
      try {
        //in case the browser is not installed metamask
        if (typeof window.ethereum == 'undefined') {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Please install Metamask wallet"
          })
          return;
        }

        //in case already connected to metamask
        if (address) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "You have already connected"
          })
          return;
        }

        //request to connect to metamask
        web3.eth.requestAccounts()
        .then((address) => {
          setWalletAddress(address[0])
          getBalance(address[0])
          saveAccount(address[0])
        })
        .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message
          })
        })
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message
        })
      }
    }

    //save account data to local storage
    const saveAccount = (address) => {
      try {
        if (!address) {
          return;
        }
        localStorage.setItem('wallet_address', JSON.stringify(address))
      } catch (error) {
        console.log(error)
      }
    }

    //get balance of current account
    const getBalance = (address) => {
      if (!address) {
        return;
      }
        web3.eth.getBalance(address)
      .then(
        balance => setWalletBalance(web3.utils.fromWei(balance, 'ether'))
      ).catch ((err) => {
        console.log(err);
      })
    }

    //get id and name of current network
    const getNetwork = async () => {
      try {
        const networkId = await web3.eth.net.getId();
        const networkName = await web3.eth.net.getNetworkType();
        const data = {
          id: networkId,
          name: networkName
        };
        setNetwork(data)
      } catch (err) {
        console.log(err)
      }
    }

    //perform transaction action
    const sendTransaction = async () => {
      //in case not connect to metamask
      if (!walletAddress) {
        alert("Please connect to wallet");
        return;
      }

      //input amount must larger than 0
      if (amount <= 0) {
        alert("Amount must be larger than 0")
        return;
      }

      try {
        web3.eth.sendTransaction({
          from: walletAddress,
          gasPrice: web3.utils.toWei(gasPrice, 'gwei'),
          gas: web3.utils.toWei("210000", 'wei'),
          to: masterWallet,
          value: web3.utils.toWei(amount, 'ether'),
        })
        .then((res) => {
          if (res) {
            //save to DB data when transaction is done
            createTransactions({
              'from_wallet': res.from,
              'to_wallet': res.to,
              'network_id': network.id,
              'txHash': res.transactionHash,
              'amount': amount,
              'status': 1
            })
          }
        }).catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.code == -32602 ? "You are disconnected!!!!" : err.message
          })
        })
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.code == -32602 ? "You are disconnected!!!!" : err.message
        })
      }
    }

    return (
      <div className="container">
          <h2 style={{textAlign:"center"}}> Transaction token web3js demo </h2>
          <div className="row">
            <div className="col-12">
                <div className="card card-body">
                  <form>
                    <div className="form-group">
                      <label>Amount</label>
                      <input type="text" className="form-control" id="amount" placeholder="Enter amount" onChange={event => setAmount(event.target.value)} />
                      <div className='text-center'>
                        <button type="button" className="btn btn-warning my-2 mx-2" onClick={getAccount}>Connect to wallet</button>
                        <button type="button" className="btn btn-primary my-2" onClick={sendTransaction}>Transfer token</button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="card card-body">
                  <h3 style={{color:"red"}}>Your wallet address: {walletAddress}</h3>
                  <h3 style={{color:"red"}}>Your balance: {walletBalance}</h3>
                  <h3 style={{color:"red"}}>Gas price: {gasPrice}</h3>
                  <h3 style={{color:"red"}}>Network ID: {network.id}</h3>
                  <h3 style={{color:"red"}}>Network name: {network.name}</h3>
                </div>
                <div className='table-responsive'>
                    <table className="table table-bordered text-center table-striped" style={{"table-layout":"fixed", "word-wrap":"break-word"}}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>From wallet</th>
                                <th>To wallet</th>
                                <th>Network ID</th>
                                <th>Amount</th>
                                <th>txHash</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                transactions.length > 0 && (
                                  transactions.map((row, key) => (
                                        <tr key={key}>
                                            <td>{row.id}</td>
                                            <td>{row.from_wallet}</td>
                                            <td>{row.to_wallet}</td>
                                            <td>{row.network_id}</td>
                                            <td>{row.amount}</td>
                                            <td>{row.txHash}</td>
                                            <td>{row.status == 1 ? 'Pending' : 'Success'}</td>
                                        </tr>
                                    ))
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
      </div>
    )
}