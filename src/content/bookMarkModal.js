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
            <form>
              <div class="form-group">
                <label for="name" class="control-label">名稱:</label>
                <input type="text" class="form-control" id="name" placeholder="...為這篇貼文取名">
              </div>
              <div class="form-group">
                <label for="folder" class="control-label">資料夾:</label>
                <select class="form-control" id="folder">
                  <option>書籤列</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary">新增</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

export default bookMarkModal;
