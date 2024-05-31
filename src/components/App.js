import { ethers } from 'ethers';
import { Container } from 'react-bootstrap';
import { useEffect, useState } from 'react'
import Navigation from './Navigation';
import Info from './Info';
import TOKEN_ABI from '../abi/Token.json';
import CROWDSALE_ABI from '../abi/Crowdsale.json';
import config from '../config.json';
import Loading from './Loading';
import Progress from './Progress';
import Buy from './Buy';


function App() {

    const [account, setAccount] = useState(null)
    const [accountBalance, setAccountBalance] = useState(0)
    const [provider, setProvider] = useState(null)
    const [crowdsale, setCrowdsale] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const [price, setPrice] = useState(0)
    const [maxTokens, setMaxTokens] = useState(0)
    const [tokensSold, setTokensSold] = useState(0)

    const loadBlockchainData = async () => {

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(provider)

        const token = new ethers.Contract(config[31337].token.address,TOKEN_ABI, provider)
        const crowdsale = new ethers.Contract(config[31337].crowdsale.address,CROWDSALE_ABI, provider)
        setCrowdsale(crowdsale)

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account)

        const accountBalance = ethers.utils.formatUnits(await token.balanceOf(account), 18)
        setAccountBalance(accountBalance)

        const price = ethers.utils.formatUnits(await crowdsale.price(), 18)
        setPrice(price)
        console.log(price)
        const maxTokens = ethers.utils.formatUnits(await crowdsale.maxTokens(), 18)
        setMaxTokens(maxTokens)
        const tokensSold = ethers.utils.formatUnits(await crowdsale.tokensSold(), 18)
        setTokensSold(tokensSold)

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
            <h1 className="text-center my-5"> Introducing Ease DAPP!</h1>
        {isLoading ? (
        <Loading/>
        ) : (<>
            <p className='text-center'><strong>Current Price:</strong> {price} ETH</p>
            <Buy provider={provider} price={price} crowdsale={crowdsale} setIsLoading={setIsLoading} />
            <Progress maxTokens={maxTokens} tokensSold={tokensSold}/>
            </>)}
            <hr></hr>

            {account && (
                <Info account={account} accountBalance={accountBalance}></Info>
            )}
        </Container>

    )
}

export default App;