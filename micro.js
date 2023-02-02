$("#empId").focus();

var token = "90932730|-31949277002144228|90954267";
var dbname = "PROJ";
var relname = "PROJ-REL";
var baseUrl = "http://api.login2explore.com:5577";
var imlPartUrl = "/api/iml";
var irlPartUrl = "/api/irl";

function saveRecNo2LS(jsonObj) {
  var lvData = JSON.parse(jsonObj.data);
  localStorage.setItem("recno", lvData.rec_no);
}

function getProjIdJson() {
  var empIdVar = $("#empId").val();

  var jsonStrObj = {
    empId: empIdVar,
  };

  return JSON.stringify(jsonStrObj);
}

function fillData(jsonObj) {
  saveRecNo2LS(jsonObj);
  var data = JSON.parse(jsonObj.data).record;
  $("#empName").val(data.empName);
  $("#empEmail").val(data.empEmail);
  $("#empDate").val(data.empDate);
  $("#empDead").val(data.empDead);
}

function getEmp() {
  console.log("in getEmp()");

  var projIdJson = getProjIdJson();

  var getRequest = createGET_BY_KEYRequest(token, dbname, relname, projIdJson);

  jQuery.ajaxSetup({ async: false });

  var resJsonObj = executeCommandAtGivenBaseUrl(
    getRequest,
    baseUrl,
    irlPartUrl
  );

  jQuery.ajaxSetup({ async: true });

  if (resJsonObj.status === 400) {
    $("#empSave").prop("disabled", false);
    $("#empReset").prop("disabled", false);
    $("#empName").focus();
  } else if (resJsonObj.status === 200) {
    $("#empId").prop("disabled", false);
    fillData(resJsonObj);
    $("#empSave").prop("disabled", true)
    $("#empChange").prop("disabled", false);
    $("#empReset").prop("disabled", false);
    $("#empName").focus();
  }

  /* var empIdVar = $("#empId").val();
  if (empIdVar !== "") {
    $("#empSave").prop("disabled", false);

  } */
}

function validateAndGetFormData() {
  var empIdVar = $("#empId").val();
  if (empIdVar === "") {
    alert("Project ID Required Value");
    $("#empId").focus();
    return "";
  }

  var empNameVar = $("#empName").val();
  if (empNameVar === "") {
    alert("Project Name is Required Value");
    $("#empName").focus();
    return "";
  }

  var empEmailVar = $("#empEmail").val();
  if (empEmailVar === "") {
    alert("Assigned to is Required Value");
    $("#empEmail").focus();
    return "";
  }

  var empDateVar = $("#empDate").val();
  if (empDateVar === "") {
    alert("Assignment Date is Required Value");
    $("#empDate").focus();
    return "";
  }

  var empDeadVar = $("#empDead").val();
  if (empDeadVar === "") {
    alert("Deadline is Required Value");
    $("#empDead").focus();
    return "";
  }

  var jsonStrObj = {
    empId: empIdVar,
    empName: empNameVar,
    empEmail: empEmailVar,
    empDate: empDateVar,
    empDead: empDeadVar,
  };

  return JSON.stringify(jsonStrObj);
}
// This method is used to create PUT Json request.
function createPUTRequest(connToken, jsonObj, dbName, relName) {
  var putRequest =
    "{\n" +
    '"token" : "' +
    connToken +
    '",' +
    '"dbName": "' +
    dbName +
    '",\n' +
    '"cmd" : "PUT",\n' +
    '"rel" : "' +
    relName +
    '",' +
    '"jsonStr": \n' +
    jsonObj +
    "\n" +
    "}";
  return putRequest;
}

function executeCommand(reqString, dbBaseUrl, apiEndPointUrl) {
  var url = dbBaseUrl + apiEndPointUrl;

  var jsonObj;

  $.post(url, reqString, function (result) {
    jsonObj = JSON.parse(result);
  }).fail(function (result) {
    var dataJsonObj = result.responseText;
    jsonObj = JSON.parse(dataJsonObj);
  });

  return jsonObj;
}

function resetForm() {
  $("#empId").val("");
  $("#empName").val("");
  $("#empEmail").val("");
  $("#empDate").val("");
  $("#empDead").val("");
  $("#empId").focus();
  $("#empSave").prop("disabled", true);
  $("#empChange").prop("disabled", true);
  $("#empReset").prop("disabled", true);
}

function saveEmployee() {
  var jsonStr = validateAndGetFormData();

  if (jsonStr === "") {
    return;
  }

  var putReqStr = createPUTRequest(
    "90932730|-31949277002144228|90954267",
    jsonStr,
    "PROJ",
    "PROJ-REL"
  );

  alert(putReqStr);

  jQuery.ajaxSetup({ async: false });

  var resultObj = executeCommand(
    putReqStr,
    "http://api.login2explore.com:5577",
    "/api/iml"
  );

  alert(JSON.stringify(resultObj));

  jQuery.ajaxSetup({ async: true });

  resetForm();
}

function changeData(){
    $("#empReset").prop("disabled", true);
    var jsonChg = validateAndGetFormData();
    var updateRequest = createUPDATERecordRequest(token, jsonChg, dbname, relname, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(
        updateRequest,
        baseUrl,
        imlPartUrl
      );
    jQuery.ajaxSetup({async: true});
    alert(JSON.stringify(resJsonObj));
    resetForm();
    $("#empId").focus();
}
