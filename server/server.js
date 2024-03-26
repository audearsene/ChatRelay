const express = require("express");
const { Socket } = require("socket.io");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chanelRoute = require("./Routes/chanelRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
const { joinChanel} = require("./Controllers/chatController");
const { createMessage } = require("./Controllers/messageController");
const userModel = require("./Models/userModel");
const { getUsers, getRoomUsers, userLeave } = require("./Controllers/userController");


const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
require("dotenv").config();

let onlineUsers = [];

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Update this with your frontend URL
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
}
  next();
});

app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/chanels", chanelRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get('/', (req, res) => {
  //res.send('Hello World!');
  res.sendFile('/home/aude/T-JSF-600-PAR_16/index.html');
  let name = req.protocol + '://' + req.get('host') + req.originalUrl;
}); //envoie des données au front

app.get('/nick', (req, res) => {
  res.send('Nickname');
  // res.sendFile('/home/aude/T-JSF-600-PAR_16/index.html');
  // let name = req.protocol + '://' + req.get('host') + req.originalUrl;
});

app.get('/list', (req, res) => {
  res.send('');
  // res.sendFile('/home/aude/T-JSF-600-PAR_16/index.html');
  // let name = req.protocol + '://' + req.get('host') + req.originalUrl;
});

app.get('/users', (req, res) => {
  res.send('Users listening');
  // res.sendFile('/home/aude/T-JSF-600-PAR_16/index.html');
  // let name = req.protocol + '://' + req.get('host') + req.originalUrl;
});

app.get('/msg', (req, res) => {
  res.send('message to a specific user');
  // res.sendFile('/home/aude/T-JSF-600-PAR_16/index.html');
  // let name = req.protocol + '://' + req.get('host') + req.originalUrl;
});

app.get('/message', (req, res) => {
  res.send('Messages to all on the chanel');
  //res.sendFile('/home/aude/T-JSF-600-PAR_16/index.html');
  //let name = req.protocol + '://' + req.get('host') + req.originalUrl;
});

// io.on ('connection', (socket) => {
//   console.log(socket.id, "connect!!!");
  
//   //nouvelle connexion
//   socket.on("addNewUser", (userId) => {

//     !onlineUsers.some(user => user.userId === userId) &&
//       onlineUsers.push({
//         userId,
//         socketId: socket.id
//       });

//     console.log("onlineUsers", onlineUsers);

//     io.emit("getOnlineUsers", onlineUsers);
//   });


//   // socket.on('joinChanel', ({ name, chanelname}) => {
//   //   const user = joinChanel(name, chanelname);

//   //   socket.join(user.chanelname);

//   //   socket.emit('message', formatMessage('Bienvenue !!!'));

//   //   socket.broadcast
//   //     .to(user.chanelname)
//   //     .emit(
//   //       'message',
//   //       formatMessage(`${user.name} a rejoint le serveur`)
//   //     );
//   // })

//   socket.on('disconnect', () => {
//     console.log(socket.id, "Disconneted !!!!");
//     onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)

//     io.emit("getOnlineUsers", onlineUsers);
//   });

//   socket.on('chat message', (msg) => {
//     io.emit('chat message',msg);
//   });

// });

// des qu'un user se connecte
io.on('connection', socket => {
  socket.on('joinRoom', ({ name, chanelname }) => {
    const user = userModel.findOne({name});

    socket.join(joinChanel());

    // message de bienvenue
    socket.emit('message', createMessage('Bienvenue dans la discussion'));

    // user est connecté 
    socket.broadcast
      .to(user.chanelname)
      .emit(
        'message',
        createMessage(`${user.name} a rejoint le serveur`)
      );

    // envoie les infos des users et des rooms
    io.to(user.chanelname).emit('roomUsers', {
      chanelname: user.chanelname,
      users: getRoomUsers(user.chanelname)
    });
  });

  // messager recu sur le serveur


  // lorsqu'un user quitte le serveur
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
      onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
  
      io.emit("getOnlineUsers", onlineUsers);

    if(user) {
      io.to(user.chanelname).emit(
        'message',
        createMessage(`${user.name} a quitté le serveur`)
      );

      // envoie au users et au serveur les infos
      io.to(user.chanelname).emit('roomUsers', {
        chanelname: user.chanelname,
        users: getRoomUsers(user.chanelname)
      });
    }
  });

      //  les entrées dans les salles
      socket.on("enter_room", (chanelname) => {
        // On envoie tous les messages du salon
        Chat.findAll({
            attributes: ["id", "name", "message", "chanelname", "createdAt"],
            where: {
                id: id
            }
        }).then(list => {
            socket.emit("init_messages", {messages: JSON.stringify(list)});
        });
    });

    // On gère le chat
    
    socket.on("chatMessage", (message, chanelname, msg) => {
        let users = getCurrentUser(socket.id);
        if(users == undefined)
        {
          console.log('sort');
          return 
        }
       // const user = userJoin(socket.id, username);
        const mess = message.startsWith('/');
         
        if(mess == true)
        {
            console.log(message);
            if(message.startsWith("/nick")) 
            {
               const userbefore = users.name;
               const sub =  message.substring(6);
               console.log(sub);
               if(UserList().find((user) =>{
                   return user.name == sub }) == undefined)
               {
                 console.log('test')
                io.to(users.chanelname).emit('username-change', {
                  old: userbefore,
                  new: sub
                } );
                  users.name = sub;                     
               }

               
             
            }
            else if(message.startsWith("/quit"))
            {
                  
                  const user = getCurrentUser(socket.id);
                  
                  if (user) {
                    io.to(user.chanelname).emit(
                      'message',
                      createMessage(`${user.name} a quitté le serveur`)
                     
                    );
              // envoie au users et au serveur les infos
               io.to(user.chanelname).emit('roomUsers', {
                 // room: user.room,
                 users: getRoomUsers(user.chanelname)
               });   
               user.chanelname = undefined;   

            
     
                  } 
            }
            else if(message.startsWith('/join'))
            {
              const roum = message.substring(6);
              const user = getCurrentUser(socket.id);
              console.log(roum);
              
              // user est connecté 
              socket.emit(
                'salon', {
                  ancien: user.chanelname,
                  nouveau: roum
                });
                user.chanelname = roum;
                  //message de bienvenue
            socket.emit('message', formatMessage('Bienvenue dans la discussion'));
          
           
          // user est connecté 
      socket.broadcast
           .to(user.chanelname)
           .emit(
           'message',
           formatMessage(`${user.name} a rejoint le serveur`)
           );         
          users = getCurrentUser(socket.id);
  socket.broadcast
    .to(user.chanelname)
    .emit(
      'newUser', {
          newUser: users.name
      });  

      
     
    // list cela liste l'ensemble des users 
    // emit il envoie un mesage perso pour le /msg  à un user précis 
    
            }
            else if(message.startsWith('/list'))
            {
              const user = getCurrentUser(socket.id);
              const users = UserList();
              console.log(users)
              const a = users.map((user) =>
              {
                 return user.name;
              }).join(' - ');
              io.to(user.chanelname).emit('message', createMessage("server", a)); 
            }
            
            else if(message.startsWith('/msg'))
            {
              const a = users.name;
              const [b, ...c] = message.substr(5).split(' ');
              const d = getUsers().find((user) =>{
                return user.name = b
              })
              if(d == undefined)
              {
                return
              }
              console.log(d);
              io.sockets.sockets.get(d.id).emit('message', createMessage(a, c.join(' ')));
              
          }
            else
             {
                console.log('erreur');
              }
                   
            }
            
        
        
        else
        {
          console.log("bonjour")
                  
            io.to(users.chanelname).emit('message', createMessage(users.name, message));
        
                // On stocke le message dans la base
      const test = Chat.create({
        members: users.name,
        chanelname: users.chanelname,
    }).then(() => {
     // io.in(user.username.room).emit('chatMessage', msg);
    }).catch(e => {
        console.log(e);
    }); 
        }
       

 
     });
      


});

//const port = process.env.PORT || 3000;
const uri = process.env.ATLAS_URI;

server.listen(3003, () =>
  console.log('Example app listening on port 3003!'),
);

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology:true
}).then(() => console.log("MongoDB connection is complete")).catch((error) => console.log("MongoDB connection failed: ", error.message));

