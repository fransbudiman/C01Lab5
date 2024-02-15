const { MongoClient } = require("mongodb");
const SERVER_URL = "http://localhost:4000";

const mongoURL = "mongodb://127.0.0.1:27017";
const dbName = "quirknotes";

// Connect to MongoDB
let db;
let client;
 
//before all the test case connect to MongoDB
beforeAll(async ()=>{

    client = new MongoClient(mongoURL);
  
    try {
      await client.connect();
      //console.log("Connected to MongoDB");
  
      db = client.db(dbName);
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }

})



//before each test case start, drops db to reset its content
beforeEach(async () => {
  await db.dropDatabase();
});


//after all test are done, close the connection with db
afterAll(async () => {
  try {
    await client.close();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
});



test("/postNote - Post a note", async () => {
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";

  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });

  const postNoteBody = await postNoteRes.json();

  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");
});



test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
  // Code here
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";
  const createdAt = new Date();

  const collection = db.collection("notes");
    const result = await collection.insertOne({
      title,
      content,
      createdAt
    });

   
    const title2 = "NoteTitleTest2";
    const content2 = "NoteTitleContent2";
    const createdAt2 = new Date();
  
    const collection2 = db.collection("notes");
      const result2 = await collection.insertOne({
        title,
        content,
        createdAt
      });
      


  const getNotesRes = await fetch(`${SERVER_URL}/getAllNotes`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
  });

  const getNotesBody = await getNotesRes.json();
  expect(getNotesRes.status).toBe(200);
  expect(getNotesBody.response.length).toBe(2);
  
  
  
});




test("/deleteNote - Delete a note", async () => {
  // Code here
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";
  const createdAt = new Date();

  const collection = db.collection("notes");
  const result = await collection.insertOne({
      title,
      content,
      createdAt
    });
  
  const title2 = "NoteTitleTest";
  const content2 = "NoteTitleContent";
  const createdAt2 = new Date();

  const collection2 = db.collection("notes");
  const result2 = await collection.insertOne({
      title,
      content,
      createdAt
    });
    


  const deleteNoteRes = await fetch(`${SERVER_URL}/deleteNote/${result.insertedId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      _id: result.insertedId,
    }),

  });

  const deleteNoteBody = await deleteNoteRes.json();
  const itemCount = await db.collection("notes").countDocuments();
  
  expect(deleteNoteRes.status).toBe(200);
  expect(deleteNoteBody.response).toBe(`Document with ID ${result.insertedId} deleted.`);
  expect(itemCount).toBe(1);


});



test("/patchNote - Patch with content and title", async () => {
  // Code here
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";
  const createdAt = new Date();

  const collection = db.collection("notes");
  const result = await collection.insertOne({
      title,
      content,
      createdAt
    });

  const newTitle = "new title";
  const newContent= "new content";

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${result.insertedId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: newTitle,
      content: newContent,
    }),

  });

  const itemCount = await db.collection("notes").countDocuments();

  const patchNoteBody = await patchNoteRes.json();

  const patchedDocument = await collection.findOne({ _id: result.insertedId });


  expect(patchNoteRes.status).toBe(200);
  expect(patchNoteBody.response).toBe(`Document with ID ${result.insertedId} patched.`);
  expect(itemCount).toBe(1);
  expect(patchedDocument.title).toBe(newTitle);
  expect(patchedDocument.content).toBe(newContent);

});





test("/patchNote - Patch with just title", async () => {
  // Code here
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";
  const createdAt = new Date();

  const collection = db.collection("notes");
  const result = await collection.insertOne({
      title,
      content,
      createdAt
    });

  const newTitle = "new title";
  

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${result.insertedId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: newTitle,
      
    }),

  });

  const itemCount = await db.collection("notes").countDocuments();

  const patchNoteBody = await patchNoteRes.json();

  const patchedDocument = await collection.findOne({ _id: result.insertedId });


  expect(patchNoteRes.status).toBe(200);
  expect(patchNoteBody.response).toBe(`Document with ID ${result.insertedId} patched.`);
  expect(itemCount).toBe(1);
  expect(patchedDocument.title).toBe(newTitle);
  expect(patchedDocument.content).toBe(content);

});

test("/patchNote - Patch with just content", async () => {
  // Code here
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";
  const createdAt = new Date();

  const collection = db.collection("notes");
  const result = await collection.insertOne({
      title,
      content,
      createdAt
    });

  const newContent = "new content";
  

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${result.insertedId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: newContent,
      
    }),

  });

  const itemCount = await db.collection("notes").countDocuments();

  const patchNoteBody = await patchNoteRes.json();

  const patchedDocument = await collection.findOne({ _id: result.insertedId });


  expect(patchNoteRes.status).toBe(200);
  expect(patchNoteBody.response).toBe(`Document with ID ${result.insertedId} patched.`);
  expect(itemCount).toBe(1);
  expect(patchedDocument.title).toBe(title);
  expect(patchedDocument.content).toBe(newContent);
  
});

test("/deleteAllNotes - Delete one note", async () => {
  // Code here
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";
  const createdAt = new Date();

  const collection = db.collection("notes");
  const result = await collection.insertOne({
      title,
      content,
      createdAt
    });
  
  
  
  const itemCountBefore = await db.collection("notes").countDocuments();

  const deleteAllRes = await fetch (`${SERVER_URL}/deleteAllNotes`, {
    method: "Delete",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const deleteAllBody = await deleteAllRes.json();

  const itemCountAfter = await db.collection("notes").countDocuments();
  
  expect(itemCountBefore).toBe(1);
  expect(itemCountAfter).toBe(0);
  expect(deleteAllBody.response).toBe(`1 note(s) deleted.`);
  expect(deleteAllRes.status).toBe(200);
});

test("/deleteAllNotes - Delete three notes", async () => {
  // Code here
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";
  const createdAt = new Date();

  const collection = db.collection("notes");
  const result = await collection.insertOne({
      title,
      content,
      createdAt
    });
  
  
  const title2 = "NoteTitleTest2";
  const content2 = "NoteTitleContent2";
  const createdAt2 = new Date();

  const collection2 = db.collection("notes");
  const result2 = await collection.insertOne({
      title,
      content,
      createdAt
    });

    const title3 = "NoteTitleTest3";
    const content3 = "NoteTitleContent3";
    const createdAt3 = new Date();
  
    const collection3 = db.collection("notes");
    const result3 = await collection.insertOne({
        title,
        content,
        createdAt
      });

  const itemCountBefore = await db.collection("notes").countDocuments();

  const deleteAllRes = await fetch (`${SERVER_URL}/deleteAllNotes`, {
    method: "Delete",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const deleteAllBody = await deleteAllRes.json();

  const itemCountAfter = await db.collection("notes").countDocuments();
  
  expect(itemCountBefore).toBe(3);
  expect(itemCountAfter).toBe(0);
  expect(deleteAllBody.response).toBe(`3 note(s) deleted.`);
  expect(deleteAllRes.status).toBe(200);
  
});

test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
  // Code here
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";
  const createdAt = new Date();

  const collection = db.collection("notes");
  const result = await collection.insertOne({
      title,
      content,
      createdAt
    });

  const color = "#FF0000";
  
  const patchNoteRes = await fetch(`${SERVER_URL}/updateNoteColor/${result.insertedId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
            color
    }),

  });

  const patchNoteBody = await patchNoteRes.json();
  const patchedDocument = await collection.findOne({ _id: result.insertedId });

  expect(patchNoteRes.status).toBe(200);
  expect(patchNoteBody.message).toBe('Note color updated successfully.');
  expect(patchedDocument.color).toBe("#FF0000");
});