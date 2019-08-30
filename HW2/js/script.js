
var bookDataFromLocalStorage = [];
var newbookID = 0;
$(function(){
    loadBookData();
    var data = [
        {text:"資料庫",value:""},
        {text:"網際網路",value:""},
        {text:"應用系統整合",value:""},
        {text:"家庭保健",value:""},
        {text:"語言",value:""}
    ]
    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: data,
        index: 0,
    });
    $("#bought_datepicker").kendoDatePicker();
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    fields: {
                        BookId: {type:"int"},
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookBoughtDate: { type: "string" }
                    }
                }
            },
            pageSize: 20,
        },
        toolbar: kendo.template("<div class='book-grid-toolbar'><input placeholder='我想要找......' oninput='onChange()' type='text'></input></div>"),
        height: 550,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "BookId", title: "書籍編號",width:"10%"},
            { field: "BookName", title: "書籍名稱", width: "50%" },
            { field: "BookCategory", title: "書籍種類", width: "10%" },
            { field: "BookAuthor", title: "作者", width: "15%" },
            { field: "BookBoughtDate", title: "購買日期", width: "15%" },
            { command: { text: "刪除", click: deleteBook }, title: " ", width: "120px" }
        ]
        
    });
})

function loadBookData(){
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem("bookData"));
    if(bookDataFromLocalStorage == null){
        bookDataFromLocalStorage = bookData;
        //newbookID=bookDataFromLocalStorage.length;
        localStorage.setItem("bookData",JSON.stringify(bookDataFromLocalStorage));
    }
    newbookID = bookDataFromLocalStorage.length;//json arry max
}
function updategrid() {
    var grid = $("#book_grid").data("kendoGrid");
    grid.destroy();
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    fields: {
                        BookId: { type: "int" },
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookBoughtDate: { type: "string" }
                    }
                }
            },
            pageSize: 20,
        },
        toolbar: kendo.template("<div class='book-grid-toolbar'><input class='book-grid-search' placeholder='我想要找......' oninput='onChange()' type='text'></input></div>"),
        height: 550,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "BookId", title: "書籍編號", width: "10%" },
            { field: "BookName", title: "書籍名稱", width: "50%" },
            { field: "BookCategory", title: "書籍種類", width: "10%" },
            { field: "BookAuthor", title: "作者", width: "15%" },
            { field: "BookBoughtDate", title: "購買日期", width: "15%" },
            { command: { text: "刪除", click: deleteBook }, title: " ", width: "120px" }
        ]

    });
}

function onChange() {
    loadBookData();
    //bookDataFromLocalStorage = JSON.parse(localStorage.getItem("bookData"));
    for (var i = 0; i < bookDataFromLocalStorage.length; i++) {
        var upperBookDataFromLocalStorage = bookDataFromLocalStorage[i].BookName.toUpperCase();
        var searchKeyword=($(".book-grid-search").val()).toUpperCase()
        if (upperBookDataFromLocalStorage.indexOf(searchKeyword)==-1) {
            bookDataFromLocalStorage.splice(i,1);
            i--;
            //console.log("i"+i);
            //console.log("LEN"+bookDataFromLocalStorage.length);
        } else {
            //console.log(bookDataFromLocalStorage[i].BookName);
        }
    }
    updategrid();
}
  
function deleteBook(e){
    var tr = $(e.target).closest('td').prev('td').prev('td').prev('td').prev('td').text();
    var i = 0;
    for (i = 0; i < bookDataFromLocalStorage.length; i++) {
        //var upperBookDataFromLocalStorage = bookDataFromLocalStorage[i].BookName.toUpperCase();
        if (bookDataFromLocalStorage[i].BookName.indexOf(tr) != -1) {
            bookDataFromLocalStorage.splice(i, 1);
            localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));
            updategrid();
            break;
        } else {
        }
    }
    //console.log(i);
}

$("#newwindow").kendoWindow({
    width: "400px",
    height: "600px",
    modal: true,
    title: "新增書籍",
    visible: false
});

$("#newclick").click(function () {
    $("#newwindow").data("kendoWindow").open();
    
});

$("#newbook").click(function () {
    var bkname = $("#book_name").val();
    var bkauthor = $("#book_author").val();
    var bkdate = $("#bought_datepicker").val();
    var bkcategory = $(".k-input").text();
    console.log(bkname == "");
    console.log(bkauthor=="");
    if ($("#book_name").val() == "" && $("#book_author").val() == "") {
        alert("請輸入書名和作者");
        return;
    } else if ($("#book_name").val()== "" ){
        alert("請輸入書名");
        return;
    } else if ($("#book_author").val() == ""){
        alert("請輸入作者");
        return;
    } else if (typeof ($("#book_author").val()) == "undefined" || typeof ($("#book_name").val()) == "undefined"){
        alert("別亂改HTML!!!!!!!");
        return;
    }
    var Obj = {
        "BookId": bookDataFromLocalStorage[newbookID - 1].BookId+1,//bookDataFromLocalStorage[bookDataFromLocalStorage.length-1].BookId+1,
        "BookCategory": bkcategory,
        "BookName": bkname,
        "BookAuthor": bkauthor,
        "BookBoughtDate": bkdate,
        "BookPublisher": "創創公司"
    }
    newbookID++;
    bookDataFromLocalStorage.push(JSON.parse(JSON.stringify(Obj)));
    localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));
    //bookDataFromLocalStorage = JSON.parse(localStorage.getItem("bookData"));
    updategrid();
    $("#book_name").val(null);
    $("#book_author").val(null);

    $(this).closest("[data-role=window]").data("kendoWindow").close();
});

$("#book_category").change(function () {
    if ($(".k-input").text() == "資料庫") {
        $(".book-image").attr("src", "image/database.jpg");
    } else if ($(".k-input").text() == "網際網路") {
        $(".book-image").attr("src", "image/internet.jpg");
    } else if ($(".k-input").text() == "應用系統整合") {
        $(".book-image").attr("src", "image/system.jpg");
    } else if ($(".k-input").text() == "家庭保健") {
        $(".book-image").attr("src", "image/home.jpg");
    } else if ($(".k-input").text() == "語言") {
        $(".book-image").attr("src", "image/language.jpg");
    }
});