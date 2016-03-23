/**
 * Created by xufengtian on 16-3-17.
 */
 //获取worksheet_id
var aQuery = window.location.href.split("?");  //取得Get参数
var aGET = new Array();
if(aQuery.length > 1)
{
    var aBuf = aQuery[1].split("&");
    for(var i=0, iLoop = aBuf.length; i<iLoop; i++)
    {
        var aTmp = aBuf[i].split("=");  //分离key与Value
        aGET[aTmp[0]] = aTmp[1];
    }
 }
var worksheet_id = aGET['worksheet_id'];
//富文本编辑器部分
var options = {
    items: ['fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
        'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
        'insertunorderedlist'],
    afterBlur: function(){$('#content').prev('.ke-container').removeClass('focus');},
    afterFocus: function(){$('#content').prev('.ke-container').addClass('focus');}
};
var editor;
KindEditor.ready(function(K) {
        editor = K.create('#content',options)
});
//取得编辑器内容
function getEditorData() {
    //editor.sync();
    return editor.html();
}
//日期时间选择器
$(".form-datetime").datetimepicker({
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    forceParse: 0,
    showMeridian: 1,
    format: "yyyy-mm-dd hh:ii"
});

function ajax_get(worksheet_id){
    $.getJSON("/worksheet/get_worksheet/", {
        worksheet_id: worksheet_id
    }, function(data){
        var result = $.parseJSON(data);
        if (result.status == 200) {
            var worksheet_content = result.worksheet_content;
            editor.html(worksheet_content);
        }
    }, "json");
}
//工单类型变化之后，调整富文本框内的数据
$("#worksheet_type").change(function(){
    var type = $.trim($("#worksheet_type").val());
    if (type){
        $.post("/worksheet/add/get_template/", {
            worksheet_type_id:type
        }, function(result){
            if (result.status == "200") {
                var worksheet_content = result.worksheet_content;
                editor.html(worksheet_content);
            }
        }, "json");
    }
})
//提交
$("input#submit").click(function(){
    var title = $.trim($("#title").val());
    var type = $.trim($("#worksheet_type").val());
    var finishtime = $.trim($("#finishtime").val());
    var content = $.trim(getEditorData());

    if (title!="" && type!="" && finishtime!="" && content!=""){
        var this_elt = $(this);
        this_elt.addClass("disabled");
        var worksheet_data;
        if (worksheet_id){
            worksheet_data = {
            worksheet_id: worksheet_id,
            title: title,
            worksheet_type_id: type,
            finish_at: finishtime,
            content: content}
        }else{
            worksheet_data = {
            title: title,
            worksheet_type_id: type,
            finish_at: finishtime,
            content: content}
        }

        $.post("/worksheet/add/add_post/", worksheet_data, function(result){
            if (result.status == "200") {
                $("#goodnews").addClass("alert alert-success with-icon").show();
                setTimeout(function(){
                    location.href = "/worksheet/taskpad/"
                },3000);
            }else{
                $("#badnews2").addClass("alert alert-danger with-icon").show();
                setTimeout(function(){
                    $("#badnews2").removeClass("alert alert-danger with-icon").hide();
                    this_elt.removeClass("disabled");
                },3000);
            }
        }, "json");
    }else{
        $("#badnews").addClass("alert alert-warning with-icon").show();
        setTimeout(function(){
            $("#badnews").removeClass("alert alert-warning with-icon").hide();
        },3000);
    }
});