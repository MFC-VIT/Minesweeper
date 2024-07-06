import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function BoardSelect({ onBoardSizeChange }) {
  const [show, setShow] = useState(true);
  const [boardSize, setBoardSize] = useState(15);

  const handleClose = () => setShow(false);

  const handleBoardSizeChange = (event) => {
    setBoardSize(parseInt(event.target.value));
  };

  useEffect(() => {
    setShow(true);
  }, []);

  const handleSaveChanges = () => {
    console.log(`Selected board size: ${boardSize}`);
    onBoardSizeChange(boardSize);
    setShow(false);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton >
          <Modal.Title  >Select Board Size</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Choose the size of the board:</Form.Label>
              <Form.Control as="select" value={boardSize} onChange={handleBoardSizeChange}>
                <option value="10">Small (10x10)</option>
                <option value="15">Medium (15x15)</option>
                <option value="20">Large (20x20)</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BoardSelect;
