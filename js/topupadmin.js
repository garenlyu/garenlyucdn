//封装axios.post
Vue.prototype.postForm = function(url, formData){
  self = this;
  axios.post(url, formData).then(function (response) {
    self.opNotice(response);
    self.getTableData(self.sUrl, self.filterData);
  }).catch(function (error) {
    self.$notify({
      message: error,
      type: 'error',
      position: 'top-right'
    });
  });
};

//封装axios.get
Vue.prototype.axiosGet = function(url, params = {}){
  self = this;
  axios.get(url, {params: params}).then(function (response) {
    self.opNotice(response);
  }).catch(function (error) {
    self.$notify({
      message: error,
      type: 'error',
      position: 'top-right',
      duration: 2000
    });
  });
};

//封装$notify
Vue.prototype.opNotice = function(response){
  if(response.data[0] === true){
    self.dialogVisible = false;
    this.$notify({
      message: response.data[1],
      type: "success",
      position: 'top-right',
      duration: 2000
    });
  }else{
    this.$notify({
      message: response.data[1],
      type: "warning",
      position: 'top-right',
      duration: 2000
    });
  } 
}

//登录
Vue.prototype.signIn = function(formName, url, formData){
  this.$refs[formName].validate((valid) => {
    if (valid) {
      self = this;
      axios.post(url, formData).then(function (response) {
        self.opNotice(response);
        if(response.data[0] === true){
          location.href="/dashboard";
        }
      }).catch(function (error) {
        self.$notify({
          message: error,
          type: 'error',
          position: 'top-right'
        });
      });
    } else {
      return false;
    }
  });
};

//清除缓存
Vue.prototype.clearSession = function(){
  self = this;
  axios.get("/session/delete").then(function (response) {
    self.opNotice(response);
    location.reload();
  }).catch(function (error) {
    self.$notify({
      message: error,
      type: 'error',
      position: 'top-right',
      duration: 2000
    });
  });
};

Vue.prototype.handleCommand = function(command){
  eval("this."+command+ "()");
}

//表单检验
Vue.prototype.submitForm = function(formName, url, formData){
  this.$refs[formName].validate((valid) => {
    if (valid) {
      this.postForm(url, formData);
    } else {
      this.$notify({
        message: "请完成表单内容",
        type: "error",
        position: 'top-right'
      });
    }
  });
}

Vue.prototype.getTableData = function(url, params){
  self = this;
  self.loading = true;
  axios.get(url, {params: params}).then(function (response) {
    self.tableData = response.data;
    self.loading = false;
  }).catch(function (error) {
    self.$notify({
      message: error,
      type: 'error',
      position: 'top-right'
    });
  });
}

Vue.prototype.handleSizeChange = function($event, url){
  this.filterData.size = $event;
  this.getTableData(url, this.filterData);
};
Vue.prototype.handleCurrentChange = function($event, url){
  this.filterData.page = $event;
  this.getTableData(url, this.filterData);
};

Vue.prototype.addBtnClick = function(fromData){
  this.dialogVisible = true;
  this.dialogTitle = '新增';
  this.formData = {};
};

Vue.prototype.editBtnClick = function(row){
  this.dialogVisible = true;
  this.dialogTitle='编辑';
  this.formData = row;
};

//删除按钮点击
Vue.prototype.deleteBtnClick = function(dUrl, sUrl, rowData, filterData){
    this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        this.postForm(dUrl, {id: rowData.id});
    }).catch(() => {
        this.$notify({
            type: 'info',
            message: '已取消',
            position: 'top-right'
        });          
    });
};

//回调按钮点击
Vue.prototype.callbackBtnClick = function(row){
  console.log(111);
}

Vue.prototype.fDatetime = function(row, column, cellValue, index){
  if(cellValue == '1970-01-01 08:00:00')
    return '';

  return cellValue;
}