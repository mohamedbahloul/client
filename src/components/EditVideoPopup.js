import React, { useState } from "react";
import axios from "axios";
import Popup from 'reactjs-popup';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker"; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import the styles for react-datepicker
import {
  PopupContainer,
  Title,
  CloseButton,
  PopupContent,
  PopupButtons,
  ConfirmButton,
  ResetButton,
  ButtonContainer,
  Input,
  Textarea,
  Label,
  ImageSection,
  InputSection,
  ImageField,
  UploadButton,
  UploadArea,
  FileInput,
  FileInputLabel,
  FileInputContainer,
} from "../styles/EditEventPopup";

const EditVideoPopup = ({ video, onSave, onClose }) => {
    const [id, setId] = useState(video.id);
  const [title, setTitle] = useState(video.title);
  const [url, setUrl] = useState(video.url);



  const handleResetChanges = () => {
    // Reset all the fields here
    setTitle(video.title);
    setUrl(video.url);
  };

  const handleSaveChanges = () => {


    const createdVideo = {
        id: id,
      title: title,
      url:url,
    };
    onSave(createdVideo);
  };


  return (
    <PopupContainer>
      <PopupContent>
        <Title>Ajouter un vidéo</Title>
        <CloseButton onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
        <InputSection>
          <Label>Titre:</Label>
          <Input
            type="text"
            placeholder="Vidéo de l'événement Lancement R3MOB"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </InputSection>
        <InputSection>
          <Label>Url de la vidéo:</Label>
          <Textarea
            rows="5"
            placeholder="Url de la vidéo ..."
            onChange={(e) => setUrl(e.target.value)}
            value={url}
          />
        </InputSection>

        <ButtonContainer>
          <ResetButton onClick={handleResetChanges}>Réinitialiser</ResetButton>
          <ConfirmButton onClick={handleSaveChanges}>Confirmer</ConfirmButton>
        </ButtonContainer>
      </PopupContent>
    </PopupContainer>
  );
}

export default EditVideoPopup;
