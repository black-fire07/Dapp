import React,{ useState, useEffect } from 'react'
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import { auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import App from './App';


function getModalStyle() {
    const top = 50;
    const left = 50 ;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));


export default function First() {
    const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
    const [opensignin, setopensignin] = useState(false);
  const [open,setOpen] = useState(false);
  const [username,setUsername] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [user,setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user)=>{
      if(user) {
        //log in
        console.log(user);
        setUser(user);

      } else {
        //log out
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }

  }, [user,username]);
  const signup = (event) =>{
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email,password)
      .then((authuser) => {
        return authuser.user.updateProfile({
          displayName: username
        })
      })
      .catch((err)=>alert(err.message));
      setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email,password)
      .catch((err)=>alert(err.message));

    setopensignin(false);  
  } 


    return (
        <div>
             <Modal
  open={open}
  onClose={()=>setOpen(false)}
>
<div style={modalStyle} className={classes.paper}>
      <center className="signup"  style={{display:"flex",flexDirection:"column"}}>
          <Input 
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e)=> setUsername(e.target.value)}/>

          <Input 
          placeholder="email"
          type="text"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}/>

          <Input 
          placeholder="password"
          type="password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}/>

          <Button type="Submit" onClick={signup}>Sign up</Button>

      </center>
    </div>
</Modal>
<Modal
  open={opensignin}
  onClose={()=>setopensignin(false)}
>
<div style={modalStyle} className={classes.paper}>
      <center className="signup" style={{display:"flex",flexDirection:"column"}}>

          <Input 
          placeholder="email"
          type="text"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}/>

          <Input 
          placeholder="password"
          type="password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}/>

          <Button type="Submit" onClick={signIn}>Sign In</Button>

      </center>
    </div>
</Modal>

{user ? (
          <Button onClick = {()=>auth.signOut()}>Log Out</Button>):(
            <div className="login">
              <Button onClick = {()=>setopensignin(true)}>Sign In</Button>
            <Button onClick = {()=>setOpen(true)}>Sign Up</Button>
            </div>
  )}
  {user? <App/>:<div> <h1>Signup to see the content</h1>  </div>}

        </div>
    )
}
