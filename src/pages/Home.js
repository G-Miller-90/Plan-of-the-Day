import React, { useState, useEffect } from "react";
import MainNav from "../components/MainNav/MainNav";
import MainContent from "../components/MainContent";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  query,
  onSnapshot,
} from "firebase/firestore";
import { Container, Row, Col } from "react-bootstrap";

function Home() {
  const [projects, setProjects] = useState([]);
  const [show, setShow] = useState(false);
  const [closeId, setCloseId] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const todoRef = query(collection(db, "users", currentUser.uid, "projects"));
    const unsub = onSnapshot(todoRef, (querySnap) => {
      const docIdRef = [];
      querySnap.forEach((doc) => {
        docIdRef.push(doc.id);
      });
      setProjects(docIdRef);
    });
    return () => {
      unsub();
    };
  }, [currentUser.uid]);

  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setShow(true);
    setCloseId(id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "users", currentUser.uid, "projects", id));
    handleClose();
  };

  const handleCreateTodoTool = async () => {
    const userRef = collection(db, "users");

    await addDoc(collection(userRef, currentUser.uid, "projects"), {});
  };

  return (
    <Container fluid>
      <Row className="flex-xl-nowrap">
        <Col className=" nav-col col-xl-2 col-md-3 col-12 d-flex flex-column p-0">
          <MainNav handleCreateTodoTool={handleCreateTodoTool} />
        </Col>

        <Col className="col-xl-8 col-md-9 col-12">
          <MainContent
            projects={projects}
            show={show}
            closeId={closeId}
            handleClose={handleClose}
            handleShow={handleShow}
            handleDelete={handleDelete}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
