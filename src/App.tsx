import {
  collection,
  query,
  addDoc,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { db } from "./firebase";

interface Notification {
  id?: string;
  text: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationsRef = collection(db, "notifications");

const addNotificationToFirebase = async (notificationData: Notification) => {
  try {
    await addDoc(notificationsRef, notificationData);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const markNotificationReadOnFirebase = async (notificationId: string) => {
  try {
    const docRef = doc(db, "notifications", notificationId);
    await updateDoc(docRef, {
      isRead: true,
    });
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

function App() {
  const [snapshot, loading] = useCollection(
    query(notificationsRef, orderBy("createdAt"))
  );
  const notifications = snapshot?.docs.map((doc) => {
    const notification = doc.data();
    return {
      id: doc.id,
      ...notification,
    };
  }) as Notification[];

  const addNewNotification = async (notificationText: string) => {
    const notificationData = {
      text: notificationText,
      isRead: false,
      createdAt: new Date(),
    };
    await addNotificationToFirebase(notificationData);
  };

  const markAsReadNotification = async (docId: string) => {
    await markNotificationReadOnFirebase(docId);
  };

  if (loading) {
    return <h5>Loading....!</h5>;
  }

  return (
    <>
      <h4>Push Notifications</h4>
      <div className="buttons-box">
        {["Type 1", "Type 2", "Type 3"].map((el, i) => (
          <button key={el} onClick={() => addNewNotification(el)}>
            Push Type {i + 1}
          </button>
        ))}
      </div>

      <div className="notifications-box">
        <h4>All Notifications</h4>
        <ul>
          {notifications?.map((notification) => (
            <li
              key={notification.id}
              className={!notification.isRead ? "un-read" : ""}
              onClick={() => {
                if (notification.id) {
                  markAsReadNotification(notification.id);
                }
              }}
            >
              {notification.text}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
