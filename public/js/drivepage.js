const UploadForm = document.querySelector("#UploadFile_Form");
const CreateFolder = document.querySelector("#CreateFolder_Form");
const EditForm = document.querySelector("#editform_id");
const EditFolerForm = document.querySelector("#editfolderform_id");

document.querySelector(".Upload_file").addEventListener("click", () => {
  UploadForm.showModal();
});

document.querySelector(".Cancel_UploadFile").addEventListener("click", () => {
  UploadForm.close();
});

document.querySelector(".Create_Folder").addEventListener("click", () => {
  CreateFolder.showModal();
});

document.querySelector(".CancelCreateFolder").addEventListener("click", () => {
  CreateFolder.close();
});

document.querySelector(".Editfile").addEventListener("click", () => {
  EditForm.showModal();
});

document.querySelector(".Close_edit").addEventListener("click", () => {
  EditForm.close();
});

document.querySelector(".Close_edit_form").addEventListener("click", () => {
  EditFolerForm.close();
});

document.querySelector(".editfolder").addEventListener("click", () => {
  EditFolerForm.showModal();
});
