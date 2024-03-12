import { ethers } from 'ethers';
import { Container } from 'react-bootstrap';
import { useEffect, useState } from 'react'
import Navigation from './Navigation';
import Info from './Info';
import TOKEN_ABI from '../abi/Token.json';
import CROWDSALE_ABI from '../abi/Crowdsale.json';

function App() {

    const [account, setAccount] = useState(null)
    const [provider, setProvider] = useState(null)
    const [isLoading, setIsLoading] = useState(true)


    const loadBlockchainData = async () => {

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(provider)

        const token = new ethers.Contract('0x5fbdb2315678afecb367f032d93f642f64180aa3',TOKEN_ABI, provider)
        console.log(token)

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account)

        setIsLoading(false)
    }

    useEffect(() => {
        if (isLoading){
            loadBlockchainData()
        }
    }, [isLoading]);

    return(
        <Container>
            <Navigation></Navigation>
            <hr></hr>
            {account && (
                <Info account={account}></Info>
            )}
        </Container>

    )
}

export default App;