import React, { useState, useEffect } from 'react';
import { Credentials } from './Credentials';
import axios from 'axios';

const App = (props) => {
    // console.log("hello")

    
  const spotify = Credentials();  
  const [token, setToken] = useState('');  
  const [genres, setGenres] = useState({selectedGenre: '', listOfGenresFromAPI: []});


  useEffect(() => {

    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)      
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .then(tokenResponse => {      
      setToken(tokenResponse.data.access_token);

      axios('https://api.spotify.com/v1/artists/6AiX12wXdXFoGJ2vk8zBjy/top-tracks?market=IN', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })
      .then (genreResponse => {        
            setGenres({listOfGenresFromAPI:genreResponse.data.tracks})
        // console.log(genreResponse.data.tracks)
      });
      
    });
  }, [genres.selectedGenre, spotify.ClientId, spotify.ClientSecret]); 

//  console.log("yo")
const [val,setval] = useState("0");
const [tid,settid] = useState(0);
  
  return (
  
   <div>
        {/* {console.log(genres.listOfGenresFromAPI)} */}
          {(genres.listOfGenresFromAPI.length>0?
          <>
          <div id = "0" style={{border:"2px solid black",margin:"10px",padding:"10px"}}>
              <h4>{genres.listOfGenresFromAPI[0].name}</h4>
              <p>{genres.listOfGenresFromAPI[0].uri}</p>
              <button onClick={() => {props.makenft(genres.listOfGenresFromAPI[0].uri,0)}}>make NFT</button>
              <button onClick={()=>{props.start(50,0)}}> start</button>
              {/* <form className="mb-3" onSubmit={(event) => {
          event.preventDefault()
          let amount
          console.log(val)
          amount = val.toString()
          amount = window.web3.utils.toWei(amount, 'Ether')
          props.bid(amount)
        }}> */}
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder=""
                value={val}
                onChange={(e)=>{
                  setval(e.target.value)
                }}
              />
              <button className="btn btn-primary btn-block btn-lg" onClick={()=>{let amount
          // console.log(val)
          amount = val.toString()
          amount = window.web3.utils.toWei(amount, 'Ether')
          props.bid(0,amount)}}>bid</button>
         <div style={{display:"flex",flexDirection:"row"}}> <input
                type="text"
                className="form-control form-control"
                 value={props.highest}
                 disabled
                /> <h4>highest bid</h4></div>

                <button onClick={()=>{props.withdraw(0)}}>withdraw</button>
                
                <input
                type="text"
                className="form-control form-control-lg"
                 value={tid}
                 onChange={(e)=>{
                  settid(e.target.value)
                }}
                />
                <button className="btn btn-primary btn-block btn-lg" onClick={()=>{props.auctionend(0)}}>End auction</button>
                
           {/* </form>    */}
          </div>



          <div id = "1" style={{border:"2px solid black",margin:"10px",padding:"10px"}}>
              <h4>{genres.listOfGenresFromAPI[1].name}</h4>
              <p>{genres.listOfGenresFromAPI[1].uri}</p>
              <button onClick={() => {props.makenft(genres.listOfGenresFromAPI[1].uri,1)}}>make NFT</button>
              <button onClick={()=>{props.start(50,1)}}> start</button>

              <input
                type="text"
                className="form-control form-control-lg"
                placeholder=""
                value={val}
                onChange={(e)=>{
                  setval(e.target.value)
                }}
              />
              <button className="btn btn-primary btn-block btn-lg" onClick={()=>{let amount
          // console.log(val)
          amount = val.toString()
          amount = window.web3.utils.toWei(amount, 'Ether')
          props.bid(1,amount)}}>bid</button>
         <div style={{display:"flex",flexDirection:"row"}}> <input
                type="text"
                className="form-control form-control"
                 value={props.highest1}
                 disabled
                /> <h4>highest bid</h4>
                </div>

                <button onClick={()=>{props.withdraw(1)}}>withdraw</button>
                
                <input
                type="text"
                className="form-control form-control-lg"
                 value={tid}
                 onChange={(e)=>{
                  settid(e.target.value)
                }}
                />
                <button className="btn btn-primary btn-block btn-lg" onClick={()=>{props.auctionend(1)}}>End auction</button>
              

          </div>




          <div id = "2">
              <h4>{genres.listOfGenresFromAPI[2].name}</h4>
              <p>{genres.listOfGenresFromAPI[2].uri}</p>
              <button onClick={() => {props.makenft(genres.listOfGenresFromAPI[2].uri,2)}}>make NFT</button>
          </div>
          <div id = "3">
              <h4>{genres.listOfGenresFromAPI[3].name}</h4>
              <p>{genres.listOfGenresFromAPI[3].uri}</p>
              <button onClick={() => {props.makenft(genres.listOfGenresFromAPI[3].uri,3)}}>make NFT</button>
          </div>
          
          </>
          :null)}
          {/*  */}
          {/* <div id = {idx}>
              <h4>{item[{idx}].name}</h4>
              <p>{idx}</p>
              <button onClick={() => {props.makenft(item.uri,idx);setidx({idx: idx+1})}}>make NFT</button>
          </div> */}
        
      
      {/* <button onClick={props.makenft("1sdcbk")}>make NFT</button> */}
    </div>
    
  );
}

export default App;