const bookMarkModal = `
  <div class="bootstrap-styles" id="modal-container">
    <div class="modal" id="modal" tabindex="-1" role="dialog" aria-labelledby="modalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="modalLabel">${chrome.i18n.getMessage('modalTitle')}</h4>
          </div>
          <div class="modal-body">
            <form class="form-horizontal" role="form">
              <div class="form-group">
                <label for="name" class="control-label col-sm-2">${chrome.i18n.getMessage('nameTextInputLabel')}</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="name" placeholder="${chrome.i18n.getMessage('nameTextInputPlaceholder')}" required>
                </div>
              </div>
              <div class="form-group">
                <label for="folder" class="control-label col-sm-2">${chrome.i18n.getMessage('folderSelectLabel')}</label>
                <div class="col-sm-10">
                  <select class="form-control" id="folder">
                </div>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">${chrome.i18n.getMessage('cancelButton')}</button>
            <button type="submit" class="btn btn-primary" id='add-submit'>${chrome.i18n.getMessage('submitButton')}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

export default bookMarkModal;
