import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { AuthContext } from "../helpers/AuthContext";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import PropagateLoader from "react-spinners/PropagateLoader";
export const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  gap: 5px;
  margin-top: 50px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
`;

export const PopupButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;
export const Title = styled.h1`
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 50px;
  text-align: center;
  color: black;
`;
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;
export const ConfirmButton = styled.button`
  width: 400px;
  height: 45px;
  margin: 10px;
  border: none;
  background-color: blue;
  color: white;
  border-radius: 8px;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) =>
      props.primary ? "#0056b3" : props.danger ? "#c82333" : "#e0e0e0"};
  }
`;

function Upload() {
  const [selectedZipFile, setSelectedZipFile] = useState(null);
  const [selectedJsonFile, setSelectedJsonFile] = useState({
    thoughts: null,
    links: null,
    calendarevents: null,
    attachments: null,
  });
  const { authState } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleUploadAll = async () => {
    if (
      !selectedZipFile ||
      !selectedJsonFile.thoughts ||
      !selectedJsonFile.links ||
      !selectedJsonFile.calendarevents ||
      !selectedJsonFile.attachments
    ) {
      // Show an alert to the user if any JSON file is missing
      Swal.fire({
        title: "Error!",
        text: "Please select all JSON files before uploading.",
        icon: "error",
        confirmButtonText: "Ok",
      });
      //alert("Please select all JSON files before uploading.");
      return;
    }
    setLoading(true);
    await handleZipFileUpload();
    await handleJsonFileUpload();
    await VerifyDataBase();
    setLoading(false);

    Swal.fire({
      title: "Success!",
      text: "The files are Uploaded successfully!",
      icon: "success",
      confirmButtonText: "Cool",
    });
  };

  const handleZipFileUpload = async () => {
    if (!selectedZipFile) {
      console.error("Aucun fichier ZIP sélectionné");
      return;
    }

    const formData = new FormData();
    formData.append("zipFile", selectedZipFile);

    try {
      const response = await axios.post(
        "https://back.r3mob.fr/uploadBase/folders",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("Upload de fichier ZIP (dossiers) réussi", response.data);
    } catch (error) {
      console.error("Upload de fichier ZIP (dossiers) échoué", error);
    }
  };

  const handleJsonFileUpload = async () => {
    if (!selectedJsonFile) {
      console.error("Aucun fichier JSON sélectionné");
      return;
    }

    for (const [key, value] of Object.entries(selectedJsonFile)) {
      if (!value) {
        console.error(`Aucun fichier JSON ${key} sélectionné`);
        return;
      }
      const formData = new FormData();
      formData.append("jsonFile", value);

      try {
        const response = await axios.post(
          "https://back.r3mob.fr/uploadBase/json",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Upload de fichier JSON réussi", response.data);
      } catch (error) {
        console.error("Upload de fichier JSON échoué", error);
      }
    }
  };

  const handleZipFileSelection = (event) => {
    const file = event.target.files[0];
    setSelectedZipFile(file);
  };

  const handleJsonFileSelection = (event) => {
    const file = event.target.files[0];
    setSelectedJsonFile(file);
  };

  const VerifyDataBase = async () => {
    try {
      const verifyResponse = await axios.get(
        "https://back.r3mob.fr/uploadBase/verifyFiles"
      );

      if (verifyResponse.data.error) {
        alert(verifyResponse.data.error);
      } else {
        console.log("BD Verified!!!!");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Vérification de la base de données échouée" + error,
        icon: "error",
        confirmButtonText: "ok",
      });
    }
  };

  const ClearDataBase = async () => {
    try {
      const response = await axios.post("https://back.r3mob.fr/brain/clear");
      console.log("Vidage de la base de données réussi", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(
          "Vidage de la base de données échoué",
          error.response.data
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Pas de réponse du serveur", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Erreur lors de la requête", error.message);
      }
      throw error; // Rethrow the error after logging
    }
  };

  const BackUpDataBase = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          "https://back.r3mob.fr/brain/backups"
        );
        console.log("Backup de la base de données réussi", response.data);
        resolve(response.data); // Renvoie la réponse
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Backup de la base de données échoué" + error,
          icon: "error",
          confirmButtonText: "ok",
        });
        reject(error); // Rejette la promesse en cas d'erreur
      }
    });
  };
  const UpdateDataBase = async () => {
    try {
      const response = await axios.post("https://back.r3mob.fr/brain");
      console.log("Mise à jour de la base de données réussie");
      //resolve(response.data);
    } catch (error) {
      console.error("Mise à jour de la base de données échouée", error);
      //alert(error);
      Swal.fire({
        title: "Error!",
        text: "Mise à jour de la base de données échouée" + error,
        icon: "error",
        confirmButtonText: "ok",
      });
      //reject(error); // Rejette la promesse en cas d'erreur
    }
  };
  const handleClearAndUpdate = async () => {
    setLoading(true);
    try {
      await BackUpDataBase();
      console.log("BD backed up!!!!");

      // Use Promise.all to wait for both ClearDataBase and UpdateDataBase
      await ClearDataBase();
      console.log("BD cleared!!!!");


      // Use setTimeout to call UpdateDataBase after 2 seconds
      setTimeout(async () => {
        await UpdateDataBase();

        setLoading(false);
        Swal.fire({
          title: "Success!",
          text: "The database is updated successfully!",
          icon: "success",
          confirmButtonText: "Cool",
        });
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'upload", error);
      setLoading(false);
      Swal.fire({
        title: "Error!",
        text: "Erreur lors de l upload",
        icon: "error",
        confirmButtonText: "ok",
      });
    }
  };

  if (loading) {
    return <PropagateLoader cssOverride={{
      "display": "flex",
      "justifyContent": "center", "alignItems": "center", "height": "100vh"
    }}
      color="#36d7b7" />
  }

  return authState.status == true && authState.role === true ? (
    <div style={{ marginTop: "100px" }}>
      <InputSection>
        <Label>Télécharger un fichier ZIP (pour les dossiers)</Label>
        <Input type="file" accept=".zip" onChange={handleZipFileSelection} />
      </InputSection>
      <InputSection>
        <Label>Télécharger un thoughts.json</Label>
        <Input
          type="file"
          accept=".json"
          onChange={(event) => {
            const file = event.target.files[0];
            selectedJsonFile.thoughts = file;
          }}
        />
      </InputSection>
      <InputSection>
        <Label>Télécharger un links.json</Label>
        <Input
          type="file"
          accept=".json"
          onChange={(event) => {
            const file = event.target.files[0];
            selectedJsonFile.links = file;
          }}
        />
      </InputSection>
      <InputSection>
        <Label>Télécharger un calendarevents.json</Label>
        <Input
          type="file"
          accept=".json"
          onChange={(event) => {
            const file = event.target.files[0];
            selectedJsonFile.calendarevents = file;
          }}
        />
      </InputSection>
      <InputSection>
        <Label>Télécharger un attachments.json</Label>
        <Input
          type="file"
          accept=".json"
          onChange={(event) => {
            const file = event.target.files[0];
            selectedJsonFile.attachments = file;
          }}
        />
        <ConfirmButton onClick={handleUploadAll}>Upload</ConfirmButton>
        {/* <ConfirmButton onClick={ClearDataBase}>
          Vider la base de données
        </ConfirmButton> */}
        <ConfirmButton onClick={handleClearAndUpdate}>
          Mettre à jour la base de données
        </ConfirmButton>
      </InputSection>
    </div>
  ) : (
    <Navigate to="/404" />
  );
}

export default Upload;
