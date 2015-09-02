const bookMarkModal = `
  <div class="bootstrap-styles" id="modal-container">
    <div class="modal" id="modal" tabindex="-1" role="dialog" aria-labelledby="modalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="modalLabel">新增貼文至書籤</h4>
          </div>
          <div class="modal-body">
            <form class="form-horizontal" role="form">
              <div class="form-group">
                <label for="name" class="control-label col-sm-2">名稱:</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="name" placeholder="...為你的書籤取名" required>
                </div>
              </div>
              <div class="form-group">
                <label for="folder" class="control-label col-sm-2">資料夾:</label>
                <div class="col-sm-10">
                  <select class="form-control" id="folder">
                </div>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="submit" class="btn btn-primary" id='add-submit'>新增</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

export default bookMarkModal;
