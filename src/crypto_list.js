import React, { useState, useEffect } from 'react';
import './CSS/crypto_list.css';




// Function to check if a token is wrapped
function isWrapped(coin) {
    // Check for known indicators of wrapped/staked tokens in both symbol and name
    const wrappedTokens = [
  'weth', 'wbtc', 'steth', 'reth', 'cbeth', 'wrapped', 
  'restaked', 'staked', 'superoethb', 'frxeth', 'btc.b', 
  'busd'
];    
    // Look for these keywords in the symbol or name of the token
    const nameOrSymbolIncludesWrapped = wrappedTokens.some(tokenIndicator => 
        coin.symbol.toLowerCase().includes(tokenIndicator) || 
        coin.name.toLowerCase().includes(tokenIndicator)
    );
    
    // Check for specific common patterns (prefixes or suffixes)
    const isCommonWrappedPrefix = coin.symbol.toLowerCase().startsWith('w') || coin.symbol.toLowerCase().startsWith('cb');
    const isCommonWrappedSuffix = coin.symbol.toLowerCase().endsWith('e') || coin.symbol.toLowerCase().endsWith('steth') || coin.symbol.toLowerCase().endsWith('reth');
    
    return nameOrSymbolIncludesWrapped || isCommonWrappedPrefix || isCommonWrappedSuffix;
}

// Function to check if a token is unstable (large price change)
function isUnstable(coin) {
  const priceThreshold = 5;  // 5% daily price change threshold
  const marketCapLimit = 1000000000;  // $1 billion market cap threshold
  const volumeLimit = 10000000;  // $10 million volume threshold
  
  return (
    Math.abs(coin.price_change_percentage_24h) > priceThreshold ||  // Price volatility
    coin.market_cap < marketCapLimit ||  // Low market cap (highly volatile)
    coin.total_volume < volumeLimit  // Low volume (prone to large price swings)
  );
}



function CryptoList() {
  const [cryptos, setCryptos] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

const ethNativeCoins = ['eth', 'usdc', 'dai', 'link', 'uni', 'aave', 'comp', 'ldo', 'snx'];


// Function to check if a token is Ethereum-exclusive
function isEthereumExclusive(coin) {
  // Modify the logic to check if a coin is available on Ethereum
  return coin.platforms && coin.platforms.ethereum;
}


useEffect(() => {
  const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1';

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(async data => {
      const filteredData = await Promise.all(data.map(async (coin) => {
        const wrapped = isWrapped(coin);
        const unstable = isUnstable(coin);
        const ethereumNetwork = isEthereumExclusive(coin);

        return (!wrapped && unstable && ethereumNetwork) ? coin : null;
      }));

      setCryptos(filteredData.filter(Boolean));
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data from CoinGecko:', error);
      setLoading(false);
    });
}, []);





  // Handle display logic for showing top 10 or all coins
  const toggleDisplay = (event) => {
    setShowAll(event.target.value === 'all');
  };


  // Handle search functionality
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };


  const filteredCoins = cryptos.filter(coin => coin.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const displayedCoins = showAll ? filteredCoins : filteredCoins.slice(0, 10);

  return (
    <ul className="crypto-list">
      <div className="search-and-select-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a coin"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>

        <label>
          <select onChange={toggleDisplay} className="view-select">
            <option value="top10">Show Top 10</option>
            <option value="all">Show All</option>
          </select>
        </label>
      </div>

      {/* Render the filtered list of tokens */}
      {displayedCoins.map(coin => (
        <li key={coin.id} className="crypto-item">
          <img src={coin.image} alt={coin.name} className="crypto-icon" />
          <h3 className="crypto-name">{coin.name}</h3>
          <p className="crypto-price">${coin.current_price}</p>
          <div className="price-indicator">
            {coin.price_change_percentage_24h > 0 ? (
              <span className="price-up">&#x25B2;</span>
            ) : (
              <span className="price-down">&#x25BC;</span>
            )}
          </div>
          <div className="crypto-symbol-container">
            <span className="crypto-symbol">{coin.symbol.toUpperCase()}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}


export default CryptoList;
