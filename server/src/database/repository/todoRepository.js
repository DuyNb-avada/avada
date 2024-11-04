import admin from "firebase-admin";
import serviceAccount from "../../../serviceAccount.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const dbTodo = db.collection("todoes");

/**
 * @param {number} limit
 * @param {string} order
 *
 * @returns {Object[]}
 */
async function getAll(limit, order) {
  let query = dbTodo.orderBy("id", order === "asc" ? "asc" : "desc");
  if (limit !== undefined) {
    query = query.limit(limit);
  }
  const snapshot = await query.get();
  const todoes = snapshot.docs.map((doc) => ({ ...doc.data(), uuid: doc.id }));
  return todoes;
}


/**
 *
 * @param {number} id
 * @returns {Object | undefined}
 */
async function getOne(id) {
  const snapshot = await dbTodo.doc(id).get();
  return snapshot.exists ? { ...snapshot.data(), uuid: snapshot.id } : undefined;
}
/**
 *
 * @param {number} id
 * @returns {boolean}
 */
async function deleteOne(id) {
  try {
    const docRef = dbTodo.doc(id);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      return false;
    }
    await docRef.delete();
    return true;
  } catch (error) {
    throw new Error("Could not delete the document: " + error.message);
  }
}


/**
 *
 * @param {Object} data
 */
async function add(data) {
  const snapshot = await dbTodo.orderBy("id", "desc").limit(1).get();
  const maxId = snapshot.empty ? 0 : snapshot.docs[0].data().id;
  const newProduct = { ...data, id: maxId + 1 };
  const doc = await dbTodo.add(newProduct);
  return { ...newProduct, uuid: doc.id };
}

/**
 *
 * @param {Object} data
 * @param {number} id
 * @returns {boolean}
 */
async function update(id, data) {
  try {
    const docRef = dbTodo.doc(id);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      return false;
    }
    await docRef.update(data);
    return true;
  } catch (error) {
    throw new Error("Could not update the document");
  }
}

/**
 *
 * @param {Object} data
 * @returns {boolean}
 */
async function action(data) {
  try {
    const snapshot = await dbTodo.orderBy("id", "desc").get();
    const batch = db.batch();
    switch (data.action) {
      case "complete":
      case "incomplete":
        snapshot.forEach((doc) => {
          if (data.ids.includes(doc.id)) { 
            batch.update(doc.ref, {
              isCompleted: data.action === "complete",
            });
          }
        });
        break;

      case "delete":
        snapshot.forEach((doc) => {
          if (data.ids.includes(doc.id)) {
            batch.delete(doc.ref);
          }
        });
        break;

      default:
        throw new Error("Invalid action type");
    }

    await batch.commit();
    return true;
  } catch (error) {
    throw new Error("Action failed: " + error.message);
  }
}



export { getAll, getOne, deleteOne, add, update, action };
